"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/app/components/ui/button"
import { SignInButton, UserButton, SignedIn, SignedOut } from "@clerk/nextjs"
import { cn } from "@/lib/utils"
import * as DropdownMenu from "@radix-ui/react-dropdown-menu"
import { Menu } from "lucide-react"

export function Header() {
  const pathname = usePathname()

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-navy-blue text-white">
      <div className="container mx-auto max-w-4xl flex h-16 items-center justify-between px-4">
        <div className="flex items-center">
          <Link href="/" className="flex items-center space-x-2 mr-6 logo">
            <span className="text-lg font-bold">Irwin Kitchen</span>
          </Link>
          <nav className="hidden md:flex items-center space-x-4">
            <Link
              href="/"
              className={cn(
                "flex items-center text-sm font-medium transition-colors hover:text-blue-200",
                pathname === "/" ? "text-blue-200" : "text-white"
              )}
            >
              Browse Recipes
            </Link>
            <Link
              href="/add-recipe"
              className={cn(
                "flex items-center text-sm font-medium transition-colors hover:text-blue-200",
                pathname === "/add-recipe" ? "text-blue-200" : "text-white"
              )}
            >
              Add Recipe
            </Link>
          </nav>
        </div>
        <div className="flex items-center space-x-4">
          <DropdownMenu.Root>
            <DropdownMenu.Trigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden text-white hover:text-blue-200" aria-label="Menu">
                <Menu className="h-5 w-5" />
              </Button>
            </DropdownMenu.Trigger>
            <DropdownMenu.Portal>
              <DropdownMenu.Content className="z-50 min-w-[8rem] overflow-hidden rounded-md border bg-navy-blue p-1 shadow-md animate-in data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2">
                <DropdownMenu.Item className="relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors focus:bg-blue-700 focus:text-white">
                  <Link href="/">Home</Link>
                </DropdownMenu.Item>
                <DropdownMenu.Item className="relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors focus:bg-blue-700 focus:text-white">
                  <Link href="/add-recipe">Add Recipe</Link>
                </DropdownMenu.Item>
                <DropdownMenu.Separator className="my-1 h-px bg-blue-700" />
                <SignedOut>
                  <DropdownMenu.Item className="relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors focus:bg-blue-700 focus:text-white">
                    <SignInButton mode="modal">
                      Sign In
                    </SignInButton>
                  </DropdownMenu.Item>
                </SignedOut>
                <SignedIn>
                  <DropdownMenu.Item className="relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors focus:bg-blue-700 focus:text-white">
                    <UserButton afterSignOutUrl="/" />
                  </DropdownMenu.Item>
                </SignedIn>
              </DropdownMenu.Content>
            </DropdownMenu.Portal>
          </DropdownMenu.Root>
          <div className="hidden md:block">
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
          </div>
        </div>
      </div>
    </header>
  )
}
