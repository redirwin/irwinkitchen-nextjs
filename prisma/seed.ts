import { PrismaClient } from '@prisma/client'
import { generateSlug } from '../lib/utils'

const prisma = new PrismaClient()

async function main() {
  for (const recipe of recipes) {
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
              connectOrCreate: recipe.tags.create.map((tag) => ({
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
              connectOrCreate: recipe.tags.create.map((tag) => ({
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

const recipes = [
  {
    name: 'Spaghetti Carbonara',
    shortDescription: 'Classic Italian pasta dish',
    description: 'A creamy pasta dish with eggs, cheese, and pancetta.',
    cookingTime: '30 minutes',
    difficulty: 'Medium',
    servingSize: '4',
    ingredients: {
      create: [
        { amount: '400g', name: 'spaghetti' },
        { amount: '200g', name: 'pancetta' },
        { amount: '4', name: 'large eggs' },
        { amount: '100g', name: 'Pecorino Romano cheese' },
        { amount: '50g', name: 'Parmesan cheese' },
      ],
    },
    steps: {
      create: [
        { order: 1, content: 'Cook spaghetti in salted water until al dente.' },
        { order: 2, content: 'Fry pancetta until crispy.' },
        { order: 3, content: 'Mix eggs and cheese in a bowl.' },
        { order: 4, content: 'Combine pasta with pancetta, then mix in egg mixture.' },
        { order: 5, content: 'Serve immediately with extra cheese on top.' },
      ],
    },
    tags: {
      create: [
        { name: 'Italian' },
        { name: 'Pasta' },
        { name: 'Quick' },
      ],
    },
  },
  {
    name: 'Chicken Tikka Masala',
    shortDescription: 'Popular Indian curry dish',
    description: 'Tender chicken in a creamy, spiced tomato sauce.',
    cookingTime: '45 minutes',
    difficulty: 'Medium',
    servingSize: '4',
    ingredients: {
      create: [
        { amount: '500g', name: 'chicken breast' },
        { amount: '400ml', name: 'tomato sauce' },
        { amount: '200ml', name: 'heavy cream' },
        { amount: '2 tbsp', name: 'garam masala' },
        { amount: '1 tbsp', name: 'ginger paste' },
      ],
    },
    steps: {
      create: [
        { order: 1, content: 'Marinate chicken in yogurt and spices.' },
        { order: 2, content: 'Grill or pan-fry the chicken until cooked.' },
        { order: 3, content: 'Simmer tomato sauce with spices.' },
        { order: 4, content: 'Add cream and cooked chicken to the sauce.' },
        { order: 5, content: 'Serve hot with rice or naan bread.' },
      ],
    },
    tags: {
      create: [
        { name: 'Indian' },
        { name: 'Curry' },
        { name: 'Spicy' },
      ],
    },
  },
  {
    name: 'Vegetarian Lasagna',
    shortDescription: 'Layered pasta dish with vegetables',
    description: 'A hearty vegetarian lasagna with layers of pasta, vegetables, and cheese.',
    cookingTime: '1 hour 30 minutes',
    difficulty: 'Medium',
    servingSize: '6',
    ingredients: {
      create: [
        { amount: '12', name: 'lasagna noodles' },
        { amount: '500g', name: 'mixed vegetables (zucchini, eggplant, bell peppers)' },
        { amount: '500g', name: 'ricotta cheese' },
        { amount: '400g', name: 'mozzarella cheese' },
        { amount: '700ml', name: 'tomato sauce' },
      ],
    },
    steps: {
      create: [
        { order: 1, content: 'Cook lasagna noodles according to package instructions.' },
        { order: 2, content: 'Sauté mixed vegetables until tender.' },
        { order: 3, content: 'Layer noodles, vegetables, cheeses, and sauce in a baking dish.' },
        { order: 4, content: 'Repeat layers and top with mozzarella cheese.' },
        { order: 5, content: 'Bake at 180°C (350°F) for 45 minutes.' },
      ],
    },
    tags: {
      create: [
        { name: 'Italian' },
        { name: 'Vegetarian' },
        { name: 'Baked' },
      ],
    },
  },
  {
    name: 'Beef Stroganoff',
    shortDescription: 'Creamy beef and mushroom dish',
    description: 'Tender beef cooked in a creamy mushroom sauce, served over egg noodles.',
    cookingTime: '40 minutes',
    difficulty: 'Medium',
    servingSize: '4',
    ingredients: {
      create: [
        { amount: '500g', name: 'beef sirloin' },
        { amount: '250g', name: 'mushrooms' },
        { amount: '1', name: 'onion' },
        { amount: '200ml', name: 'sour cream' },
        { amount: '2 tbsp', name: 'flour' },
      ],
    },
    steps: {
      create: [
        { order: 1, content: 'Slice beef and season with salt and Pepper.' },
        { order: 2, content: 'Sauté onion and mushrooms until soft.' },
        { order: 3, content: 'Add beef and cook until browned.' },
        { order: 4, content: 'Stir in flour, then add sour cream and simmer.' },
        { order: 5, content: 'Serve over cooked egg noodles.' },
      ],
    },
    tags: {
      create: [
        { name: 'Russian' },
        { name: 'Beef' },
        { name: 'Comfort Food' },
      ],
    },
  },
  {
    name: 'Shrimp Scampi',
    shortDescription: 'Garlic butter shrimp with pasta',
    description: 'Juicy shrimp cooked in garlic butter sauce, served over linguine.',
    cookingTime: '20 minutes',
    difficulty: 'Easy',
    servingSize: '4',
    ingredients: {
      create: [
        { amount: '400g', name: 'linguine' },
        { amount: '500g', name: 'shrimp' },
        { amount: '4 cloves', name: 'garlic' },
        { amount: '100g', name: 'butter' },
        { amount: '1', name: 'lemon' },
      ],
    },
    steps: {
      create: [
        { order: 1, content: 'Cook linguine in salted water until al dente.' },
        { order: 2, content: 'Sauté garlic in butter until fragrant.' },
        { order: 3, content: 'Add shrimp and cook until pink.' },
        { order: 4, content: 'Squeeze lemon juice over shrimp and toss with pasta.' },
        { order: 5, content: 'Serve with fresh parsley.' },
      ],
    },
    tags: {
      create: [
        { name: 'Seafood' },
        { name: 'Italian' },
        { name: 'Quick' },
      ],
    },
  },
  {
    name: 'Vegetable Stir Fry',
    shortDescription: 'Quick and easy vegetable dish',
    description: 'Colorful vegetables stir-fried in a savory sauce, served with rice.',
    cookingTime: '20 minutes',
    difficulty: 'Easy',
    servingSize: '4',
    ingredients: {
      create: [
        { amount: '500g', name: 'mixed vegetables (broccoli, bell Pepper, carrots)' },
        { amount: '3 tbsp', name: 'soy sauce' },
        { amount: '2 tbsp', name: 'hoisin sauce' },
        { amount: '1 tbsp', name: 'sesame oil' },
        { amount: '1', name: 'garlic clove' },
      ],
    },
    steps: {
      create: [
        { order: 1, content: 'Heat sesame oil in a wok over high heat.' },
        { order: 2, content: 'Add garlic and stir-fry for 30 seconds.' },
        { order: 3, content: 'Add mixed vegetables and stir-fry until tender.' },
        { order: 4, content: 'Stir in soy sauce and hoisin sauce.' },
        { order: 5, content: 'Serve with steamed rice.' },
      ],
    },
    tags: {
      create: [
        { name: 'Asian' },
        { name: 'Vegetarian' },
        { name: 'Quick' },
      ],
    },
  },
  {
    name: 'Miso Soup',
    shortDescription: 'Classic Japanese soup',
    description: 'Light and savory soup made with miso paste, tofu, and seaweed.',
    cookingTime: '15 minutes',
    difficulty: 'Easy',
    servingSize: '4',
    ingredients: {
      create: [
        { amount: '1 liter', name: 'dashi broth' },
        { amount: '3 tbsp', name: 'miso paste' },
        { amount: '200g', name: 'tofu' },
        { amount: '1 sheet', name: 'nori seaweed' },
        { amount: '2', name: 'green onions' },
      ],
    },
    steps: {
      create: [
        { order: 1, content: 'Heat dashi broth in a pot until warm.' },
        { order: 2, content: 'Add miso paste and stir until dissolved.' },
        { order: 3, content: 'Add tofu and nori, and simmer for 5 minutes.' },
        { order: 4, content: 'Garnish with sliced green onions and serve.' },
      ],
    },
    tags: {
      create: [
        { name: 'Japanese' },
        { name: 'Soup' },
        { name: 'Light' },
      ],
    },
  },
  {
    name: 'Chicken Caesar Salad',
    shortDescription: 'Classic salad with grilled chicken',
    description: 'Crisp romaine lettuce, grilled chicken, croutons, and Caesar dressing.',
    cookingTime: '25 minutes',
    difficulty: 'Easy',
    servingSize: '4',
    ingredients: {
      create: [
        { amount: '2', name: 'chicken breasts' },
        { amount: '1 head', name: 'romaine lettuce' },
        { amount: '100g', name: 'croutons' },
        { amount: '50g', name: 'Parmesan cheese' },
        { amount: '100ml', name: 'Caesar dressing' },
      ],
    },
    steps: {
      create: [
        { order: 1, content: 'Season chicken breasts and grill until cooked through.' },
        { order: 2, content: 'Chop romaine lettuce and place in a large bowl.' },
        { order: 3, content: 'Slice grilled chicken and add to the bowl.' },
        { order: 4, content: 'Add croutons, Parmesan cheese, and Caesar dressing.' },
        { order: 5, content: 'Toss well and serve.' },
      ],
    },
    tags: {
      create: [
        { name: 'Salad' },
        { name: 'Chicken' },
        { name: 'Healthy' },
      ],
    },
  },
  {
    name: 'French Onion Soup',
    shortDescription: 'Rich onion soup with melted cheese',
    description: 'Slow-cooked caramelized onions in a rich broth, topped with croutons and melted cheese.',
    cookingTime: '1 hour',
    difficulty: 'Medium',
    servingSize: '4',
    ingredients: {
      create: [
        { amount: '6', name: 'large onions' },
        { amount: '2 tbsp', name: 'butter' },
        { amount: '1 liter', name: 'beef broth' },
        { amount: '4 slices', name: 'baguette' },
        { amount: '100g', name: 'Gruyère cheese' },
      ],
    },
    steps: {
      create: [
        { order: 1, content: 'Caramelize onions in butter over low heat.' },
        { order: 2, content: 'Add beef broth and simmer for 30 minutes.' },
        { order: 3, content: 'Pour soup into oven-safe bowls and top with baguette slices.' },
        { order: 4, content: 'Sprinkle Gruyère cheese over baguette and broil until melted.' },
        { order: 5, content: 'Serve hot.' },
      ],
    },
    tags: {
      create: [
        { name: 'French' },
        { name: 'Soup' },
        { name: 'Comfort Food' },
      ],
    },
  },
  {
    name: 'Greek Salad',
    shortDescription: 'Fresh Mediterranean salad',
    description: 'A refreshing salad with cucumbers, tomatoes, feta cheese, olives, and a lemon-oregano dressing.',
    cookingTime: '15 minutes',
    difficulty: 'Easy',
    servingSize: '4',
    ingredients: {
      create: [
        { amount: '3', name: 'cucumbers' },
        { amount: '4', name: 'tomatoes' },
        { amount: '200g', name: 'feta cheese' },
        { amount: '100g', name: 'Kalamata olives' },
        { amount: '2 tbsp', name: 'olive oil' },
        { amount: '1', name: 'lemon' },
        { amount: '1 tsp', name: 'dried oregano' },
      ],
    },
    steps: {
      create: [
        { order: 1, content: 'Chop cucumbers and tomatoes into bite-sized pieces.' },
        { order: 2, content: 'Combine cucumbers, tomatoes, feta cheese, and olives in a bowl.' },
        { order: 3, content: 'In a small bowl, whisk together olive oil, lemon juice, and oregano.' },
        { order: 4, content: 'Pour dressing over salad and toss gently.' },
        { order: 5, content: 'Serve immediately.' },
      ],
    },
    tags: {
      create: [
        { name: 'Greek' },
        { name: 'Salad' },
        { name: 'Vegetarian' },
      ],
    },
  },
]

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })