"use client"

import Link from 'next/link'
import { useRecipes } from '@/lib/recipeContext';
import { useState, useEffect } from 'react';
import { Loader2, BookOpen, Search } from 'lucide-react';
import { Button } from "@/app/components/ui/button"
import { Recipe } from '@/types/Recipe';
import { useRouter, useSearchParams } from 'next/navigation';
import { SearchBar } from './SearchBar';
import { TagList } from './TagList';
import { RecipeCard } from './RecipeCard';
import { PaginationControls } from './PaginationControls';

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
        // Sort recipes alphabetically by name
        const sortedRecipes = data.sort((a: Recipe, b: Recipe) => a.name.localeCompare(b.name));
        setRecipes(sortedRecipes);
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
    <div className="px-4 sm:px-6 md:px-8 max-w-7xl mx-auto">
      <div className="mb-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold">Browse & Search Recipes</h1>
          <SearchBar 
            searchQuery={searchQuery} 
            onSearchChange={handleSearchChange} 
            onClearSearch={handleClearSearch}
          />
        </div>
        <TagList 
          allTags={allTags} 
          selectedTags={selectedTags} 
          onTagToggle={toggleTag} 
          onResetTags={resetTags} 
        />
      </div>

      {recipes.length === 0 ? (
        <div className="text-center">
          <BookOpen className="w-16 h-16 mx-auto mb-4 text-primary" />
          <p className="text-xl mb-4">You haven't added any recipes yet.</p>
          <Link href="/add-recipe" passHref legacyBehavior>
            <Button asChild>
              <a>
                Add Your First Recipe
              </a>
            </Button>
          </Link>
        </div>
      ) : filteredRecipes.length === 0 ? (
        <div className="text-center p-8 bg-muted rounded-lg">
          <Search className="w-16 h-16 mx-auto mb-4 text-primary" />
          <p className="text-xl font-semibold mb-2">No recipes found matching your criteria</p>
          <p className="text-muted-foreground mb-4">
            Try adjusting your tags or search terms.
          </p>
          <Button onClick={handleClearSearch}>
            Show All Recipes
          </Button>
        </div>
      ) : (
        <>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {currentRecipes.map((recipe) => (
              <RecipeCard
                key={recipe.id}
                recipe={recipe}
                selectedTags={selectedTags}
                onTagClick={handleTagClick}
                onClick={() => saveStateAndNavigate(recipe.slug)}
              />
            ))}
          </div>

          {filteredRecipes.length > recipesPerPage && (
            <div className="mt-8">
              <PaginationControls
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
              />
            </div>
          )}
        </>
      )}
    </div>
  );
}
