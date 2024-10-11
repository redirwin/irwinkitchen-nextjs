import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const recipes = await prisma.recipe.findMany({
      include: { tags: true }
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
    const shortDescription = formData.get('shortDescription') as string;
    const description = formData.get('description') as string;
    const cookingTime = formData.get('cookingTime') as string;
    const difficulty = formData.get('difficulty') as string;
    const servingSize = formData.get('servingSize') as string;
    const ingredients = JSON.parse(formData.get('ingredients') as string);
    const steps = JSON.parse(formData.get('steps') as string);
    const tags = (formData.get('tags') as string).split(',').map(tag => tag.trim());

    return NextResponse.json(recipe);
  } catch (error) {
    console.error('Error creating recipe:', error);
    return NextResponse.json({ error: 'Error creating recipe' }, { status: 500 });
  }
}
