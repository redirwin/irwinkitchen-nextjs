"use client";
import React, { createContext, useContext, useState, useEffect } from 'react';
import { Recipe } from '@/types/Recipe';
import { recipes as initialRecipes } from '@/data/recipes';

interface RecipeContextType {
  recipes: Recipe[];
  addRecipe: (recipe: Recipe) => void;
  updateRecipe: (updatedRecipe: Recipe) => void;
  setRecipes: (recipes: Recipe[]) => void;
  getRecipeById: (id: string) => Recipe | undefined;
}

const RecipeContext = createContext<RecipeContextType | undefined>(undefined);

export function RecipeProvider({ children }: { children: React.ReactNode }) {
  const [recipes, setRecipes] = useState<Recipe[]>([]);

  const addRecipe = (recipe: Recipe) => {
    setRecipes(prevRecipes => [...prevRecipes, recipe]);
  };

  const getRecipeById = (id: string) => recipes.find(recipe => recipe.id === id);

  const updateRecipe = (updatedRecipe: Recipe) => {
    setRecipes(prevRecipes => prevRecipes.map(recipe => 
      recipe.id === updatedRecipe.id ? updatedRecipe : recipe
    ));
  };

  return (
    <RecipeContext.Provider value={{ recipes, addRecipe, updateRecipe, setRecipes, getRecipeById }}>
      {children}
    </RecipeContext.Provider>
  );
}

export function useRecipes() {
  const context = useContext(RecipeContext);
  if (context === undefined) {
    throw new Error('useRecipes must be used within a RecipeProvider');
  }
  return context;
}
