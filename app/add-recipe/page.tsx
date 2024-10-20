"use client";

import { SignedIn, SignedOut, useClerk } from "@clerk/nextjs";
import { RecipeForm } from "@/app/components/RecipeForm";
import { usePathname } from "next/navigation";
import { Button } from "@/app/components/ui/button";

export default function AddRecipe() {
  const pathname = usePathname();
  const clerk = useClerk();

  const handleSignIn = () => {
    clerk.openSignIn({
      redirectUrl: pathname,
    });
  };

  return (
    <div className="container mx-auto px-4">
      <SignedIn>
        <RecipeForm isEditing={false} />
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
