import { ClerkProvider } from "@clerk/nextjs";
import { Layout } from "@/components/Layout";
import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { RecipeProvider } from '@/lib/recipeContext';

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
          className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        >
          <RecipeProvider>
            <Layout>{children}</Layout>
          </RecipeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
