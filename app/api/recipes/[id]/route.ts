import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function DELETE(
  request: Request,
  { params }: { params: { slug: string } }
) {
  try {
    const { slug } = params;

    // First, find the recipe by slug
    const recipe = await prisma.recipe.findUnique({
      where: { slug },
    });

    if (!recipe) {
      return NextResponse.json({ error: 'Recipe not found' }, { status: 404 });
    }

    // Now use the recipe's ID to delete related records
    await prisma.$transaction([
      prisma.ingredient.deleteMany({ where: { recipeId: recipe.id } }),
      prisma.step.deleteMany({ where: { recipeId: recipe.id } }),
      prisma.recipe.update({
        where: { id: recipe.id },
        data: { tags: { set: [] } },
      }),
      prisma.recipe.delete({ where: { id: recipe.id } }),
    ]);

    return NextResponse.json({ message: 'Recipe deleted successfully' });
  } catch (error) {
    console.error('Error deleting recipe:', error);
    return NextResponse.json({ error: 'Error deleting recipe' }, { status: 500 });
  }
}

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const recipe = await prisma.recipe.findUnique({
      where: { id },
      include: { ingredients: true, steps: true, tags: true },
    });

    if (!recipe) {
      return NextResponse.json({ error: 'Recipe not found' }, { status: 404 });
    }

    return NextResponse.json(recipe);
  } catch (error) {
    console.error('Error fetching recipe:', error);
    return NextResponse.json({ error: 'Error fetching recipe' }, { status: 500 });
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { slug: string } }
) {
  try {
    const { slug } = params;
    const formData = await request.formData();
    const updatedRecipe = {
      name: formData.get('name') as string,
      shortDescription: formData.get('shortDescription') as string,
      description: formData.get('description') as string,
      cookingTime: formData.get('cookingTime') as string,
      difficulty: formData.get('difficulty') as string,
      servingSize: formData.get('servingSize') as string,
      ingredients: JSON.parse(formData.get('ingredients') as string),
      steps: JSON.parse(formData.get('steps') as string),
      tags: (formData.get('tags') as string).split(',').map(tag => tag.trim()).filter(Boolean),
    };

    const recipe = await prisma.recipe.update({
      where: { slug: params.slug },
      data: {
        name: updatedRecipe.name,
        shortDescription: updatedRecipe.shortDescription,
        description: updatedRecipe.description,
        cookingTime: updatedRecipe.cookingTime,
        difficulty: updatedRecipe.difficulty,
        servingSize: updatedRecipe.servingSize,
        ingredients: {
          deleteMany: {},
          create: updatedRecipe.ingredients,
        },
        steps: {
          deleteMany: {},
          create: updatedRecipe.steps.map((step, index) => ({
            order: index + 1,
            content: step,
          })),
        },
        tags: {
          set: [],
          connectOrCreate: updatedRecipe.tags.map(tagName => ({
            where: { name: tagName },
            create: { name: tagName },
          })),
        },
      },
      include: { ingredients: true, steps: true, tags: true },
    });

    return NextResponse.json(recipe);
  } catch (error) {
    console.error('Error updating recipe:', error);
    return NextResponse.json({ error: 'Error updating recipe: ' + error.message }, { status: 500 });
  }
}
