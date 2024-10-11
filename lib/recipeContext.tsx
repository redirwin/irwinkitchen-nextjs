"use client";
import React, { createContext, useContext, useState, useEffect } from 'react';
import { Recipe } from '@/types/Recipe';
import { recipes as initialRecipes } from '@/data/recipes';

interface RecipeContextType {
  recipes: Recipe[];
  addRecipe: (recipe: Recipe) => void;
  getRecipeById: (id: string) => Recipe | undefined;
}

const RecipeContext = createContext<RecipeContextType | undefined>(undefined);

export function RecipeProvider({ children }: { children: React.ReactNode }) {
  const [recipes, setRecipes] = useState<Recipe[]>(initialRecipes);

  const addRecipe = (recipe: Recipe) => {
    setRecipes(prevRecipes => [...prevRecipes, recipe]);
  };

  const getRecipeById = (id: string) => recipes.find(recipe => recipe.id === id);

  return (
    <RecipeContext.Provider value={{ recipes, addRecipe, getRecipeById }}>
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
