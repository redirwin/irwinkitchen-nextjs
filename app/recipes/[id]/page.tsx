"use client";

import { useRecipes } from '@/lib/recipeContext';
import { RecipeDetail } from '@/components/RecipeDetail';

export default function RecipePage({ params }: { params: { id: string } }) {
  const { getRecipeById } = useRecipes();
  const recipe = getRecipeById(params.id);
  
  if (!recipe) {
    return <div>Recipe not found</div>;
  }

  return <RecipeDetail recipe={recipe} />;
}
