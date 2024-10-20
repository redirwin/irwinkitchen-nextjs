"use client";

import { useState, useRef, useEffect } from "react"
import { Button } from "@/app/components/ui/button"
import { Input } from "@/app/components/ui/input"
import { Label } from "@/app/components/ui/label"
import { Textarea } from "@/app/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/app/components/ui/select"
import { useRouter } from "next/navigation"
import { useRecipes } from '@/lib/recipeContext'
import { useToast } from "@/app/components/ui/use-toast"
import Image from 'next/image';
import { Loader2 } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/app/components/ui/dialog"
import { TagInput } from './TagInput';
import { Card, CardContent, CardHeader, CardTitle } from "@/app/components/ui/card"
import { ChefHat, Clipboard, ListOrdered, Clock, BarChart, Users, Tags, Image as ImageIcon, PlusCircle, X, Trash2, Flame } from "lucide-react"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/app/components/ui/collapsible"
import { ChevronDown, ChevronUp } from "lucide-react"

interface RecipeFormProps {
  initialRecipe?: Recipe;
  slug?: string;
  onUpdate?: (updatedRecipe: Recipe) => void;
  isEditing?: boolean;
}

// Add this new component at the top of the file, outside the RecipeForm component
interface CollapsibleCardProps {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  defaultOpen?: boolean;
  hasError?: boolean;
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
}

