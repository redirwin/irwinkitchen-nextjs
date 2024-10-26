import Image from 'next/image';
import { Recipe } from '@/types/Recipe';
import { Card, CardContent } from "@/app/components/ui/card";
import { Badge } from "@/app/components/ui/badge";
import { Clock, BarChart, Users } from 'lucide-react';
import { toTitleCase } from "@/app/utils/stringUtils";

interface RecipeCardProps {
  recipe: Recipe;
  selectedTags: string[];
  onTagClick: (e: React.MouseEvent, tag: string) => void;
  onClick: () => void;
}

export function RecipeCard({ recipe, selectedTags, onTagClick, onClick }: RecipeCardProps) {
  return (
    <Card 
      className="overflow-hidden cursor-pointer transition-all duration-300 ease-in-out hover:shadow-lg hover:scale-[1.02]" 
      onClick={onClick}
    >
      {recipe.imageUrl && (
        <div className="relative w-full h-48">
          <Image
            src={recipe.imageUrl}
            alt={recipe.name}
            layout="fill"
            objectFit="cover"
          />
        </div>
      )}
      <CardContent className="p-4">
        <h2 className="text-xl font-semibold mb-2">{toTitleCase(recipe.name)}</h2>
        <p className="text-muted-foreground mb-4">{recipe.shortDescription}</p>
        <ul className="list-none p-0 mb-4 text-sm text-muted-foreground">
          {recipe.cookingTime && (
            <li className="flex items-center mb-1">
              <Clock className="w-4 h-4 mr-2" /> {recipe.cookingTime}
            </li>
          )}
          {recipe.difficulty && (
            <li className="flex items-center mb-1">
              <BarChart className="w-4 h-4 mr-2" /> {recipe.difficulty}
            </li>
          )}
          {recipe.servingSize && (
            <li className="flex items-center mb-1">
              <Users className="w-4 h-4 mr-2" /> Serves {recipe.servingSize}
            </li>
          )}
        </ul>
        <div className="flex flex-wrap gap-2">
          {Array.isArray(recipe.tags)
            ? recipe.tags.map((tag) => (
              <Badge
                key={tag.name}
                variant={selectedTags.includes(tag.name) ? "default" : "secondary"}
                className="cursor-pointer"
                onClick={(e) => onTagClick(e, tag.name)}
              >
                {tag.name}
              </Badge>
            ))
            : recipe.tags.split(',').map((tag) => (
              <Badge
                key={tag.trim()}
                variant={selectedTags.includes(tag.trim()) ? "default" : "secondary"}
                className="cursor-pointer"
                onClick={(e) => onTagClick(e, tag.trim())}
              >
                {tag.trim()}
              </Badge>
            ))
          }
        </div>
      </CardContent>
    </Card>
  );
}
