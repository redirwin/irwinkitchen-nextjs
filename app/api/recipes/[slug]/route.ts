import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { writeFile, unlink } from 'fs/promises';
import path from 'path';
import { toTitleCase } from "@/app/utils/stringUtils";

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
    return NextResponse.json({ 
      error: 'Error deleting recipe',
      title: 'Deletion Failed',
      description: 'An unexpected error occurred while deleting the recipe. Please try again.',
      details: error instanceof Error ? error.message : String(error)
    }, { status: 500 });
  }
}

export async function GET(
  request: Request,
  { params }: { params: { slug: string } }
) {
  try {
    const { slug } = params;
    const recipe = await prisma.recipe.findUnique({
      where: { slug },
      include: { ingredients: true, steps: true, tags: true },
    });

    if (!recipe) {
      return NextResponse.json({ error: 'Recipe not found' }, { status: 404 });
    }

    return NextResponse.json(recipe);
  } catch (error) {
    console.error('Error fetching recipe:', error);
    return NextResponse.json({ 
      error: 'Error fetching recipe',
      title: 'Fetch Failed',
      description: 'An unexpected error occurred while fetching the recipe. Please try again.',
      details: error instanceof Error ? error.message : String(error)
    }, { status: 500 });
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
      tags: (formData.get('tags') as string)
        .split(',')
        .map(tag => tag.trim())
        .filter(Boolean)
        .map(toTitleCase),
    };

    let imageUrl = undefined;
    const removeImage = formData.get('removeImage') === 'true';
    const imageFile = formData.get('image') as File | null;

    if (removeImage) {
      // Get the current recipe to find the image URL
      const currentRecipe = await prisma.recipe.findUnique({
        where: { slug },
        select: { imageUrl: true },
      });

      if (currentRecipe?.imageUrl) {
        // Remove the file from the file system
        const filePath = path.join(process.cwd(), 'public', currentRecipe.imageUrl);
        await unlink(filePath);
      }

      // Set imageUrl to null in the database
      imageUrl = null;
    } else if (imageFile) {
      const bytes = await imageFile.arrayBuffer();
      const buffer = Buffer.from(bytes);

      // Save the file to the public directory
      const fileName = `recipe-${slug}-${Date.now()}.jpg`;
      const filePath = path.join(process.cwd(), 'public', 'images', 'recipes', fileName);
      await writeFile(filePath, buffer);
      imageUrl = `/images/recipes/${fileName}`;
    }

    const recipe = await prisma.recipe.update({
      where: { slug },
      data: {
        ...updatedRecipe,
        imageUrl: imageUrl,
        ingredients: {
          deleteMany: {},
          create: updatedRecipe.ingredients.map(({ id, recipeId, ...rest }: { id?: string; recipeId?: string; [key: string]: any }) => rest),
        },
        steps: {
          deleteMany: {},
          create: updatedRecipe.steps.map(({ id, recipeId, ...step }: { id?: string; recipeId?: string; content: string; [key: string]: any }, index: number) => ({
            order: index + 1,
            content: step.content,
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
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
      return NextResponse.json({ 
        error: 'A recipe with this name already exists',
        title: 'Duplicate Recipe Name',
        description: 'Please choose a different name for your recipe.'
      }, { status: 400 });
    }
    return NextResponse.json({ 
      error: 'Error updating recipe',
      title: 'Update Failed',
      description: 'An unexpected error occurred while updating the recipe. Please try again.',
      details: error instanceof Error ? error.message : String(error)
    }, { status: 500 });
  }
}
