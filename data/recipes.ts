import { Recipe } from '@/types/Recipe';

export const recipes: Recipe[] = [
  {
    id: "1",
    name: "Spaghetti Carbonara",
    shortDescription: "Classic Italian pasta dish",
    description: "A rich and creamy pasta dish with eggs, cheese, and pancetta.",
    ingredients: [
      { amount: "400g", name: "spaghetti" },
      { amount: "200g", name: "pancetta" },
      { amount: "4", name: "large eggs" },
      { amount: "100g", name: "Pecorino cheese" },
      { amount: "50g", name: "Parmesan cheese" },
      { amount: "2 cloves", name: "garlic" },
    ],
    steps: [
      "Cook spaghetti in salted water until al dente.",
      "Fry pancetta with crushed garlic.",
      "Beat eggs with grated cheeses.",
      "Toss hot pasta with pancetta, then with egg mixture.",
      "Serve immediately with extra cheese and black pepper.",
    ],
    cookingTime: "20 minutes",
    difficulty: "Medium",
    servingSize: "4",
    tags: "Italian,Pasta,Quick",
  },
  {
    id: "2",
    name: "Chicken Alfredo",
    shortDescription: "Creamy pasta with chicken",
    description: "Tender chicken pieces tossed in a rich Alfredo sauce served over fettuccine.",
    ingredients: [
      { amount: "400g", name: "fettuccine pasta" },
      { amount: "2", name: "chicken breasts" },
      { amount: "1 cup", name: "heavy cream" },
      { amount: "1 cup", name: "Parmesan cheese" },
      { amount: "3 cloves", name: "garlic" },
      { amount: "2 tbsp", name: "butter" },
    ],
    steps: [
      "Cook fettuccine in salted water until al dente.",
      "Sauté chicken breasts until cooked through, then slice.",
      "In a pan, melt butter and cook minced garlic.",
      "Add heavy cream and simmer. Stir in Parmesan until smooth.",
      "Toss pasta and chicken in the sauce. Serve hot.",
    ],
    cookingTime: "30 minutes",
    difficulty: "Medium",
    servingSize: "4",
    tags: "Italian,Pasta,Chicken",
  },
  {
    id: "3",
    name: "Beef Tacos",
    shortDescription: "Flavorful beef tacos",
    description: "Ground beef tacos with a blend of spices served in soft tortillas.",
    ingredients: [
      { amount: "500g", name: "ground beef" },
      { amount: "1", name: "onion" },
      { amount: "2 cloves", name: "garlic" },
      { amount: "2 tsp", name: "chili powder" },
      { amount: "1 tsp", name: "cumin" },
      { amount: "1/2 tsp", name: "paprika" },
      { amount: "8", name: "small tortillas" },
    ],
    steps: [
      "Sauté chopped onion and minced garlic until soft.",
      "Add ground beef and cook until browned.",
      "Stir in chili powder, cumin, and paprika. Simmer for 5 minutes.",
      "Warm tortillas and fill with beef mixture.",
      "Serve with toppings like lettuce, tomato, and cheese.",
    ],
    cookingTime: "25 minutes",
    difficulty: "Easy",
    servingSize: "4",
    tags: "Mexican,Beef,Quick",
  },
  {
    id: "4",
    name: "Vegetable Stir Fry",
    shortDescription: "Quick and healthy stir fry",
    description: "A colorful mix of vegetables stir-fried in a savory sauce, served with rice.",
    ingredients: [
      { amount: "1", name: "bell pepper" },
      { amount: "1", name: "carrot" },
      { amount: "1", name: "zucchini" },
      { amount: "1 cup", name: "broccoli florets" },
      { amount: "2 tbsp", name: "soy sauce" },
      { amount: "1 tbsp", name: "sesame oil" },
      { amount: "1 tsp", name: "ginger" },
      { amount: "2 cloves", name: "garlic" },
    ],
    steps: [
      "Chop all vegetables into bite-sized pieces.",
      "Heat sesame oil in a large pan and sauté garlic and ginger.",
      "Add vegetables and stir-fry until tender-crisp.",
      "Stir in soy sauce and cook for another 2 minutes.",
      "Serve with steamed rice or noodles.",
    ],
    cookingTime: "20 minutes",
    difficulty: "Easy",
    servingSize: "2",
    tags: "Asian,Vegetarian,Quick",
  },
  {
    id: "5",
    name: "Margherita Pizza",
    shortDescription: "Classic Italian pizza",
    description: "Traditional Margherita pizza with fresh basil, mozzarella, and tomato sauce.",
    ingredients: [
      { amount: "1", name: "pizza dough" },
      { amount: "1/2 cup", name: "tomato sauce" },
      { amount: "200g", name: "mozzarella cheese" },
      { amount: "1/4 cup", name: "fresh basil leaves" },
      { amount: "2 tbsp", name: "olive oil" },
    ],
    steps: [
      "Preheat oven to 250°C (480°F).",
      "Roll out pizza dough and spread tomato sauce evenly.",
      "Top with sliced mozzarella and drizzle with olive oil.",
      "Bake for 10-12 minutes until crust is golden and cheese is bubbling.",
      "Garnish with fresh basil leaves before serving.",
    ],
    cookingTime: "15 minutes",
    difficulty: "Medium",
    servingSize: "4",
    tags: "Italian,Pizza,Vegetarian",
  },

];

export function getRecipeById(id: string): Recipe | undefined {
  return recipes.find(recipe => recipe.id === id);
}

export function getAllRecipes(): Recipe[] {
  return recipes;
}