function CollapsibleCard({ 
  title, 
  icon, 
  children, 
  hasError = false, 
  isOpen, 
  onOpenChange 
}: CollapsibleCardProps) {
  return (
    <Collapsible open={isOpen} onOpenChange={onOpenChange}>
      <Card className={hasError ? 'border-red-500' : ''}>
        <CollapsibleTrigger asChild>
          <CardHeader className="cursor-pointer">
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center">
                {icon}
                <span className="ml-2">{title}</span>
              </div>
              {isOpen ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
            </CardTitle>
          </CardHeader>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <CardContent>{children}</CardContent>
        </CollapsibleContent>
      </Card>
    </Collapsible>
  );
}

export function RecipeForm({ initialRecipe, slug, onUpdate, isEditing = false }: RecipeFormProps) {
  const router = useRouter()
  const { recipes, addRecipe, updateRecipe } = useRecipes()
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
  const [allTags, setAllTags] = useState<string[]>([]);
  const [sectionErrors, setSectionErrors] = useState({
    basicInfo: false,
    ingredients: false,
    steps: false,
    cookingDetails: false,
    tags: false,
    image: false,
  });
  const [sectionStates, setSectionStates] = useState({
    basicInfo: true,  // This will be open by default
    ingredients: false,
    steps: false,
    cookingDetails: false,
    tags: false,
    image: false,
  });
  const formRef = useRef<HTMLFormElement>(null);
  const headingText = isEditing && initialRecipe
    ? `Editing ${initialRecipe.name}`
    : "Adding a New Recipe";

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

  const validateForm = () => {
    if (!formRef.current) return false;

    const form = formRef.current;
    const inputs = form.querySelectorAll('input, textarea, select');
    let isValid = true;
    const newSectionErrors = { ...sectionErrors };

    inputs.forEach((input) => {
      if (!(input as HTMLInputElement).checkValidity()) {
        isValid = false;
        const section = input.closest('[data-section]');
        if (section) {
          const sectionName = section.getAttribute('data-section') as keyof typeof sectionErrors;
          newSectionErrors[sectionName] = true;
        }
      }
    });

    setSectionErrors(newSectionErrors);
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    // First, expand all sections
    setSectionStates(prev => Object.fromEntries(Object.keys(prev).map(key => [key, true])));

    // Use setTimeout to allow the DOM to update before validation
    setTimeout(() => {
      if (!validateForm()) {
        // Scroll to the first error
        const firstErrorSection = Object.entries(sectionErrors).find(([_, hasError]) => hasError)?.[0];
        if (firstErrorSection) {
          const sectionElement = formRef.current?.querySelector(`[data-section="${firstErrorSection}"]`);
          if (sectionElement) {
            (sectionElement as HTMLElement).scrollIntoView({ behavior: 'smooth' });
          }
        }
        return;
      }

      // If validation passes, proceed with form submission
      submitForm();
    }, 0);
  };

  const submitForm = async () => {
    if (!formRef.current) {
      console.error('Form element not found');
      return;
    }

    const formData = new FormData(formRef.current);

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
        throw new Error(errorData.error);
      }

      const savedRecipe = await response.json();

      toast({
        title: initialRecipe ? "Recipe Updated" : "Recipe Added",
        description: "Your recipe has been saved successfully.",
      });

      if (initialRecipe && onUpdate) {
        onUpdate(savedRecipe);
      }
      
      router.push(`/recipes/${savedRecipe.slug}`);
    } catch (error) {
      console.error('Error saving recipe:', error);
      toast({
        title: error.title || "Error",
        description: error.description || error.message || 'An error occurred while saving the recipe',
        variant: "destructive",
      });
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
        const errorData = await response.json();
        throw new Error(errorData.error);
      }

      toast({
        title: "Recipe Deleted",
        description: "Your recipe has been successfully deleted.",
      });

      router.push('/');
    } catch (error) {
      console.error('Error deleting recipe:', error);
      toast({
        title: error.title || "Deletion Failed",
        description: error.description || error.message || 'An error occurred while deleting the recipe',
        variant: "destructive",
      });
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

  useEffect(() => {
    const fetchAllTags = () => {
      try {
        const uniqueTags = Array.from(new Set(recipes.flatMap(recipe => 
          Array.isArray(recipe.tags) ? recipe.tags.map(tag => tag.name) : recipe.tags.split(',').map(tag => tag.trim())
        ))).sort();
        setAllTags(uniqueTags);
      } catch (error) {
        console.error('Error setting tags:', error);
      }
    };
    fetchAllTags();
  }, [recipes]);

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
    <form onSubmit={handleSubmit} ref={formRef} className="space-y-8 max-w-2xl mx-auto px-4 sm:px-0">
      <div className="mb-8">
        <h1 className="text-3xl font-semibold flex items-center space-x-2 pb-2 border-b border-gray-200">
          <span>{headingText}</span>
        </h1>
      </div>
      <div data-section="basicInfo">
        <CollapsibleCard 
          title="Basic Information" 
          icon={<ChefHat className="h-5 w-5 mr-2" />}
          hasError={sectionErrors.basicInfo}
          isOpen={sectionStates.basicInfo}
          onOpenChange={(isOpen) => setSectionStates(prev => ({ ...prev, basicInfo: isOpen }))}
        >
          <CardContent className="space-y-4">
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
                maxLength={100}
              />
            </div>
            <div>
              <Label htmlFor="description">Full Description</Label>
              <Textarea id="description" name="description" value={recipe.description} onChange={handleChange} required />
            </div>
          </CardContent>
        </CollapsibleCard>
      </div>

      <div data-section="ingredients">
        <CollapsibleCard 
          title="Ingredients" 
          icon={<Clipboard className="h-5 w-5 mr-2" />}
          hasError={sectionErrors.ingredients}
          isOpen={sectionStates.ingredients}
          onOpenChange={(isOpen) => setSectionStates(prev => ({ ...prev, ingredients: isOpen }))}
        >
          <CardContent>
            {recipe.ingredients.map((ingredient, index) => (
              <div key={index} className="flex items-center space-x-2 mb-4">
                <div className="flex-grow flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-2">
                  <Input
                    placeholder="Amount"
                    value={ingredient.amount}
                    onChange={(e) => handleIngredientChange(index, 'amount', e.target.value)}
                    className="w-full sm:w-1/3"
                  />
                  <Input
                    placeholder="Ingredient name"
                    value={ingredient.name}
                    onChange={(e) => handleIngredientChange(index, 'name', e.target.value)}
                    className="w-full sm:w-2/3"
                  />
                </div>
                {recipe.ingredients.length > 1 && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => removeIngredient(index)}
                    className="flex-shrink-0"
                  >
                    <X className="h-4 w-4" />
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
              <PlusCircle className="h-4 w-4 mr-2" />
              Add Ingredient
            </Button>
          </CardContent>
        </CollapsibleCard>
      </div>

      <div data-section="steps">
        <CollapsibleCard 
          title="Recipe Steps" 
          icon={<ListOrdered className="h-5 w-5 mr-2" />}
          hasError={sectionErrors.steps}
          isOpen={sectionStates.steps}
          onOpenChange={(isOpen) => setSectionStates(prev => ({ ...prev, steps: isOpen }))}
        >
          <CardContent>
            {recipe.steps.map((step, index) => (
              <div key={index} className="flex items-start space-x-2 mb-4">
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
                    className="flex-shrink-0 mt-1"
                  >
                    <X className="h-4 w-4" />
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
              <PlusCircle className="h-4 w-4 mr-2" />
              Add Step
            </Button>
          </CardContent>
        </CollapsibleCard>
      </div>

      <div data-section="cookingDetails">
        <CollapsibleCard 
          title="Cooking Details" 
          icon={<Flame className="h-5 w-5 mr-2" />}
          hasError={sectionErrors.cookingDetails}
          isOpen={sectionStates.cookingDetails}
          onOpenChange={(isOpen) => setSectionStates(prev => ({ ...prev, cookingDetails: isOpen }))}
        >
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="cookingTime" className="flex items-center mb-2 pl-2">
                  <Clock className="h-4 w-4 mr-2" />
                  <span>Cooking Time</span>
                </Label>
                <Input id="cookingTime" name="cookingTime" value={recipe.cookingTime} onChange={handleChange} />
              </div>
              <div>
                <Label htmlFor="difficulty" className="flex items-center mb-2 pl-2">
                  <BarChart className="h-4 w-4 mr-2" />
                  <span>Difficulty</span>
                </Label>
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
                <Label htmlFor="servingSize" className="flex items-center mb-2 pl-2">
                  <Users className="h-4 w-4 mr-2" />
                  <span>Serving Size</span>
                </Label>
                <Input id="servingSize" name="servingSize" type="number" value={recipe.servingSize} onChange={handleChange} />
              </div>
            </div>
          </CardContent>
        </CollapsibleCard>
      </div>

      <div data-section="tags">
        <CollapsibleCard 
          title="Tags" 
          icon={<Tags className="h-5 w-5 mr-2" />}
          hasError={sectionErrors.tags}
          isOpen={sectionStates.tags}
          onOpenChange={(isOpen) => setSectionStates(prev => ({ ...prev, tags: isOpen }))}
        >
          <CardContent>
            <TagInput
              value={recipe.tags}
              onChange={(value) => setRecipe(prev => ({ ...prev, tags: value }))}
              allTags={allTags}
              maxTags={6}
            />
          </CardContent>
        </CollapsibleCard>
      </div>

      <div data-section="image">
        <CollapsibleCard 
          title="Recipe Image" 
          icon={<ImageIcon className="h-5 w-5 mr-2" />}
          hasError={sectionErrors.image}
          isOpen={sectionStates.image}
          onOpenChange={(isOpen) => setSectionStates(prev => ({ ...prev, image: isOpen }))}
        >
          <CardContent>
            <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
              {hasExistingImage ? (
                <div className="relative">
                  <Image
                    src={imagePreview || initialRecipe?.imageUrl || ''}
                    alt="Recipe preview"
                    width={128}
                    height={128}
                    className="object-cover rounded-md"
                  />
                  <Button 
                    type="button" 
                    onClick={handleRemoveImage} 
                    variant="destructive" 
                    size="icon"
                    className="absolute top-2 right-2 h-8 w-8 rounded-full opacity-70 hover:opacity-100 transition-opacity"
                    aria-label="Remove image"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ) : (
                <div className="space-y-1 text-center">
                  <ImageIcon className="mx-auto h-12 w-12 text-gray-400" />
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
          </CardContent>
        </CollapsibleCard>
      </div>

      <div className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
        <div className="w-full sm:w-auto">
          {isEditing && (
            <Button 
              type="button" 
              variant="destructive" 
              onClick={() => setShowDeleteModal(true)} 
              className="w-full sm:w-auto"
              aria-label="Delete Recipe"
            >
              <Trash2 className="h-5 w-5" />
            </Button>
          )}
        </div>
        <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2 w-full sm:w-auto">
          <Button type="button" variant="outline" onClick={handleCancel} className="w-full sm:w-auto">Cancel</Button>
          <Button type="submit" className="w-full sm:w-auto">{initialRecipe ? 'Save Recipe' : 'Add Recipe'}</Button>
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
