"use client";

import { Bell } from "lucide-react";
import { Button } from "./ui/button";
import { SignInButton, UserButton, useUser } from "@clerk/nextjs";

export default function Header() {
  const { user, isSignedIn } = useUser();
  const today = new Date().toLocaleDateString("pt-BR", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });

  return (
    <header className="sticky top-0 z-10 flex h-16 items-center justify-between border-b bg-background/80 px-4 backdrop-blur-sm md:px-6">
      {isSignedIn && user ? (
        <>
          <div>
            <h1 className="text-lg font-semibold">Olá, {user?.firstName}!</h1>
            <p className="text-sm text-muted-foreground">{today}</p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon">
              <Bell className="h-5 w-5" />
            </Button>
            <UserButton showName />
          </div>
        </>
      ) : (
        <SignInButton />
      )}
    </header>
  );
}
