import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/app/components/ui/card"
import { Badge } from "@/app/components/ui/badge"
import Image from 'next/image';
import { Recipe } from '@/types/Recipe';
import { toTitleCase } from "@/app/utils/stringUtils";

interface RecipeCardProps {
  recipe: Recipe;
  selectedTags: string[];
  onTagClick: (e: React.MouseEvent, tag: string) => void;
  onClick: () => void;
}

export function RecipeCard({ recipe, selectedTags, onTagClick, onClick }: RecipeCardProps) {
  return (
    <div className="h-full cursor-pointer" onClick={onClick}>
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
                  onClick={(e) => onTagClick(e, tag.name)}
                >
                  {toTitleCase(tag.name)}
                </Badge>
              ))
            ) : (
              typeof recipe.tags === 'string' ? 
                recipe.tags.split(',').map((tag) => (
                  <Badge 
                    key={tag.trim()} 
                    variant={selectedTags.includes(tag.trim()) ? "default" : "secondary"}
                    className="cursor-pointer transition-colors duration-200"
                    onClick={(e) => onTagClick(e, tag.trim())}
                  >
                    {toTitleCase(tag.trim())}
                  </Badge>
                ))
              : null
            )}
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
