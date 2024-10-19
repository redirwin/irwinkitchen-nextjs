"use client"

import Link from 'next/link'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useRecipes } from '@/lib/recipeContext';
import { useEffect, useState } from 'react';
import { Loader2 } from 'lucide-react';
import Image from 'next/image';
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination"

export default function RecipeList() {
  const { recipes, setRecipes } = useRecipes();
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const recipesPerPage = 9;

  useEffect(() => {
    const fetchRecipes = async () => {
      setIsLoading(true);
      try {
        const response = await fetch('/api/recipes');
        if (!response.ok) throw new Error('Failed to fetch recipes');
        const data = await response.json();
        setRecipes(data);
      } catch (error) {
        console.error('Error fetching recipes:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchRecipes();
  }, [setRecipes]);

  // Calculate pagination
  const indexOfLastRecipe = currentPage * recipesPerPage;
  const indexOfFirstRecipe = indexOfLastRecipe - recipesPerPage;
  const currentRecipes = recipes.slice(indexOfFirstRecipe, indexOfLastRecipe);
  const totalPages = Math.ceil(recipes.length / recipesPerPage);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
        <p className="mt-4 text-lg text-muted-foreground">Loading delicious recipes...</p>
      </div>
    );
  }

  if (recipes.length === 0) {
    return (
      <div className="text-center p-8 bg-muted rounded-lg">
        <p className="text-xl font-semibold mb-2">No recipes found</p>
        <p className="text-muted-foreground">It looks like there aren't any recipes yet. Why not add some to get started?</p>
      </div>
    );
  }

  return (
    <>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {currentRecipes.map((recipe) => (
          <Link href={`/recipes/${recipe.slug}`} key={recipe.id} className="h-full">
            <Card className="cursor-pointer shadow-md hover:shadow-lg transition-all duration-300 ease-in-out hover:-translate-y-1 h-full flex flex-col">
              {recipe.imageUrl && (
                <div className="relative w-full h-48">
                  <Image 
                    src={recipe.imageUrl} 
                    alt={recipe.name} 
                    fill
                    style={{ objectFit: 'cover' }}
                    className="rounded-t-lg"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                </div>
              )}
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
              <CardFooter>
                <div className="flex flex-wrap gap-2">
                  {Array.isArray(recipe.tags) ? (
                    recipe.tags.map((tag) => (
                      <Badge key={tag.name} variant="secondary">{tag.name}</Badge>
                    ))
                  ) : (
                    typeof recipe.tags === 'string' ? 
                      recipe.tags.split(',').map((tag) => (
                        <Badge key={tag.trim()} variant="secondary">{tag.trim()}</Badge>
                      ))
                    : null
                  )}
                </div>
              </CardFooter>
            </Card>
          </Link>
        ))}
      </div>
      <div className="mt-8 flex justify-center">
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious 
                href="#" 
                onClick={(e) => {
                  e.preventDefault();
                  if (currentPage > 1) setCurrentPage(currentPage - 1);
                }}
              />
            </PaginationItem>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <PaginationItem key={page}>
                <PaginationLink 
                  href="#" 
                  isActive={currentPage === page}
                  onClick={(e) => {
                    e.preventDefault();
                    setCurrentPage(page);
                  }}
                >
                  {page}
                </PaginationLink>
              </PaginationItem>
            ))}
            <PaginationItem>
              <PaginationNext 
                href="#" 
                onClick={(e) => {
                  e.preventDefault();
                  if (currentPage < totalPages) setCurrentPage(currentPage + 1);
                }}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </>
  );
}
