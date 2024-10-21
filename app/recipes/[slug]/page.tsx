import { RecipeDetail } from '@/app/components/RecipeDetail';
import prisma from '@/lib/prisma';
import { notFound } from 'next/navigation';
import { Recipe } from '@/types/Recipe';

export default async function RecipePage({ params }: { params: { slug: string } }) {
  console.log('RecipePage: Starting to fetch recipe for slug:', params.slug);
  try {
    const prismaRecipe = await prisma.recipe.findUnique({
      where: { slug: params.slug },
      include: { ingredients: true, steps: true, tags: true },
    });

    console.log('RecipePage: Prisma query result:', JSON.stringify(prismaRecipe, null, 2));

    if (!prismaRecipe) {
      console.log('RecipePage: Recipe not found');
      notFound();
    }

    // Convert Prisma Recipe to our Recipe type
    const recipe: Recipe = {
      ...prismaRecipe,
      ingredients: prismaRecipe.ingredients.map(ing => ({
        amount: ing.amount,
        name: ing.name,
      })),
      steps: prismaRecipe.steps.map(step => ({ content: step.content })),
      tags: prismaRecipe.tags.map(tag => tag.name).join(', '),
      imageUrl: prismaRecipe.imageUrl || undefined,
    };

    console.log('RecipePage: Converted recipe:', JSON.stringify(recipe, null, 2));

    return <RecipeDetail initialRecipe={recipe} />;
  } catch (error) {
    console.error('RecipePage: Error fetching recipe:', error);
    throw error; // Re-throw to see the full error in Vercel logs
  }
}
