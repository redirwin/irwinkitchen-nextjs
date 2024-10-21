import { RecipeDetail } from '@/app/components/RecipeDetail';
import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import { Recipe } from '@/types/Recipe';

export default async function RecipePage({ params }: { params: { slug: string } }) {
  try {
    const prismaRecipe = await prisma.recipe.findUnique({
      where: { slug: params.slug },
      include: { ingredients: true, steps: true, tags: true },
    });

    if (!prismaRecipe) {
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

    return <RecipeDetail initialRecipe={recipe} />;
  } catch (error) {
    console.error('Error fetching recipe:', error);
    notFound();
  }
}
