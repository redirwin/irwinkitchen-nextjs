import RecipeList from '@/components/RecipeList'

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between py-12">
      <RecipeList />
    </main>
  )
}