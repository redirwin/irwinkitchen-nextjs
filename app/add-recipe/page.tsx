"use client";

import { SignedIn, SignedOut, useClerk } from "@clerk/nextjs";
import { RecipeForm } from "@/app/components/RecipeForm";
import { usePathname } from "next/navigation";

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
      <h1 className="text-3xl font-bold mb-6">Add New Recipe</h1>
      <SignedIn>
        <RecipeForm />
      </SignedIn>
      <SignedOut>
        <div className="flex flex-col justify-center h-[30vh]">
          <div className="text-center">
            <p className="mb-4">You need to sign in to add a new recipe.</p>
            <button 
              onClick={handleSignIn}
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            >
              Sign In
            </button>
          </div>
        </div>
      </SignedOut>
    </div>
  );
}