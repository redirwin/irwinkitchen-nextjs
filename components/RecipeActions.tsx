"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Pencil, Trash } from "lucide-react";
import { DeleteConfirmationModal } from "./DeleteConfirmationModal";
import { useRouter } from "next/navigation";
import { useAuth } from "@clerk/nextjs";
import { useToast } from "@/components/ui/use-toast";

interface RecipeActionsProps {
  recipe: Recipe;
  showDelete?: boolean;
}

export function RecipeActions({ recipe, showDelete = true }: RecipeActionsProps) {
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const router = useRouter();
  const { isSignedIn } = useAuth();
  const { toast } = useToast();

  const handleDelete = async () => {
    try {
      const response = await fetch(`/api/recipes/${recipe.slug}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete recipe');
      }

      setIsDeleteModalOpen(false);
      toast({
        title: "Recipe deleted",
        description: "Your recipe has been successfully deleted.",
      });
      router.push('/');
      router.refresh();
    } catch (error) {
      console.error('Error deleting recipe:', error);
      toast({
        title: "Error",
        description: "Failed to delete recipe. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleEdit = () => {
    router.push(`/edit-recipe/${recipe.slug}`);
  };

  if (!isSignedIn) {
    return null;
  }

  return (
    <>
      <div className="space-x-2">
        <Button variant="outline" size="sm" onClick={handleEdit}>
          <Pencil className="h-4 w-4 mr-2" />
          Edit
        </Button>
        {showDelete && (
          <Button variant="destructive" size="sm" onClick={() => setIsDeleteModalOpen(true)}>
            <Trash className="h-4 w-4 mr-2" />
            Delete
          </Button>
        )}
      </div>
      {showDelete && (
        <DeleteConfirmationModal
          isOpen={isDeleteModalOpen}
          onClose={() => setIsDeleteModalOpen(false)}
          onConfirm={handleDelete}
        />
      )}
    </>
  );
}
