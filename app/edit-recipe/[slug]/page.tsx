"use client";

import { RecipeForm } from '@/app/components/RecipeForm';
import { notFound, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { Recipe } from '@/types/Recipe';
import { Loader2 } from 'lucide-react';

export default function EditRecipePage({ params }: { params: { slug: string } }) {
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    async function fetchRecipe() {
      try {
        if (!params.slug) {
          notFound();
        }

        const response = await fetch(`/api/recipes/${params.slug}`);
        if (!response.ok) {
          notFound();
        }

        const fetchedRecipe = await response.json();
        setRecipe(fetchedRecipe);
      } catch (error) {
        console.error('Error fetching recipe:', error);
        notFound();
      } finally {
        setIsLoading(false);
      }
    }

    fetchRecipe();
  }, [params.slug]);

  const handleRecipeUpdate = async (updatedRecipe: Recipe) => {
    try {
      const response = await fetch(`/api/recipes/${params.slug}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedRecipe),
      });

      if (!response.ok) {
        throw new Error('Failed to update recipe');
      }

      sessionStorage.setItem('preserveListState', 'true');
      router.push(`/recipes/${updatedRecipe.slug}`);
    } catch (error) {
      console.error('Error updating recipe:', error);
      // Handle error (e.g., show error message to user)
    }
  };

  const handleCancel = () => {
    sessionStorage.setItem('preserveListState', 'true');
    router.push(`/recipes/${params.slug}`);
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[30vh]">
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
        <p className="mt-4 text-lg text-muted-foreground">Loading recipe...</p>
      </div>
    );
  }

  if (!recipe) {
    return notFound();
  }

  return (
    <div className="container mx-auto">
      <RecipeForm 
        initialRecipe={recipe} 
        slug={params.slug} 
        isEditing={true} 
        onSave={handleRecipeUpdate}
        onCancel={handleCancel}
      />
    </div>
  );
}
