"use client";

import { Badge } from "@/app/components/ui/badge"
import { Recipe } from '../../types/Recipe';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Button } from "@/app/components/ui/button";
import { Pencil, ArrowLeft, Clipboard, ListOrdered, ChefHat, Tags, Printer, Home, Clock, BarChart, Users } from "lucide-react";
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
  const [isScrolled, setIsScrolled] = useState(false);
  const router = useRouter();
  const { isSignedIn } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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
    const preserveListState = sessionStorage.getItem('preserveListState');
    if (preserveListState) {
      sessionStorage.removeItem('preserveListState');
      router.push('/');
    } else {
      router.back();
    }
  };

  const handleHome = () => {
    sessionStorage.setItem('resetListState', 'true');
    router.push('/');
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

  return (
    <div className="max-w-3xl mx-auto">
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

      <div className={`sticky top-16 z-50 bg-white -mx-4 px-4 transition-shadow duration-200
        ${isScrolled ? 'py-2 shadow-md' : 'pt-0 pb-3'}
        md:static md:bg-transparent md:shadow-none md:px-0 md:mx-0 md:py-0`}>
        <TooltipProvider>
          <div className="flex justify-end space-x-2">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline" size="icon" onClick={handlePrint}>
                  <Printer className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="bottom" align="center" sideOffset={5}>
                <p>Print Recipe</p>
              </TooltipContent>
            </Tooltip>
            {isSignedIn && (
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="outline" size="icon" onClick={handleEdit}>
                    <Pencil className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="bottom" align="center" sideOffset={5}>
                  <p>Edit Recipe</p>
                </TooltipContent>
              </Tooltip>
            )}
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline" size="icon" onClick={handleBack}>
                  <ArrowLeft className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="bottom" align="center" sideOffset={5}>
                <p>Go Back</p>
              </TooltipContent>
            </Tooltip>
          </div>
        </TooltipProvider>
      </div>

      <h1 className="text-3xl font-bold mb-0 mt-2">{toTitleCase(recipe.name)}</h1>

      {recipe.shortDescription && <p className="text-lg mb-4 mt-0">{recipe.shortDescription}</p>}

      <div className="flex flex-wrap gap-4 mb-4 text-sm text-muted-foreground">
        {recipe.cookingTime && (
          <div className="flex items-center">
            <Clock className="w-4 h-4 mr-2" /> {recipe.cookingTime}
          </div>
        )}
        {recipe.difficulty && (
          <div className="flex items-center">
            <BarChart className="w-4 h-4 mr-2" /> {recipe.difficulty}
          </div>
        )}
        {recipe.servingSize && (
          <div className="flex items-center">
            <Users className="w-4 h-4 mr-2" /> Serves {recipe.servingSize}
          </div>
        )}
      </div>

      {recipe.tags && (
        <div className="mb-6 flex items-center flex-wrap gap-2">
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
    </div>
  );
}
