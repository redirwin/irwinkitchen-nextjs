"use client";

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { PlusCircledIcon, Cross2Icon } from "@radix-ui/react-icons"
import { useRouter } from "next/navigation"
import { useRecipes } from '@/lib/recipeContext'

export function RecipeForm() {
  const router = useRouter()
  const { addRecipe } = useRecipes()
  const [recipe, setRecipe] = useState({
    name: '',
    shortDescription: '',
    description: '',
    ingredients: [{ amount: '', name: '' }],
    steps: [''],
    cookingTime: '',
    difficulty: '',
    servingSize: '',
    tags: '',
    image: null as File | null,
  })
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setRecipe(prev => ({ ...prev, [name]: value }))
  }

  const handleIngredientChange = (index: number, field: 'amount' | 'name', value: string) => {
    setRecipe(prev => ({
      ...prev,
      ingredients: prev.ingredients.map((ingredient, i) => 
        i === index ? { ...ingredient, [field]: value } : ingredient
      )
    }))
  }

  const addIngredient = () => {
    setRecipe(prev => ({
      ...prev,
      ingredients: [...prev.ingredients, { amount: '', name: '' }]
    }))
  }

  const removeIngredient = (index: number) => {
    setRecipe(prev => {
      // Only remove if there's more than one ingredient
      if (prev.ingredients.length > 1) {
        return {
          ...prev,
          ingredients: prev.ingredients.filter((_, i) => i !== index)
        }
      }
      // If there's only one ingredient, return the previous state unchanged
      return prev
    })
  }

  const handleStepChange = (index: number, value: string) => {
    setRecipe(prev => ({
      ...prev,
      steps: prev.steps.map((step, i) => 
        i === index ? value : step
      )
    }))
  }

  const addStep = () => {
    setRecipe(prev => ({
      ...prev,
      steps: [...prev.steps, '']
    }))
  }

  const removeStep = (index: number) => {
    setRecipe(prev => {
      // Only remove if there's more than one step
      if (prev.steps.length > 1) {
        return {
          ...prev,
          steps: prev.steps.filter((_, i) => i !== index)
        }
      }
      // If there's only one step, return the previous state unchanged
      return prev
    })
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // Check file size
      if (file.size > 10 * 1024 * 1024) { // 10MB in bytes
        alert("File is too large. Maximum size is 10MB.")
        return
      }

      // Check file type
      const allowedTypes = ['image/jpeg', 'image/png', 'image/webp']
      if (!allowedTypes.includes(file.type)) {
        alert("Invalid file type. Please upload a JPEG, PNG, or WebP image.")
        return
      }

      // Check image dimensions
      const img = new Image()
      img.onload = () => {
        URL.revokeObjectURL(img.src)
        if (img.width > 1024 || img.height > 1024) {
          alert("Image dimensions are too large. Maximum size is 1024x1024 pixels.")
          return
        }
        
        setRecipe(prev => ({ ...prev, image: file }))
        setImagePreview(URL.createObjectURL(file))
      }
      img.onerror = () => {
        alert("Error loading image. Please try again.")
      }
      img.src = URL.createObjectURL(file)
    }
  }

  const handleImageClick = () => {
    fileInputRef.current?.click()
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newRecipe = {
      id: Date.now().toString(), // Generate a unique ID
      name: recipe.name,
      shortDescription: recipe.shortDescription,
      description: recipe.description,
      cookingTime: recipe.cookingTime,
      difficulty: recipe.difficulty,
      servingSize: recipe.servingSize,
      ingredients: recipe.ingredients,
      steps: recipe.steps,
      tags: recipe.tags,
    };

    addRecipe(newRecipe);
    console.log('New recipe added:', newRecipe);
    router.push('/'); // Redirect to the home page after saving
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl mx-auto">
      <div>
        <Label htmlFor="name">Recipe Name</Label>
        <Input id="name" name="name" value={recipe.name} onChange={handleChange} required />
      </div>
      <div>
        <Label htmlFor="shortDescription">Short Description</Label>
        <Input 
          id="shortDescription" 
          name="shortDescription" 
          value={recipe.shortDescription} 
          onChange={handleChange} 
          required 
          maxLength={100} // Limit the short description to 100 characters
        />
      </div>
      <div>
        <Label htmlFor="description">Full Description</Label>
        <Textarea id="description" name="description" value={recipe.description} onChange={handleChange} required />
      </div>
      <div>
        <Label>Ingredients</Label>
        {recipe.ingredients.map((ingredient, index) => (
          <div key={index} className="flex items-center space-x-2 mt-2">
            <Input
              placeholder="Amount"
              value={ingredient.amount}
              onChange={(e) => handleIngredientChange(index, 'amount', e.target.value)}
              className="w-1/3"
            />
            <Input
              placeholder="Ingredient name"
              value={ingredient.name}
              onChange={(e) => handleIngredientChange(index, 'name', e.target.value)}
              className="w-2/3"
            />
            {recipe.ingredients.length > 1 && (
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => removeIngredient(index)}
              >
                <Cross2Icon className="h-4 w-4" />
              </Button>
            )}
          </div>
        ))}
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={addIngredient}
          className="mt-2"
        >
          <PlusCircledIcon className="h-4 w-4 mr-2" />
          Add Ingredient
        </Button>
      </div>
      <div>
        <Label>Recipe Steps</Label>
        {recipe.steps.map((step, index) => (
          <div key={index} className="flex items-start space-x-2 mt-2">
            <Textarea
              placeholder={`Step ${index + 1}`}
              value={step}
              onChange={(e) => handleStepChange(index, e.target.value)}
              className="flex-grow"
            />
            {recipe.steps.length > 1 && (
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => removeStep(index)}
              >
                <Cross2Icon className="h-4 w-4" />
              </Button>
            )}
          </div>
        ))}
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={addStep}
          className="mt-2"
        >
          <PlusCircledIcon className="h-4 w-4 mr-2" />
          Add Step
        </Button>
      </div>
      <div className="grid grid-cols-3 gap-4">
        <div>
          <Label htmlFor="cookingTime">Cooking Time</Label>
          <Input id="cookingTime" name="cookingTime" value={recipe.cookingTime} onChange={handleChange} />
        </div>
        <div>
          <Label htmlFor="difficulty">Difficulty</Label>
          <Select name="difficulty" onValueChange={(value) => setRecipe(prev => ({ ...prev, difficulty: value }))}>
            <SelectTrigger>
              <SelectValue placeholder="Select difficulty" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Easy">Easy</SelectItem>
              <SelectItem value="Medium">Medium</SelectItem>
              <SelectItem value="Hard">Hard</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="servingSize">Serving Size</Label>
          <Input id="servingSize" name="servingSize" type="number" value={recipe.servingSize} onChange={handleChange} />
        </div>
      </div>
      <div>
        <Label htmlFor="tags">Tags (comma-separated)</Label>
        <Input id="tags" name="tags" value={recipe.tags} onChange={handleChange} />
      </div>
      <div>
        <Label htmlFor="image">Recipe Image</Label>
        <div 
          onClick={handleImageClick}
          className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md cursor-pointer"
        >
          <div className="space-y-1 text-center">
            {imagePreview ? (
              <img src={imagePreview} alt="Recipe preview" className="mx-auto h-32 w-32 object-cover" />
            ) : (
              <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true">
                <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            )}
            <div className="flex text-sm text-gray-600">
              <label htmlFor="file-upload" className="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500">
                <span>Upload a file</span>
                <input 
                  id="file-upload" 
                  name="file-upload" 
                  type="file" 
                  className="sr-only" 
                  ref={fileInputRef}
                  onChange={handleImageChange}
                  accept="image/jpeg,image/png,image/webp"
                />
              </label>
              <p className="pl-1">or drag and drop</p>
            </div>
            <p className="text-xs text-gray-500">
              JPEG, PNG, WebP up to 10MB and 1024x1024px
            </p>
          </div>
        </div>
      </div>
      <Button type="submit">Add Recipe</Button>
    </form>
  )
}