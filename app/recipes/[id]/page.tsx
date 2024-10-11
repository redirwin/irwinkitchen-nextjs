import { RecipeDetail } from '@/components/RecipeDetail';
import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';

export default async function RecipePage({ params }: { params: { id: string } }) {
  try {
    const recipe = await prisma.recipe.findUnique({
      where: { id: params.id },
      include: { ingredients: true, steps: true, tags: true },
    });

    if (!recipe) {
      notFound();
    }

    return <RecipeDetail recipe={recipe} />;
  } catch (error) {
    console.error('Error fetching recipe:', error);
    notFound();
  }
}
