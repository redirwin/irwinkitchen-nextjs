"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { SignInButton, UserButton, useAuth } from "@clerk/nextjs"
import { cn } from "@/app/utils/cn"
import { Home, Plus, UserCircle, Soup } from "lucide-react"
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
  const { isLoaded, isSignedIn } = useAuth();

  const iconClass = "h-5 w-5 text-white";
  const linkClass = "flex items-center justify-center";

  return (
    <header className={`bg-navy-blue text-white border-b ${className}`}>
      <div className="container mx-auto max-w-4xl flex h-16 items-center justify-between px-4 sm:px-8">
        <Link href="/" className="text-lg font-semibold flex items-center relative">
          <Soup className="h-6 w-6 mr-2 transform scale-x-[-1] absolute bottom-[0.35em]" />
          <span className="pl-8">Irwin Family Recipe Book</span>
        </Link>
        <div className="flex items-center space-x-6">
          <nav className="flex items-center space-x-6 text-sm font-medium">
            <Link href="/" className={cn(linkClass, "transition-colors hover:text-blue-200", pathname === "/" ? "text-blue-200" : "text-white")}>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <Home className={iconClass} />
                    <span className="sr-only">Home</span>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Home</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </Link>
            {isSignedIn && (
              <Link href="/add-recipe" className={cn(linkClass, "transition-colors hover:text-blue-200", pathname === "/add-recipe" ? "text-blue-200" : "text-white")}>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger>
                      <Plus className={iconClass} />
                      <span className="sr-only">Add Recipe</span>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Add Recipe</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </Link>
            )}
          </nav>
          {isLoaded && (
            <>
              {isSignedIn ? (
                <UserButton 
                  afterSignOutUrl="/"
                  appearance={{
                    elements: {
                      avatarBox: "w-5 h-5"
                    }
                  }}
                />
              ) : (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <SignInButton mode="modal">
                        <button className={cn(linkClass, "bg-transparent border-none cursor-pointer p-0 m-0")}>
                          <UserCircle className={iconClass} />
                        </button>
                      </SignInButton>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Sign In</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              )}
            </>
          )}
        </div>
      </div>
    </header>
  )
}
