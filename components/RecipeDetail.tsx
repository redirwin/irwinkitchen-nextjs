"use client";

import { Badge } from "@/components/ui/badge"
import { Recipe } from '../types/Recipe';
import { RecipeActions } from './RecipeActions';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

interface RecipeDetailProps {
  initialRecipe: Recipe;
}

export function RecipeDetail({ initialRecipe }: RecipeDetailProps) {
  const [recipe, setRecipe] = useState(initialRecipe);
  const router = useRouter();

  useEffect(() => {
    const fetchUpdatedRecipe = async () => {
      try {
        const response = await fetch(`/api/recipes/${initialRecipe.slug}`);
        if (!response.ok) throw new Error('Failed to fetch updated recipe');
        const updatedRecipe = await response.json();
        setRecipe(updatedRecipe);
      } catch (error) {
        console.error('Error fetching updated recipe:', error);
      }
    };

    fetchUpdatedRecipe();
  }, [initialRecipe.slug]);

  return (
    <div className="max-w-3xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">{recipe.name}</h1>
        <RecipeActions recipe={recipe} showDelete={false} />
      </div>
      {recipe.shortDescription && <p className="text-lg mb-4">{recipe.shortDescription}</p>}
      <div className="flex space-x-4 mb-4">
        {recipe.cookingTime && <Badge>{recipe.cookingTime}</Badge>}
        {recipe.difficulty && <Badge>{recipe.difficulty}</Badge>}
        {recipe.servingSize && <Badge>Serves {recipe.servingSize}</Badge>}
      </div>
      {recipe.tags && (
        <div className="mb-4">
          <h3 className="text-lg font-semibold mb-2">Tags:</h3>
          <div className="flex flex-wrap gap-2">
            {Array.isArray(recipe.tags) ? (
              recipe.tags.map((tag) => (
                <Badge key={tag.name} variant="secondary" className="mr-2">
                  {tag.name}
                </Badge>
              ))
            ) : typeof recipe.tags === 'string' ? (
              recipe.tags.split(',').map((tag) => (
                <Badge key={tag.trim()} variant="secondary" className="mr-2">
                  {tag.trim()}
                </Badge>
              ))
            ) : null}
          </div>
        </div>
      )}
      {recipe.ingredients && recipe.ingredients.length > 0 && (
        <>
          <h2 className="text-2xl font-semibold mb-2">Ingredients</h2>
          <ul className="list-disc pl-5 mb-4">
            {recipe.ingredients.map((ingredient, index) => (
              <li key={index}>{ingredient.amount} {ingredient.name}</li>
            ))}
          </ul>
        </>
      )}
      {recipe.steps && recipe.steps.length > 0 && (
        <>
          <h2 className="text-2xl font-semibold mb-2">Instructions</h2>
          <ol className="list-decimal pl-5 mb-4">
            {recipe.steps.map((step, index) => (
              <li key={index}>{step.content}</li>
            ))}
          </ol>
        </>
      )}
      {recipe.description && <p className="text-lg mb-4">{recipe.description}</p>}
    </div>
  );
}
