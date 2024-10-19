import { RecipeForm } from '@/components/RecipeForm';
import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';

export default async function EditRecipePage({ params }: { params: { slug: string } }) {
  try {
    if (!params.slug) {
      notFound();
    }

    const recipe = await prisma.recipe.findUnique({
      where: { slug: params.slug },
      include: { ingredients: true, steps: true, tags: true },
    });

    if (!recipe) {
      notFound();
    }

    return (
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold mb-6">Edit Recipe</h1>
        <RecipeForm initialRecipe={recipe} slug={params.slug} showDelete={true} />
      </div>
    );
  } catch (error) {
    console.error('Error fetching recipe:', error);
    notFound();
  }
}
