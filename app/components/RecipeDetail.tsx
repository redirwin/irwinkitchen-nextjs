"use client";

import { Badge } from "@/app/components/ui/badge"
import { Recipe } from '../../types/Recipe';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Button } from "@/app/components/ui/button";
import { Pencil, ArrowLeft, Clipboard, ListOrdered, ChefHat, Tags, Printer, Home } from "lucide-react";
import { useAuth } from "@clerk/nextjs";
import { toTitleCase } from "@/app/utils/stringUtils";
import { Card, CardContent, CardHeader, CardTitle } from "@/app/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/app/components/ui/tooltip"

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
    // Set a flag to indicate we're returning from the detail page
    sessionStorage.setItem('returningFromDetail', 'true');
    router.back();
  };

  const handlePrint = () => {
    const printContent = getPrinterFriendlyContent();
    const iframe = document.createElement('iframe');
    iframe.style.display = 'none';
    document.body.appendChild(iframe);

    iframe.contentDocument?.write(printContent);
    iframe.contentDocument?.close();

    iframe.onload = () => {
      setTimeout(() => {
        iframe.contentWindow?.print();
        document.body.removeChild(iframe);
      }, 100);
    };
  };

  const getPrinterFriendlyContent = () => {
    return `
      <html>
        <head>
          <title>${recipe.name}</title>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; }
            h1 { text-align: center; }
            h2 { margin-top: 20px; }
            ul, ol { padding-left: 20px; }
          </style>
        </head>
        <body>
          <h1>${recipe.name}</h1>
          ${recipe.shortDescription ? `<p>${recipe.shortDescription}</p>` : ''}
          <p>
            ${recipe.cookingTime ? `Cooking Time: ${recipe.cookingTime}<br>` : ''}
            ${recipe.difficulty ? `Difficulty: ${recipe.difficulty}<br>` : ''}
            ${recipe.servingSize ? `Serves: ${recipe.servingSize}` : ''}
          </p>
          <h2>Ingredients</h2>
          <ul>
            ${recipe.ingredients.map(ing => `<li>${ing.amount} ${ing.name}</li>`).join('')}
          </ul>
          <h2>Instructions</h2>
          <ol>
            ${recipe.steps.map(step => `<li>${step.content}</li>`).join('')}
          </ol>
          ${recipe.description ? `<h2>About this Recipe</h2><p>${recipe.description}</p>` : ''}
        </body>
      </html>
    `;
  };

  const handleHome = () => {
    // Navigate to the home page without preserving list state
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
      <div className="flex flex-wrap items-start justify-between mb-6">
        <h1 className="text-3xl font-bold mr-4 mb-4 xs:mb-0">{recipe.name}</h1>
        <TooltipProvider>
          <div className="flex flex-wrap xs:flex-nowrap space-x-2">
            {isSignedIn && (
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="outline" size="icon" onClick={handleEdit}>
                    <Pencil className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Edit Recipe</p>
                </TooltipContent>
              </Tooltip>
            )}
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline" size="icon" onClick={handlePrint}>
                  <Printer className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Print Recipe</p>
              </TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline" size="icon" onClick={handleHome}>
                  <Home className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Go to Home</p>
              </TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline" size="icon" onClick={handleBack}>
                  <ArrowLeft className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Go Back</p>
              </TooltipContent>
            </Tooltip>
          </div>
        </TooltipProvider>
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
            <CardTitle className="flex items-center">
              <Clipboard className="h-5 w-5 mr-2" />
              Ingredients
            </CardTitle>
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
            <CardTitle className="flex items-center">
              <ListOrdered className="h-5 w-5 mr-2" />
              Instructions
            </CardTitle>
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
            <CardTitle className="flex items-center">
              <ChefHat className="h-5 w-5 mr-2" />
              About this Recipe
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-lg">{recipe.description}</p>
          </CardContent>
        </Card>
      )}
      
      {recipe.tags && (
        <div className="mb-4 flex items-center flex-wrap gap-2">
          <Tags className="h-5 w-5 text-gray-500" aria-label="Tags" />
          {Array.isArray(recipe.tags) ? (
            recipe.tags.map((tag) => (
              <Badge key={tag.name} variant="secondary">
                {tag.name}
              </Badge>
            ))
          ) : typeof recipe.tags === 'string' ? (
            toTitleCase(recipe.tags).split(',').map((tag) => (
              <Badge key={tag.trim()} variant="secondary">
                {tag.trim()}
              </Badge>
            ))
          ) : null}
        </div>
      )}
    </div>
  );
}
