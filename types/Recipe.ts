export interface Recipe {
  id: string;
  name: string;
  shortDescription: string;
  description: string;
  ingredients: { amount: string; name: string }[];
  steps: string[];
  cookingTime: string;
  difficulty: string;
  servingSize: string;
  tags: string;
  image?: File | null;
}