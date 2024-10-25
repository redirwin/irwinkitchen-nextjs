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
import { useSwipeable } from 'react-swipeable';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/app/components/ui/select";
import { Input } from "@/app/components/ui/input";
import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from "@/app/components/ui/tooltip";

export default function RecipeList() {
  const { recipes, setRecipes } = useRecipes();
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [recipesPerPage, setRecipesPerPage] = useState({
    mobile: 1,
    desktop: 6
  });
  const [tempRecipesPerPage, setTempRecipesPerPage] = useState(recipesPerPage.desktop.toString());
  const router = useRouter();

  useEffect(() => {
    const fetchRecipes = async () => {
      setIsLoading(true);
      try {
        const response = await fetch('/api/recipes');
        if (!response.ok) throw new Error('Failed to fetch recipes');
        const data = await response.json();
        const sortedRecipes = data.sort((a: Recipe, b: Recipe) => a.name.localeCompare(b.name));
        const validRecipes = sortedRecipes.map((recipe: any) => ({
          ...recipe,
          imageUrl: recipe.imageUrl || null,
        }));
        setRecipes(validRecipes);
      } catch (error) {
        console.error('Error fetching recipes:', error);
      } finally {
        setIsLoading(false);
      }
    };
  
    const handleResetState = () => {
      setCurrentPage(1);
      setSelectedTags([]);
      setSearchQuery('');
    };
  
    fetchRecipes();
  
    const resetStateHandler = () => {
      const resetListState = sessionStorage.getItem('resetListState');
      if (resetListState) {
        handleResetState();
        sessionStorage.removeItem('resetListState');
      }
    };
  
    window.addEventListener('resetListState', resetStateHandler);

    const loadSavedState = () => {
      const savedState = sessionStorage.getItem('recipeListState');
      if (savedState) {
        const { currentPage, selectedTags, searchQuery, recipesPerPage } = JSON.parse(savedState);
        setCurrentPage(currentPage);
        setSelectedTags(selectedTags);
        setSearchQuery(searchQuery);
        if (recipesPerPage) { // Add this check
          setRecipesPerPage(prev => ({
            ...prev,
            desktop: recipesPerPage
          }));
          setTempRecipesPerPage(recipesPerPage.toString());
        }
        sessionStorage.removeItem('recipeListState');
      }
    };

    loadSavedState();

    return () => {
      window.removeEventListener('resetListState', resetStateHandler);
    };
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
      searchQuery,
      recipesPerPage: recipesPerPage.desktop // Add this line
    };
    sessionStorage.setItem('recipeListState', JSON.stringify(state));
    sessionStorage.setItem('returningFromDetail', 'true');
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

  // Update pagination calculation
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 640;
  const currentRecipesPerPage = isMobile ? recipesPerPage.mobile : recipesPerPage.desktop;
  const indexOfLastRecipe = currentPage * currentRecipesPerPage;
  const indexOfFirstRecipe = indexOfLastRecipe - currentRecipesPerPage;
  const currentRecipes = filteredRecipes.slice(indexOfFirstRecipe, indexOfLastRecipe);
  const totalPages = Math.ceil(filteredRecipes.length / currentRecipesPerPage);

  const resetTags = () => {
    setSelectedTags([]);
    setSearchQuery(''); // Add this line to clear the search query
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

  const resetFilters = () => {
    setSearchQuery('');
    setSelectedTags([]);
    setCurrentPage(1);
  };

  const handleSwipe = (direction: 'LEFT' | 'RIGHT') => {
    if (direction === 'LEFT' && currentPage < totalPages) {
      setCurrentPage(prev => prev + 1);
    } else if (direction === 'RIGHT' && currentPage > 1) {
      setCurrentPage(prev => prev - 1);
    }
  };

  const swipeHandlers = useSwipeable({
    onSwipedLeft: () => handleSwipe('LEFT'),
    onSwipedRight: () => handleSwipe('RIGHT'),
    trackMouse: true
  });

  const handleRecipesPerPageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTempRecipesPerPage(e.target.value);
  };

  const applyRecipesPerPage = () => {
    const newValue = parseInt(tempRecipesPerPage);
    if (!isNaN(newValue) && newValue > 0) {
      setRecipesPerPage(prev => ({
        ...prev,
        desktop: newValue
      }));
      setTempRecipesPerPage(newValue.toString()); // Add this line
      setCurrentPage(1);
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
        <p className="mt-4 text-lg text-muted-foreground">Recipes loading...</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto flex flex-col min-h-[calc(100vh-4rem)]">
      <div className="flex-grow">
        <div className="mb-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold">Browse & Search</h1>
            <SearchBar 
              searchQuery={searchQuery} 
              onSearchChange={handleSearchChange} 
              onClearSearch={resetFilters}
            />
          </div>
          <TagList 
            allTags={allTags} 
            selectedTags={selectedTags} 
            onTagToggle={toggleTag} 
            onResetTags={resetTags} // This now resets both tags and search query
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
            <Button onClick={resetFilters}>
              Show All Recipes
            </Button>
          </div>
        ) : (
          <div 
            {...swipeHandlers} 
            className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 auto-rows-fr touch-pan-y mb-8"
          >
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
        )}
      </div>

      {filteredRecipes.length > 0 && (
        <div className="sticky bottom-0 bg-background py-4 border-t sm:static sm:bg-transparent sm:border-t-0">
          <div className="flex justify-between items-center">
            <div className="hidden sm:flex items-center space-x-2">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Input
                      type="number"
                      min="1"
                      value={tempRecipesPerPage}
                      onChange={handleRecipesPerPageChange}
                      className="w-20"
                      aria-label="Recipes per page"
                    />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Recipes per page</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              <Button onClick={applyRecipesPerPage} size="sm">
                Apply
              </Button>
            </div>
            <div className="w-full sm:w-auto flex justify-end">
              <PaginationControls
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
