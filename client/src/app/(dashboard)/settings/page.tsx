"use client";

import React, { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { Sun, Moon, Monitor, User as UserIcon, Code2 } from "lucide-react";
import { cn } from "@/lib/utils";

export default function SettingsPage() {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Avoid hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="flex h-full w-full flex-col p-8 max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground">Settings</h1>
        <p className="text-muted-foreground mt-1">Manage your application preferences and profile.</p>
      </div>

      <div className="flex flex-col gap-8">
        {/* Appearance Section */}
        <section className="rounded-2xl border border-border bg-card p-6 shadow-sm">
          <div className="mb-6 border-b border-border pb-4">
            <h2 className="text-xl font-semibold text-foreground">Appearance</h2>
            <p className="text-sm text-muted-foreground mt-1">Customize how the application looks on your device.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button
              onClick={() => setTheme("light")}
              className={cn(
                "flex flex-col items-center justify-center gap-3 rounded-xl border p-6 transition-all hover:bg-secondary",
                theme === "light"
                  ? "border-primary bg-primary/5 text-primary"
                  : "border-border bg-card text-muted-foreground"
              )}
            >
              <div className={cn("rounded-full p-3", theme === "light" ? "bg-primary/20" : "bg-secondary")}>
                <Sun className="h-6 w-6" />
              </div>
              <span className="font-medium">Light Mode</span>
            </button>
            <button
              onClick={() => setTheme("dark")}
              className={cn(
                "flex flex-col items-center justify-center gap-3 rounded-xl border p-6 transition-all hover:bg-secondary",
                theme === "dark"
                  ? "border-primary bg-primary/5 text-primary"
                  : "border-border bg-card text-muted-foreground"
              )}
            >
              <div className={cn("rounded-full p-3", theme === "dark" ? "bg-primary/20" : "bg-secondary")}>
                <Moon className="h-6 w-6" />
              </div>
              <span className="font-medium">Dark Mode</span>
            </button>
            <button
              onClick={() => setTheme("system")}
              className={cn(
                "flex flex-col items-center justify-center gap-3 rounded-xl border p-6 transition-all hover:bg-secondary",
                theme === "system"
                  ? "border-primary bg-primary/5 text-primary"
                  : "border-border bg-card text-muted-foreground"
              )}
            >
              <div className={cn("rounded-full p-3", theme === "system" ? "bg-primary/20" : "bg-secondary")}>
                <Monitor className="h-6 w-6" />
              </div>
              <span className="font-medium">System Preference</span>
              <span className="text-xs text-muted-foreground absolute bottom-3">
                (Currently: {resolvedTheme})
              </span>
            </button>
          </div>
        </section>

        {/* Profile Section (Read-only stub) */}
        <section className="rounded-2xl border border-border bg-card p-6 shadow-sm">
          <div className="mb-6 border-b border-border pb-4">
            <h2 className="text-xl font-semibold text-foreground">Profile</h2>
            <p className="text-sm text-muted-foreground mt-1">Your personal information and team affiliation.</p>
          </div>

          <div className="flex items-center gap-6">
            <div className="flex h-24 w-24 items-center justify-center rounded-full bg-primary/10 text-4xl font-bold text-primary border-4 border-card shadow-sm">
              A
            </div>
            <div>
              <h3 className="text-2xl font-bold text-foreground">AliceJones</h3>
              <p className="text-muted-foreground mt-1 flex items-center gap-2">
                <UserIcon className="h-4 w-4" /> Product Owner
              </p>
              <div className="mt-3 inline-flex items-center rounded-full bg-secondary px-3 py-1 text-sm font-medium text-foreground">
                Quantum Innovations
              </div>
            </div>
          </div>
        </section>

        {/* About Section */}
        <section className="rounded-2xl border border-border bg-card p-6 shadow-sm">
          <div className="mb-6 border-b border-border pb-4 flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-foreground">About LegionTask</h2>
              <p className="text-sm text-muted-foreground mt-1">Application details and tech stack.</p>
            </div>
            <Code2 className="h-8 w-8 text-muted-foreground" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 text-sm">
            <div className="flex flex-col gap-1">
              <span className="text-muted-foreground">Version</span>
              <span className="font-medium text-foreground">1.0.0 (Beta)</span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-muted-foreground">Frontend</span>
              <span className="font-medium text-foreground">Next.js 15, Tailwind CSS v4, Redux Toolkit</span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-muted-foreground">Backend</span>
              <span className="font-medium text-foreground">Node.js, Express, REST API</span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-muted-foreground">Database</span>
              <span className="font-medium text-foreground">PostgreSQL, Prisma ORM</span>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
