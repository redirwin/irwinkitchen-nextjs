"use client";

import { RecipeForm } from '@/components/RecipeForm';
import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import { useState, useEffect } from 'react';

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
      <h1 className="text-3xl font-bold mb-6">Edit Recipe</h1>
      <RecipeForm initialRecipe={recipe} slug={params.slug} />
    </div>
  );
}
