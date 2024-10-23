import { ClerkProvider } from "@clerk/nextjs";
import { Header } from "@/app/components/Header";
import { Footer } from "@/app/components/Footer";
import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { RecipeProvider } from '@/lib/recipeContext';
import { Toaster } from "@/app/components/ui/toaster";

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
  title: "Irwin Family Recipe Book",
  description: "A personal recipe application for family use",
  icons: [
    {
      rel: 'icon',
      url: '/favicon.ico',
    },
  ],
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
            <Header />
            <main className="flex-1 container mx-auto max-w-4xl py-6 relative z-0">
              {children}
            </main>
            <Footer />
          </RecipeProvider>
          <Toaster />
        </body>
      </html>
    </ClerkProvider>
  );
}
