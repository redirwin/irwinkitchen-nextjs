"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { SignInButton, UserButton, SignedIn, SignedOut } from "@clerk/nextjs"
import { cn } from "@/app/utils/cn"
import { Home, Plus, UserCircle } from "lucide-react"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/app/components/ui/tooltip"
import { FC } from 'react';

interface HeaderProps {
  className?: string;
}

export const Header: FC<HeaderProps> = ({ className = '' }) => {
  const pathname = usePathname()

  return (
    <header className={`bg-navy-blue text-white border-b ${className}`}>
      <div className="container mx-auto max-w-4xl flex h-16 items-center justify-between px-4 sm:px-8">
        <Link href="/" className="text-lg font-semibold">
          Irwin Kitchen
        </Link>
        <div className="flex items-center space-x-6">
          <nav className="flex items-center space-x-6 text-sm font-medium">
            <Link href="/" className={cn("transition-colors hover:text-blue-200", pathname === "/" ? "text-blue-200" : "text-white")}>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <Home className="h-5 w-5" />
                    <span className="sr-only">Home</span>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Home</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </Link>
            <SignedIn>
              <Link href="/add-recipe" className={cn("transition-colors hover:text-blue-200", pathname === "/add-recipe" ? "text-blue-200" : "text-white")}>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger>
                      <Plus className="h-5 w-5" />
                      <span className="sr-only">Add Recipe</span>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Add Recipe</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </Link>
            </SignedIn>
          </nav>
          <SignedIn>
            <UserButton afterSignOutUrl="/" />
          </SignedIn>
          <SignedOut>
            <SignInButton>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <UserCircle className="h-5 w-5" />
                    <span className="sr-only">Sign In</span>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Sign In</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </SignInButton>
          </SignedOut>
        </div>
      </div>
    </header>
  )
}
