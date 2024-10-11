"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Pencil, Trash } from "lucide-react";
import { DeleteConfirmationModal } from "./DeleteConfirmationModal";
import { useRouter } from "next/navigation";
import { useAuth } from "@clerk/nextjs";

interface RecipeActionsProps {
  recipeId: string;
}

export function RecipeActions({ recipeId }: RecipeActionsProps) {
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const router = useRouter();
  const { isSignedIn } = useAuth();

  const handleDelete = async () => {
    try {
      const response = await fetch(`/api/recipes/${recipeId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete recipe');
      }

      setIsDeleteModalOpen(false);
      router.push('/');
      router.refresh();
    } catch (error) {
      console.error('Error deleting recipe:', error);
      // You might want to show an error message to the user here
    }
  };

  if (!isSignedIn) {
    return null;
  }

  return (
    <>
      <div className="space-x-2">
        <Button variant="outline" size="sm">
          <Pencil className="h-4 w-4 mr-2" />
          Edit
        </Button>
        <Button variant="destructive" size="sm" onClick={() => setIsDeleteModalOpen(true)}>
          <Trash className="h-4 w-4 mr-2" />
          Delete
        </Button>
      </div>
      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDelete}
      />
    </>
  );
}
