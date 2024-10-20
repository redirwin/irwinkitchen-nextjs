"use client";

import { RecipeForm } from '@/app/components/RecipeForm';
import { notFound } from 'next/navigation';
import { useState, useEffect } from 'react';
import { Recipe } from '@/types/Recipe';  // Add this import

export default function EditRecipePage({ params }: { params: { slug: string } }) {
  const [recipe, setRecipe] = useState<Recipe | null>(null);

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
      }
    }

    fetchRecipe();
  }, [params.slug]);

  const handleRecipeUpdate = (updatedRecipe: Recipe) => {
    setRecipe(updatedRecipe);
  };

  if (!recipe) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto px-4">
      <RecipeForm initialRecipe={recipe} slug={params.slug} isEditing={true} />
    </div>
  );
}
