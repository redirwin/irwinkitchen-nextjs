import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

function generateSlug(name: string): string {
  return name.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, '');
}

function generateRecipe(name: string, cuisine: string): any {
  return {
    name,
    shortDescription: `A delicious ${cuisine} dish`,
    description: `This ${name} is a classic ${cuisine} recipe that's easy to make and full of flavor.`,
    cookingTime: `${Math.floor(Math.random() * 60 + 15)} minutes`,
    difficulty: ['Easy', 'Medium', 'Hard'][Math.floor(Math.random() * 3)],
    servingSize: `${Math.floor(Math.random() * 6 + 2)}`,
    ingredients: {
      create: [
        { amount: '1 cup', name: 'ingredient 1' },
        { amount: '2 tbsp', name: 'ingredient 2' },
        { amount: '3', name: 'ingredient 3' },
      ],
    },
    steps: {
      create: [
        { order: 1, content: 'Step 1 description' },
        { order: 2, content: 'Step 2 description' },
        { order: 3, content: 'Step 3 description' },
      ],
    },
    tags: {
      create: [
        { name: cuisine },
        { name: 'Quick' },
        { name: 'Tasty' },
      ],
    },
  };
}

const newRecipes = [
  // Existing 20 recipes
  generateRecipe('Pad Thai', 'Thai'),
  generateRecipe('Beef Bourguignon', 'French'),
  generateRecipe('Tacos al Pastor', 'Mexican'),
  generateRecipe('Sushi Rolls', 'Japanese'),
  generateRecipe('Chicken Tikka Masala', 'Indian'),
  generateRecipe('Wiener Schnitzel', 'Austrian'),
  generateRecipe('Paella', 'Spanish'),
  generateRecipe('Pho', 'Vietnamese'),
  generateRecipe('Moussaka', 'Greek'),
  generateRecipe('Feijoada', 'Brazilian'),
  generateRecipe('Pierogi', 'Polish'),
  generateRecipe('Dim Sum', 'Chinese'),
  generateRecipe('Bobotie', 'South African'),
  generateRecipe('Poutine', 'Canadian'),
  generateRecipe('Goulash', 'Hungarian'),
  generateRecipe('Ceviche', 'Peruvian'),
  generateRecipe('Kottbullar', 'Swedish'),
  generateRecipe('Coq au Vin', 'French'),
  generateRecipe('Bibimbap', 'Korean'),
  generateRecipe('Risotto', 'Italian'),
  
  // 40 new recipes
  generateRecipe('Tom Yum Goong', 'Thai'),
  generateRecipe('Ratatouille', 'French'),
  generateRecipe('Enchiladas', 'Mexican'),
  generateRecipe('Tempura', 'Japanese'),
  generateRecipe('Butter Chicken', 'Indian'),
  generateRecipe('Apfelstrudel', 'Austrian'),
  generateRecipe('Gazpacho', 'Spanish'),
  generateRecipe('Banh Mi', 'Vietnamese'),
  generateRecipe('Spanakopita', 'Greek'),
  generateRecipe('Moqueca', 'Brazilian'),
  generateRecipe('Bigos', 'Polish'),
  generateRecipe('Mapo Tofu', 'Chinese'),
  generateRecipe('Bunny Chow', 'South African'),
  generateRecipe('Tourtiere', 'Canadian'),
  generateRecipe('Langos', 'Hungarian'),
  generateRecipe('Lomo Saltado', 'Peruvian'),
  generateRecipe('Gravlax', 'Swedish'),
  generateRecipe('Cassoulet', 'French'),
  generateRecipe('Kimchi Jjigae', 'Korean'),
  generateRecipe('Osso Buco', 'Italian'),
  generateRecipe('Green Curry', 'Thai'),
  generateRecipe('Quiche Lorraine', 'French'),
  generateRecipe('Chiles en Nogada', 'Mexican'),
  generateRecipe('Okonomiyaki', 'Japanese'),
  generateRecipe('Vindaloo', 'Indian'),
  generateRecipe('Kaiserschmarrn', 'Austrian'),
  generateRecipe('Fabada', 'Spanish'),
  generateRecipe('Bun Cha', 'Vietnamese'),
  generateRecipe('Pastitsio', 'Greek'),
  generateRecipe('Acaraje', 'Brazilian'),
  generateRecipe('Zurek', 'Polish'),
  generateRecipe('Kung Pao Chicken', 'Chinese'),
  generateRecipe('Malva Pudding', 'South African'),
  generateRecipe('Montreal Smoked Meat', 'Canadian'),
  generateRecipe('Kurtoskalacs', 'Hungarian'),
  generateRecipe('Aji de Gallina', 'Peruvian'),
  generateRecipe('Janssons Temptation', 'Swedish'),
  generateRecipe('Bouillabaisse', 'French'),
  generateRecipe('Japchae', 'Korean'),
  generateRecipe('Saltimbocca', 'Italian'),
];

async function main() {
  for (const recipe of newRecipes) {
    try {
      const existingRecipe = await prisma.recipe.findUnique({
        where: { name: recipe.name },
      });

      if (existingRecipe) {
        // Update existing recipe
        await prisma.recipe.update({
          where: { id: existingRecipe.id },
          data: {
            shortDescription: recipe.shortDescription,
            description: recipe.description,
            cookingTime: recipe.cookingTime,
            difficulty: recipe.difficulty,
            servingSize: recipe.servingSize,
            slug: generateSlug(recipe.name),
            ingredients: {
              deleteMany: {},
              create: recipe.ingredients.create,
            },
            steps: {
              deleteMany: {},
              create: recipe.steps.create,
            },
            tags: {
              set: [],
              connectOrCreate: recipe.tags.create.map((tag: { name: string }) => ({
                where: { name: tag.name },
                create: { name: tag.name },
              })),
            },
          },
        });
        console.log(`Updated existing recipe: ${recipe.name}`);
      } else {
        // Create new recipe
        await prisma.recipe.create({
          data: {
            name: recipe.name,
            shortDescription: recipe.shortDescription,
            description: recipe.description,
            cookingTime: recipe.cookingTime,
            difficulty: recipe.difficulty,
            servingSize: recipe.servingSize,
            slug: generateSlug(recipe.name),
            ingredients: {
              create: recipe.ingredients.create,
            },
            steps: {
              create: recipe.steps.create,
            },
            tags: {
              connectOrCreate: recipe.tags.create.map((tag: { name: string }) => ({
                where: { name: tag.name },
                create: { name: tag.name },
              })),
            },
          },
        });
        console.log(`Created new recipe: ${recipe.name}`);
      }
    } catch (error) {
      console.error(`Error processing recipe ${recipe.name}:`, error);
    }
  }

  console.log('Seed data inserted successfully.')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
