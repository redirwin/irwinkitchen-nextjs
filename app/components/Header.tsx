"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/app/components/ui/button"
import { SignInButton, UserButton, SignedIn, SignedOut } from "@clerk/nextjs"
import { cn } from "@/lib/utils"
import { Home, UtensilsCrossed } from "lucide-react"

export function Header() {
  const pathname = usePathname()

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-navy-blue text-white">
      <div className="container mx-auto max-w-4xl flex h-16 items-center justify-between px-4">
        <div className="flex items-center">
          <Link href="/" className="flex items-center space-x-2 mr-6 logo">
            <span className="text-lg font-bold">Irwin Kitchen</span>
          </Link>
        </div>
        <nav className="flex items-center space-x-4">
          <Link
            href="/"
            className={cn(
              "flex items-center text-sm font-medium transition-colors hover:text-blue-200",
              pathname === "/" ? "text-blue-200" : "text-white"
            )}
            aria-label="Browse Recipes"
          >
            <Home className="h-5 w-5" />
          </Link>
          <Link
            href="/add-recipe"
            className={cn(
              "flex items-center text-sm font-medium transition-colors hover:text-blue-200",
              pathname === "/add-recipe" ? "text-blue-200" : "text-white"
            )}
            aria-label="Add Recipe"
          >
            <UtensilsCrossed className="h-5 w-5" />
          </Link>
          <SignedOut>
            <SignInButton mode="modal">
              <Button variant="outline" size="sm" className="text-white border-white hover:bg-blue-700">
                Sign In
              </Button>
            </SignInButton>
          </SignedOut>
          <SignedIn>
            <UserButton afterSignOutUrl="/" />
          </SignedIn>
        </nav>
      </div>
    </header>
  )
}
