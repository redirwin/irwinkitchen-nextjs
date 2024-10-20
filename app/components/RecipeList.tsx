"use client"

import Link from 'next/link'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/app/components/ui/card"
import { Badge } from "@/app/components/ui/badge"
import { useRecipes } from '@/lib/recipeContext';
import { useState, useEffect } from 'react';
import { Loader2 } from 'lucide-react';
import Image from 'next/image';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/app/components/ui/pagination"
import { X } from "lucide-react"
import { Button } from "@/app/components/ui/button"
import { Input } from "@/app/components/ui/input"
import { Recipe } from '@/types/Recipe'; // Make sure this path is correct
import { useRouter, useSearchParams } from 'next/navigation';

export default function RecipeList() {
  const { recipes, setRecipes } = useRecipes();
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const router = useRouter();
  const searchParams = useSearchParams();
  const recipesPerPage = 6;

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

    // Check if we're coming back from a recipe detail page
    const isReturningFromDetail = sessionStorage.getItem('returningFromDetail');
    if (isReturningFromDetail) {
      const savedState = sessionStorage.getItem('recipeListState');
      if (savedState) {
        const { currentPage, selectedTags, searchQuery } = JSON.parse(savedState);
        setCurrentPage(currentPage);
        setSelectedTags(selectedTags);
        setSearchQuery(searchQuery);
      }
      // Clear the flags and saved state
      sessionStorage.removeItem('returningFromDetail');
      sessionStorage.removeItem('recipeListState');
    }
  }, []);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1);
  };

  const toggleTag = (tag: string) => {
    setSelectedTags(prev => 
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    );
    setCurrentPage(1);
  };

  const saveStateAndNavigate = (slug: string) => {
    const state = {
      currentPage,
      selectedTags,
      searchQuery
    };
    sessionStorage.setItem('recipeListState', JSON.stringify(state));
    router.push(`/recipes/${slug}`);
  };

  // Get unique tags from all recipes
  const allTags = Array.from(new Set(recipes.flatMap(recipe => 
    Array.isArray(recipe.tags) ? recipe.tags.map(tag => tag.name) : recipe.tags.split(',').map(tag => tag.trim())
  ))).sort();

  const searchRecipe = (recipe: Recipe, query: string) => {
    const searchTerms = query.toLowerCase().split(' ');
    return searchTerms.every(term =>
      recipe.name.toLowerCase().includes(term) ||
      recipe.shortDescription.toLowerCase().includes(term) ||
      recipe.description.toLowerCase().includes(term) ||
      recipe.ingredients.some(ing => ing.name.toLowerCase().includes(term)) ||
      (Array.isArray(recipe.tags)
        ? recipe.tags.some(tag => tag.name.toLowerCase().includes(term))
        : recipe.tags.toLowerCase().includes(term))
    );
  };

  // Filter recipes based on selected tags and search query
  const filteredRecipes = recipes.filter(recipe => 
    (selectedTags.length === 0 || selectedTags.every(tag => 
      (Array.isArray(recipe.tags) 
        ? recipe.tags.some(t => t.name === tag)
        : recipe.tags.split(',').map(t => t.trim()).includes(tag))
    )) && (searchQuery === '' || searchRecipe(recipe, searchQuery))
  );

  // Calculate pagination
  const indexOfLastRecipe = currentPage * recipesPerPage;
  const indexOfFirstRecipe = indexOfLastRecipe - recipesPerPage;
  const currentRecipes = filteredRecipes.slice(indexOfFirstRecipe, indexOfLastRecipe);
  const totalPages = Math.ceil(filteredRecipes.length / recipesPerPage);

  const resetTags = () => {
    setSelectedTags([]);
    setCurrentPage(1);
  };

  const handleTagClick = (e: React.MouseEvent, tag: string) => {
    e.preventDefault();
    e.stopPropagation();
    toggleTag(tag);
  };

  const handleClearSearch = () => {
    setSearchQuery('');
    setSelectedTags([]);
    setCurrentPage(1);
  };

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const pageParam = urlParams.get('page');
    const tagsParam = urlParams.get('tags');
    const searchParam = urlParams.get('search');

    if (pageParam) setCurrentPage(parseInt(pageParam, 10));
    if (tagsParam) setSelectedTags(tagsParam.split(','));
    if (searchParam) setSearchQuery(searchParam);

    // Clear the saved state after using it
    sessionStorage.removeItem('recipeListState');
  }, []);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
        <p className="mt-4 text-lg text-muted-foreground">Loading delicious recipes...</p>
      </div>
    );
  }

  return (
    <>
      <div className="mb-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Browse and Search Recipes</h1>
          <div className="w-1/3">
            <Input 
              type="search" 
              placeholder="Search recipes..." 
              value={searchQuery}
              onChange={handleSearchChange}
            />
          </div>
        </div>
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

      {recipes.length === 0 ? (
        <div className="text-center p-8 bg-muted rounded-lg">
          <p className="text-xl font-semibold mb-2">No recipes found</p>
          <p className="text-muted-foreground mb-4">
            It looks like there aren't any recipes yet. Why not add some to get started?
          </p>
          <Link href="/add-recipe" passHref>
            <Button as="a">
              Add Your First Recipe
            </Button>
          </Link>
        </div>
      ) : filteredRecipes.length === 0 ? (
        <div className="text-center p-8 bg-muted rounded-lg">
          <p className="text-xl font-semibold mb-2">No recipes found</p>
          <p className="text-muted-foreground mb-4">
            No recipes match your criteria. Try adjusting your tags or search terms.
          </p>
          <Button onClick={handleClearSearch}>
            Show All Recipes
          </Button>
        </div>
      ) : (
        <>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {currentRecipes.map((recipe) => (
              <div
                key={recipe.id}
                className="h-full cursor-pointer"
                onClick={() => saveStateAndNavigate(recipe.slug)}
              >
                <Card className="shadow-md hover:shadow-lg transition-all duration-300 ease-in-out hover:-translate-y-1 h-full flex flex-col">
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
              </div>
            ))}
          </div>

          {filteredRecipes.length > recipesPerPage && (
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
          )}
        </>
      )}
    </>
  );
}
