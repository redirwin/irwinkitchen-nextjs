"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
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
  const router = useRouter();

  const iconClass = "h-5 w-5 text-white";
  const linkClass = "flex items-center justify-center";

  return (
    <header className={`bg-navy-blue text-white border-b sticky top-0 left-0 right-0 z-40 ${className}`}>
      <div className="container mx-auto max-w-4xl flex h-16 items-center justify-between px-4 sm:px-8">
        <button onClick={() => {
          sessionStorage.setItem('resetListState', 'true');
          window.dispatchEvent(new Event('resetListState'));
          router.push('/');
        }} className="text-lg font-semibold flex items-center relative">
          <Soup className="h-6 w-6 mr-2 transform scale-x-[-1] sm:relative sm:transform-none sm:bottom-[0.18em]" />
          <span className="pl-0 sm:pl-0 mr-2 sm:mr-0 leading-none ">Irwin Family<wbr /> Recipe Book</span>
        </button>
        <div className="flex items-center space-x-6">
          <nav className="flex items-center space-x-6 text-sm font-medium">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <button 
                    onClick={() => {
                      sessionStorage.setItem('resetListState', 'true');
                      window.dispatchEvent(new Event('resetListState'));
                      router.push('/');
                    }}
                  >
                    <Home className={iconClass} />
                    <span className="sr-only">Home</span>
                  </button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Home</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
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
