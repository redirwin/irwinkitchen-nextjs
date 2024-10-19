"use client"

import Link from 'next/link'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/app/components/ui/card"
import { Badge } from "@/app/components/ui/badge"
import { useRecipes } from '@/lib/recipeContext';
import { useEffect, useState } from 'react';
import { Loader2 } from 'lucide-react';
import Image from 'next/image';
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/app/components/ui/pagination"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/app/components/ui/select"
import { X } from "lucide-react"
import { Button } from "@/app/components/ui/button"

export default function RecipeList() {
  const { recipes, setRecipes } = useRecipes();
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
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

  // Get unique tags from all recipes
  const allTags = Array.from(new Set(recipes.flatMap(recipe => 
    Array.isArray(recipe.tags) ? recipe.tags.map(tag => tag.name) : recipe.tags.split(',').map(tag => tag.trim())
  ))).sort();

  // Filter recipes based on selected tags
  const filteredRecipes = selectedTags.length > 0
    ? recipes.filter(recipe => 
        selectedTags.every(tag => 
          (Array.isArray(recipe.tags) 
            ? recipe.tags.some(t => t.name === tag)
            : recipe.tags.split(',').map(t => t.trim()).includes(tag))
        )
      )
    : recipes;

  // Calculate pagination
  const indexOfLastRecipe = currentPage * recipesPerPage;
  const indexOfFirstRecipe = indexOfLastRecipe - recipesPerPage;
  const currentRecipes = filteredRecipes.slice(indexOfFirstRecipe, indexOfLastRecipe);
  const totalPages = Math.ceil(filteredRecipes.length / recipesPerPage);

  const toggleTag = (tag: string) => {
    setSelectedTags(prev => 
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    );
    setCurrentPage(1);
  };

  const resetTags = () => {
    setSelectedTags([]);
    setCurrentPage(1);
  };

  const handleTagClick = (e: React.MouseEvent, tag: string) => {
    e.preventDefault();
    e.stopPropagation();
    toggleTag(tag);
  };

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
      <div className="mb-6">
        <div className="flex flex-wrap gap-2 mb-4">
          {allTags.map(tag => (
            <Badge 
              key={tag}
              variant={selectedTags.includes(tag) ? "default" : "secondary"}
              className="cursor-pointer transition-colors duration-200"
              onClick={() => toggleTag(tag)}
            >
              {tag}
            </Badge>
          ))}
        </div>
        {selectedTags.length > 0 && (
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">
              Filtered by: {selectedTags.join(', ')}
            </span>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={resetTags}
              className="h-8 px-2 text-xs"
            >
              <X className="h-4 w-4 mr-1" />
              Reset
            </Button>
          </div>
        )}
      </div>

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
              <CardHeader className="flex-grow">
                <CardTitle className="line-clamp-2">{recipe.name}</CardTitle>
                {recipe.shortDescription && (
                  <CardDescription className="line-clamp-3">
                    {recipe.shortDescription}
                  </CardDescription>
                )}
              </CardHeader>
              <CardContent>
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
                      <Badge 
                        key={tag.name} 
                        variant={selectedTags.includes(tag.name) ? "default" : "secondary"}
                        className="cursor-pointer transition-colors duration-200"
                        onClick={(e) => handleTagClick(e, tag.name)}
                      >
                        {tag.name}
                      </Badge>
                    ))
                  ) : (
                    typeof recipe.tags === 'string' ? 
                      recipe.tags.split(',').map((tag) => (
                        <Badge 
                          key={tag.trim()} 
                          variant={selectedTags.includes(tag.trim()) ? "default" : "secondary"}
                          className="cursor-pointer transition-colors duration-200"
                          onClick={(e) => handleTagClick(e, tag.trim())}
                        >
                          {tag.trim()}
                        </Badge>
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
