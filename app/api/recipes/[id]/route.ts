import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    // Delete related records first
    await prisma.$transaction([
      prisma.ingredient.deleteMany({ where: { recipeId: id } }),
      prisma.step.deleteMany({ where: { recipeId: id } }),
      prisma.recipe.update({
        where: { id },
        data: { tags: { set: [] } },
      }),
      prisma.recipe.delete({ where: { id } }),
    ]);

    return NextResponse.json({ message: 'Recipe deleted successfully' });
  } catch (error) {
    console.error('Error deleting recipe:', error);
    return NextResponse.json({ error: 'Error deleting recipe' }, { status: 500 });
  }
}
