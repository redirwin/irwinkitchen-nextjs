import { RecipeDetail } from '@/components/RecipeDetail';
import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';

export default async function RecipePage({ params }: { params: { slug: string } }) {
  try {
    const recipe = await prisma.recipe.findUnique({
      where: { slug: params.slug },
      include: { ingredients: true, steps: true, tags: true },
    });

    if (!recipe) {
      notFound();
    }

    return <RecipeDetail initialRecipe={recipe} />;
  } catch (error) {
    console.error('Error fetching recipe:', error);
    notFound();
  }
}
