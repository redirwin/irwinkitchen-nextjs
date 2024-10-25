import Image from 'next/image';
import { Recipe } from '@/types/Recipe';
import { toTitleCase } from "@/app/utils/stringUtils";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/app/components/ui/card";
import { Badge } from "@/app/components/ui/badge";

interface RecipeCardProps {
  recipe: Recipe;
  selectedTags: string[];
  onTagClick: (e: React.MouseEvent, tag: string) => void;
  onClick: () => void;
}

export function RecipeCard({ recipe, selectedTags, onTagClick, onClick }: RecipeCardProps) {
  return (
    <div 
      className="cursor-pointer h-full transition-all duration-300 ease-in-out transform hover:scale-[1.02] hover:shadow-lg sm:hover:scale-100 sm:hover:shadow-none"
      onClick={onClick}
    >
      <Card className="overflow-hidden flex flex-col h-full border border-neutral-200 hover:border-primary group">
        <div className="relative h-48 w-full overflow-hidden">
          {recipe.imageUrl ? (
            <Image
              src={recipe.imageUrl}
              alt={recipe.name}
              layout="fill"
              objectFit="cover"
              className="transition-transform duration-300 ease-in-out sm:group-hover:scale-110"
            />
          ) : (
            <div className="bg-gray-200 h-full flex items-center justify-center">
              <span className="text-gray-400">No Image</span>
            </div>
          )}
        </div>
        <CardHeader>
          <CardTitle>{toTitleCase(recipe.name)}</CardTitle>
          {recipe.shortDescription && (
            <CardDescription className="line-clamp-2">
              {recipe.shortDescription}
            </CardDescription>
          )}
        </CardHeader>
        <CardContent className="flex-grow">
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
                  className="cursor-pointer transition-colors duration-200 active:bg-primary active:text-primary-foreground sm:hover:bg-primary sm:hover:text-primary-foreground"
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
                    className="cursor-pointer transition-colors duration-200 active:bg-primary active:text-primary-foreground sm:hover:bg-primary sm:hover:text-primary-foreground"
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
