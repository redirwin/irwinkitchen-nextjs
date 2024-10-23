"use client";

import { RecipeForm } from '@/app/components/RecipeForm';
import { notFound } from 'next/navigation';
import { useState, useEffect } from 'react';
import { Recipe } from '@/types/Recipe';
import { Loader2 } from 'lucide-react';

export default function EditRecipePage({ params }: { params: { slug: string } }) {
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [isLoading, setIsLoading] = useState(true);

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

  const handleRecipeUpdate = (updatedRecipe: Recipe) => {
    setRecipe(updatedRecipe);
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
    <div className="container mx-auto px-4">
      <RecipeForm initialRecipe={recipe} slug={params.slug} isEditing={true} />
    </div>
  );
}
