"use client"

import Link from 'next/link'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useRecipes } from '@/lib/recipeContext';

export default function RecipeList() {
  const { recipes } = useRecipes();

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {recipes.length === 0 ? (
        <p>No recipes found. Add some recipes to get started!</p>
      ) : (
        recipes.map((recipe) => (
          <Link href={`/recipes/${recipe.id}`} key={recipe.id} className="h-full">
            <Card className="cursor-pointer shadow-md hover:shadow-lg transition-all duration-300 ease-in-out hover:-translate-y-1 h-full flex flex-col">
              <CardHeader>
                <CardTitle>{recipe.name}</CardTitle>
                {recipe.shortDescription && <CardDescription>{recipe.shortDescription}</CardDescription>}
              </CardHeader>
              <CardContent className="flex-grow">
                <div className="flex flex-col gap-1 text-sm text-muted-foreground">
                  {recipe.cookingTime && <span>Cooking time: {recipe.cookingTime}</span>}
                  {recipe.difficulty && <span>Difficulty: {recipe.difficulty}</span>}
                  {recipe.servingSize && <span>Servings: {recipe.servingSize}</span>}
                </div>
              </CardContent>
              {recipe.tags && (
                <CardFooter>
                  <div className="flex flex-wrap gap-2">
                    {recipe.tags.split(',').map((tag) => (
                      <Badge key={tag.trim()} variant="secondary">{tag.trim()}</Badge>
                    ))}
                  </div>
                </CardFooter>
              )}
            </Card>
          </Link>
        ))
      )}
    </div>
  );
}