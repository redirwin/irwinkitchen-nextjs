"use client";

import { Button } from "@/components/ui/button";
import { Pencil, Trash } from "lucide-react";
import { useRouter } from "next/navigation";
import { useAuth } from "@clerk/nextjs";

interface RecipeActionsProps {
  recipe: Recipe;
  showDelete?: boolean;
}

export function RecipeActions({ recipe, showDelete = true }: RecipeActionsProps) {
  const router = useRouter();
  const { isSignedIn } = useAuth();

  const handleEdit = () => {
    router.push(`/edit-recipe/${recipe.slug}`);
  };

  if (!isSignedIn) {
    return null;
  }

  return (

    <div className="space-x-2">
      <Button variant="outline" size="sm" onClick={handleEdit}>
        <Pencil className="h-4 w-4 mr-2" />
        Edit
      </Button>
    </div>

  );
}
