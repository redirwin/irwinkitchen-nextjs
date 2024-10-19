"use client";

import { SignOutButton as ClerkSignOutButton } from "@clerk/nextjs";
import { useRouter } from "next/navigation";

export function SignOutButton() {
  const router = useRouter();

  return (
    <ClerkSignOutButton
      signOutCallback={() => router.push("/")}
    >
      <button className="text-sm font-semibold leading-6 text-gray-900">
        Sign out
      </button>
    </ClerkSignOutButton>
  );
}
