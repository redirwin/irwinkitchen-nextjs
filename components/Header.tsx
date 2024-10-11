"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { SignInButton, UserButton, SignedIn, SignedOut } from "@clerk/nextjs"
import { cn } from "@/lib/utils"
import * as DropdownMenu from "@radix-ui/react-dropdown-menu"
import { Menu } from "lucide-react"

const MobileNav = () => {
  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden">
          <Menu className="h-5 w-5" />
          <span className="sr-only">Toggle menu</span>
        </Button>
      </DropdownMenu.Trigger>
      <DropdownMenu.Portal>
        <DropdownMenu.Content className="z-50 min-w-[8rem] overflow-hidden rounded-md border bg-white p-1 shadow-md animate-in data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 dark:border-neutral-800 dark:bg-neutral-950">
          <DropdownMenu.Item className="relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors focus:bg-neutral-100 focus:text-neutral-900 dark:focus:bg-neutral-800 dark:focus:text-neutral-50">
            <Link href="/">Home</Link>
          </DropdownMenu.Item>
          <DropdownMenu.Item className="relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors focus:bg-neutral-100 focus:text-neutral-900 dark:focus:bg-neutral-800 dark:focus:text-neutral-50">
            <Link href="/add-recipe">Add Recipe</Link>
          </DropdownMenu.Item>
          <DropdownMenu.Separator className="my-1 h-px bg-neutral-200 dark:bg-neutral-700" />
          <SignedOut>
            <DropdownMenu.Item className="relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors focus:bg-neutral-100 focus:text-neutral-900 dark:focus:bg-neutral-800 dark:focus:text-neutral-50">
              <SignInButton mode="modal">
                Sign In
              </SignInButton>
            </DropdownMenu.Item>
          </SignedOut>
          <SignedIn>
            <DropdownMenu.Item className="relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors focus:bg-neutral-100 focus:text-neutral-900 dark:focus:bg-neutral-800 dark:focus:text-neutral-50">
              <UserButton afterSignOutUrl="/" />
            </DropdownMenu.Item>
          </SignedIn>
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  )
}

export function Header() {
  const pathname = usePathname()

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-white dark:bg-neutral-950">
      <div className="container mx-auto max-w-4xl flex h-16 items-center justify-between px-4">
        <div className="flex items-center">
          <Link href="/" className="flex items-center space-x-2 mr-10 logo">
            <span className="inline-block font-bold">Irwin Kitchen</span>
          </Link>
          <nav className="hidden md:flex items-center space-x-6">
            <Link
              href="/"
              className={cn(
                "flex items-center text-sm font-medium",
                pathname === "/" ? "text-neutral-900 dark:text-neutral-100" : "text-neutral-500 dark:text-neutral-400"
              )}
            >
              Browse Recipes
            </Link>
            <Link
              href="/add-recipe"
              className={cn(
                "flex items-center text-sm font-medium",
                pathname === "/add-recipe" ? "text-neutral-900 dark:text-neutral-100" : "text-neutral-500 dark:text-neutral-400"
              )}
            >
              Add Recipe
            </Link>
          </nav>
        </div>
        <div className="flex items-center">
          <MobileNav />
          <div className="hidden md:block ml-4">
            <SignedOut>
              <SignInButton mode="modal">
                <Button variant="ghost" size="sm">
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