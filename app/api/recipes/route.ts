import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { Prisma } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET() {
  try {
    const recipes = await prisma.recipe.findMany({
      include: { tags: true, ingredients: true, steps: true }
    })
    return NextResponse.json(recipes)
  } catch (error) {
    console.error('Error fetching recipes:', error)
    return NextResponse.json({ error: 'Error fetching recipes' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const name = formData.get('name') as string;
    const slug = formData.get('slug') as string;
    const shortDescription = formData.get('shortDescription') as string;
    const description = formData.get('description') as string;
    const cookingTime = formData.get('cookingTime') as string;
    const difficulty = formData.get('difficulty') as string;
    const servingSize = formData.get('servingSize') as string;
    const ingredients = JSON.parse(formData.get('ingredients') as string);
    const steps = JSON.parse(formData.get('steps') as string);
    const tags = (formData.get('tags') as string).split(',').map(tag => tag.trim());

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
          create: steps.map((step: string, index: number) => ({ order: index + 1, content: step })),
        },
        tags: {
          connectOrCreate: tags.map((tag: string) => ({
            where: { name: tag },
            create: { name: tag },
          })),
        },
      },
      include: { tags: true, ingredients: true, steps: true },
    });

    return NextResponse.json(recipe);
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2002') {
        return NextResponse.json({ error: 'A recipe with this name already exists.' }, { status: 409 });
      }
    }
    console.error('Error creating recipe:', error);
    return NextResponse.json({ error: 'Error creating recipe' }, { status: 500 });
  }
}
