import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library'
import slugify from 'slugify';
import { toTitleCase } from "@/app/utils/stringUtils";

export async function GET(request: Request) {
  try {
    const recipes = await prisma.recipe.findMany({
      include: { tags: true, ingredients: true, steps: true }
    })
    return NextResponse.json(recipes)
  } catch (error) {
    console.error('Error fetching recipes:', error)
    return NextResponse.json({ 
      error: 'Error fetching recipes',
      title: 'Fetch Failed',
      description: 'An unexpected error occurred while fetching recipes. Please try again.',
      details: error instanceof Error ? error.message : String(error)
    }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const formData = await request.formData();

    const name = formData.get('name') as string;
    const slug = slugify(name, { lower: true });
    const shortDescription = formData.get('shortDescription') as string;
    const description = formData.get('description') as string;
    const cookingTime = formData.get('cookingTime') as string;
    const difficulty = formData.get('difficulty') as string;
    const servingSize = formData.get('servingSize') as string;
    const ingredients = JSON.parse(formData.get('ingredients') as string);
    const steps = JSON.parse(formData.get('steps') as string);
    const tags = (formData.get('tags') as string)
      .split(',')
      .map(tag => tag.trim())
      .filter(Boolean)
      .map(toTitleCase);
    const imageFile = formData.get('image') as File | null;

    let imageUrl = null;
    if (imageFile) {
      imageUrl = await uploadImage(imageFile);
    }

    const recipe = await prisma.recipe.create({
      data: {
        name,
        slug,
        shortDescription,
        description,
        cookingTime,
        difficulty,
        servingSize,
        ingredients: {
          create: ingredients,
        },
        steps: {
          create: steps,
        },
        tags: {
          connectOrCreate: tags.map((tag: string) => ({
            where: { name: tag },
            create: { name: tag },
          })),
        },
        imageUrl: imageUrl,
      },
      include: { tags: true, ingredients: true, steps: true },
    });

    return NextResponse.json(recipe);
  } catch (error) {
    console.error('Error in POST /api/recipes:', error);
    return NextResponse.json({ error: 'Failed to create recipe' }, { status: 500 });
  }
}
