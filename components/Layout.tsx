import { Header } from "./Header"
import { Footer } from "./Footer"

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-white flex flex-col dark:bg-neutral-950">
      <Header className="z-10" />
      <main className="flex-1 container mx-auto max-w-4xl py-6 relative z-0">
        {children}
      </main>
      <Footer className="z-10" />
    </div>
  )
}
