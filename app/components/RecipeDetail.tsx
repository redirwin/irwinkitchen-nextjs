"use client";

import { Badge } from "@/app/components/ui/badge"
import { Recipe } from '../../types/Recipe';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Button } from "@/app/components/ui/button";
import { Pencil, ArrowLeft } from "lucide-react";
import { useAuth } from "@clerk/nextjs";
import { toTitleCase } from "@/app/utils/stringUtils";
import { Card, CardContent, CardHeader, CardTitle } from "@/app/components/ui/card";

interface RecipeDetailProps {
  initialRecipe: Recipe;
}

export function RecipeDetail({ initialRecipe }: RecipeDetailProps) {
  const [recipe, setRecipe] = useState(initialRecipe);
  const router = useRouter();
  const { isSignedIn } = useAuth();
  
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

  const handleEdit = () => {
    router.push(`/edit-recipe/${recipe.slug}`);
  };

  const handleBack = () => {
    sessionStorage.setItem('returningFromDetail', 'true');
    router.push('/');
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      {recipe.imageUrl && (
        <div className="relative w-full h-64 mb-6">
          <Image 
            src={recipe.imageUrl} 
            alt={recipe.name} 
            layout="fill"
            objectFit="cover"
            className="rounded-lg"
          />
        </div>
      )}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">{recipe.name}</h1>
        {isSignedIn && (
          <Button variant="outline" size="sm" onClick={handleEdit}>
            <Pencil className="h-4 w-4 mr-2" />
            Edit
          </Button>
        )}
      </div>
      {recipe.shortDescription && <p className="text-lg mb-4">{recipe.shortDescription}</p>}
      <div className="flex space-x-4 mb-4">
        {recipe.cookingTime && <Badge>{recipe.cookingTime}</Badge>}
        {recipe.difficulty && <Badge>{recipe.difficulty}</Badge>}
        {recipe.servingSize && <Badge>Serves {recipe.servingSize}</Badge>}
      </div>
      
      <div className="grid md:grid-cols-2 gap-6 mb-8">
        <Card>
          <CardHeader>
            <CardTitle>Ingredients</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="list-disc pl-5">
              {recipe.ingredients.map((ingredient, index) => (
                <li key={index} className="mb-2">
                  {ingredient.amount} {ingredient.name}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Instructions</CardTitle>
          </CardHeader>
          <CardContent>
            <ol className="list-decimal pl-5">
              {recipe.steps.map((step, index) => (
                <li key={index} className="mb-4">{step.content}</li>
              ))}
            </ol>
          </CardContent>
        </Card>
      </div>

      {recipe.description && (
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>About this Recipe</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-lg">{recipe.description}</p>
          </CardContent>
        </Card>
      )}
      
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
              toTitleCase(recipe.tags).split(',').map((tag) => (
                <Badge key={tag.trim()} variant="secondary" className="mr-2">
                  {tag.trim()}
                </Badge>
              ))
            ) : null}
          </div>
        </div>
      )}
      
      <div className="mt-8">
        <Button variant="outline" onClick={handleBack}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Recipes
        </Button>
      </div>
    </div>
  );
}
