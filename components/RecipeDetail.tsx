import { Badge } from "@/components/ui/badge"
import { Recipe } from '../types/Recipe';

interface RecipeDetailProps {
  recipe: Recipe;
}

export function RecipeDetail({ recipe }: RecipeDetailProps) {
  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-4">{recipe.name}</h1>
      {recipe.shortDescription && <p className="text-lg mb-4">{recipe.shortDescription}</p>}
      <div className="flex space-x-4 mb-4">
        {recipe.cookingTime && <Badge>{recipe.cookingTime}</Badge>}
        {recipe.difficulty && <Badge>{recipe.difficulty}</Badge>}
        {recipe.servingSize && <Badge>Serves {recipe.servingSize}</Badge>}
      </div>
      {recipe.tags && (
        <div className="mb-4">
          {recipe.tags.split(',').map((tag) => (
            <Badge key={tag.trim()} variant="secondary" className="mr-2">
              {tag.trim()}
            </Badge>
          ))}
        </div>
      )}
      {recipe.ingredients && recipe.ingredients.length > 0 && (
        <>
          <h2 className="text-2xl font-semibold mb-2">Ingredients</h2>
          <ul className="list-disc pl-5 mb-4">
            {recipe.ingredients.map((ingredient, index) => (
              <li key={index}>
                {ingredient.amount} {ingredient.name}
              </li>
            ))}
          </ul>
        </>
      )}
      {recipe.steps && recipe.steps.length > 0 && (
        <>
          <h2 className="text-2xl font-semibold mb-2">Instructions</h2>
          <ol className="list-decimal pl-5 mb-4">
            {recipe.steps.map((step, index) => (
              <li key={index}>{step}</li>
            ))}
          </ol>
        </>
      )}
      {recipe.description && <p className="text-lg mb-4">{recipe.description}</p>}
    </div>
  );
}