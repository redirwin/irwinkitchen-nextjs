# Family Recipe Book

This is a personal recipe application tailored for family use, built with [Next.js](https://nextjs.org).

## Project Overview

The Family Recipe Book is a web application designed to store, manage, and share family recipes. It provides a user-friendly interface for adding, viewing, and organizing recipes, with features such as categorization, tagging, and image uploads.

## Features

- User authentication and individual profiles
- Add and view recipes with detailed information (name, description, ingredients, instructions, cooking time, difficulty level, serving size)
- Categorize and tag recipes for easy organization
- Attach images to recipes
- Browse and search recipes
- Responsive design for desktop and mobile use

## Getting Started

First, set up the environment:

1. Clone this repository
2. Install dependencies:

```
npm install
# or
yarn install
```

3. Set up your environment variables (see `.env.example` for required variables)

Then, run the development server:

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Project Structure

- `app/`: Next.js app router and page components
- `components/`: Reusable React components
- `lib/`: Utility functions and context providers
- `public/`: Static assets
- `styles/`: Global styles and CSS modules
- `types/`: TypeScript type definitions
- `data/`: Sample recipe data

## Technologies Used

- Next.js
- React
- TypeScript
- Tailwind CSS
- Clerk (for authentication)
- Prisma (for database management)

## TODO

To complete the MVP, the following tasks are pending:

1. Implement backend API routes for CRUD operations on recipes
2. Connect frontend components to the backend API
3. Set up a database to store recipe and user data
4. Implement image upload functionality
5. Add search and filtering capabilities for recipes

## Contributing

This is a personal project, but suggestions and feedback are welcome. Please open an issue to discuss any changes you'd like to propose.

## License

This project is private and not licensed for public use or distribution.
