"use client";

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { PlusCircledIcon, Cross2Icon } from "@radix-ui/react-icons"
import { useRouter } from "next/navigation"
import { useRecipes } from '@/lib/recipeContext'
import { useToast } from "@/components/ui/use-toast"
import Image from 'next/image';
import { Loader2 } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"

interface RecipeFormProps {
  initialRecipe?: Recipe;
  slug?: string;
  onUpdate?: (updatedRecipe: Recipe) => void;
  isEditing?: boolean;
}

export function RecipeForm({ initialRecipe, slug, onUpdate, isEditing = false }: RecipeFormProps) {
  const router = useRouter()
  const { addRecipe, updateRecipe } = useRecipes()
  const { toast } = useToast()
  const [recipe, setRecipe] = useState(() => {
    if (initialRecipe) {
      return {
        ...initialRecipe,
        tags: initialRecipe.tags.map(tag => tag.name).join(', '),
        steps: initialRecipe.steps.map(step => step.content)
      };
    }
    return {
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
    };
  })
  const [imagePreview, setImagePreview] = useState<string | null>(initialRecipe?.image || null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [error, setError] = useState<string | null>(null)
  const [hasExistingImage, setHasExistingImage] = useState(!!initialRecipe?.imageUrl)
  const [imageToRemove, setImageToRemove] = useState(false)
  const [isLoading, setIsLoading] = useState(!!initialRecipe);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

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
      steps: prev.steps.map((step, i) => {
        if (i === index) {
          return typeof step === 'string' ? value : { ...step, content: value };
        }
        return step;
      })
    }));
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

      // Create a URL for the file
      const objectUrl = URL.createObjectURL(file)

      // Use FileReader to check image dimensions
      const reader = new FileReader()
      reader.onload = (event) => {
        const img = document.createElement('img')
        img.onload = () => {
          if (img.width > 3000 || img.height > 3000) {
            URL.revokeObjectURL(objectUrl)
            alert("Image dimensions are too large. Maximum size is 3000x3000 pixels.")
            return
          }
          setRecipe(prev => ({ ...prev, image: file }))
          setImagePreview(objectUrl)
          setHasExistingImage(true)
        }
        img.src = event.target?.result as string
      }
      reader.readAsDataURL(file)
    }
  }

  const handleImageClick = () => {
    fileInputRef.current?.click()
  }

  const handleRemoveImage = () => {
    setRecipe(prev => ({ ...prev, image: null }));
    setImagePreview(null);
    setHasExistingImage(false);
    setImageToRemove(true);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    const formData = new FormData(e.currentTarget);

    // Format ingredients
    formData.set('ingredients', JSON.stringify(recipe.ingredients.map(({ id, recipeId, ...rest }) => rest)));

    // Format steps
    formData.set('steps', JSON.stringify(recipe.steps.map((step, index) => {
      if (typeof step === 'string') {
        return { order: index + 1, content: step };
      } else if (typeof step === 'object' && step.content) {
        return { order: index + 1, content: step.content };
      }
      return { order: index + 1, content: '' };
    })));

    // Format tags
    formData.set('tags', recipe.tags);

    if (imageToRemove) {
      formData.append('removeImage', 'true');
    } else if (recipe.image) {
      formData.append('image', recipe.image);
    }

    try {
      const url = initialRecipe ? `/api/recipes/${slug}` : '/api/recipes';
      const method = initialRecipe ? 'PUT' : 'POST';
      const response = await fetch(url, {
        method: method,
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to save recipe');
      }

      const savedRecipe = await response.json();

      toast({
        title: initialRecipe ? "Recipe Updated" : "Recipe Added",
        description: "Your recipe has been saved successfully.",
      });

      if (initialRecipe && onUpdate) {
        onUpdate(savedRecipe);
      }
      
      // Redirect to the recipe detail page
      router.push(`/recipes/${savedRecipe.slug}`);
    } catch (error) {
      console.error('Error saving recipe:', error);
      setError(error.message || 'An error occurred while saving the recipe');
    }
  };

  const handleCancel = () => {
    if (slug) {
      router.push(`/recipes/${slug}`);
    } else {
      router.push('/');
    }
  };

  const handleDelete = async () => {
    try {
      const response = await fetch(`/api/recipes/${slug}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete recipe');
      }

      toast({
        title: "Recipe Deleted",
        description: "Your recipe has been successfully deleted.",
      });

      router.push('/'); // Redirect to home page after deletion
    } catch (error) {
      console.error('Error deleting recipe:', error);
      setError(error.message || 'An error occurred while deleting the recipe');
    } finally {
      setShowDeleteModal(false);
    }
  };

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        setError(null);
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [error]);

  useEffect(() => {
    const fetchRecipe = async () => {
      if (initialRecipe) {
        setIsLoading(true);
        try {
          // Simulate fetching recipe details if needed
          // In a real scenario, you might want to fetch fresh data from the API
          setRecipe({
            ...initialRecipe,
            tags: initialRecipe.tags.map(tag => tag.name).join(', ')
          });
          setImagePreview(initialRecipe.imageUrl || null);
          setHasExistingImage(!!initialRecipe.imageUrl);
        } catch (error) {
          console.error('Error fetching recipe:', error);
          toast({
            title: "Error",
            description: "Failed to load recipe details",
            variant: "destructive",
          });
        } finally {
          setIsLoading(false);
        }
      }
    };
    fetchRecipe();
  }, [initialRecipe, toast]);

  const DeleteConfirmationModal = () => (
    <Dialog open={showDeleteModal} onOpenChange={setShowDeleteModal}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Confirm Deletion</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete this recipe? This action cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={() => setShowDeleteModal(false)}>Cancel</Button>
          <Button variant="destructive" onClick={handleDelete}>Delete</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
        <p className="mt-4 text-lg text-muted-foreground">Loading recipe details...</p>
      </div>
    );
  }

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
              value={step.content}
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
        <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
          {hasExistingImage ? (
            <div className="space-y-1 text-center">
              <Image
                src={imagePreview || initialRecipe?.imageUrl || ''}
                alt="Recipe preview"
                width={128}
                height={128}
                className="mx-auto object-cover"
              />
              <div className="flex justify-center">
                <Button type="button" onClick={handleRemoveImage} variant="outline" size="sm">
                  Remove
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-1 text-center">
              <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true">
                <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
              </svg>
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
                JPEG, PNG, WebP up to 10MB and 3000x3000px
              </p>
            </div>
          )}
        </div>
      </div>
      <div className="flex justify-between items-center">
        <div className="flex space-x-2">
          {isEditing && (
            <Button type="button" variant="destructive" onClick={() => setShowDeleteModal(true)}>Delete Recipe</Button>
          )}
        </div>
        <div className="flex space-x-2">
          <Button type="button" variant="outline" onClick={handleCancel}>Cancel</Button>
          <Button type="submit">{initialRecipe ? 'Save Recipe' : 'Add Recipe'}</Button>
        </div>
      </div>

      {error && (
        <div className="fixed bottom-4 right-4 bg-white dark:bg-neutral-950 border border-red-500 text-red-700 px-7 py-3 rounded shadow-lg z-[100] transition-opacity duration-500 opacity-100">
          <strong className="font-bold">Error: </strong>
          <span className="block sm:inline">{error}</span>
          <button
            onClick={() => setError(null)}
            className="absolute top-0 right-0 mt-2 mr-2 text-red-500 hover:text-red-700"
            aria-label="Close error message"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      )}

      <DeleteConfirmationModal />
    </form>
  )
}
