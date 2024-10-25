"use client";

import { SignedIn, SignedOut, useClerk } from "@clerk/nextjs";
import { RecipeForm } from "@/app/components/RecipeForm";
import { useRouter, usePathname } from "next/navigation";
import { Button } from "@/app/components/ui/button";
import { useRecipes } from "@/lib/recipeContext";
import { useToast } from "@/app/components/ui/use-toast";
import { Recipe } from "@/types/Recipe";

export default function AddRecipe() {
  const pathname = usePathname();
  const clerk = useClerk();
  const router = useRouter();
  const { addRecipe } = useRecipes();
  const { toast } = useToast();

  const handleSignIn = () => {
    clerk.openSignIn({
      redirectUrl: pathname,
    });
  };

  const handleSave = (recipe: Recipe) => {
    addRecipe(recipe);
    toast({
      title: "Recipe added",
      description: "Your new recipe has been added successfully.",
    });
    router.push("/");
  };

  const handleCancel = () => {
    router.push("/");
  };

  return (
    <div className="container mx-auto">
      <SignedIn>
        <RecipeForm
          isEditing={false}
          onSave={handleSave}
          onCancel={handleCancel}
        />
      </SignedIn>
      <SignedOut>
        <div className="flex flex-col justify-center h-[30vh]">
          <div className="text-center">
            <p className="mb-4">Please sign in to add or edit recipes.</p>
            <Button 
              onClick={handleSignIn}
              variant="default"
              size="lg"
            >
              Sign In
            </Button>
          </div>
        </div>
      </SignedOut>
    </div>
  );
}
