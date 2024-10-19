import { ClerkProvider } from "@clerk/nextjs";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { RecipeProvider } from '@/lib/recipeContext';
import { Toaster } from "@/components/ui/toaster";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Family Recipe Book",
  description: "A personal recipe application for family use",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen bg-white flex flex-col dark:bg-neutral-950`}
        >
          <RecipeProvider>
            <Header className="z-10" />
            <main className="flex-1 container mx-auto max-w-4xl py-6 relative z-0">
              {children}
            </main>
            <Footer className="z-10" />
          </RecipeProvider>
          <Toaster />
        </body>
      </html>
    </ClerkProvider>
  );
}