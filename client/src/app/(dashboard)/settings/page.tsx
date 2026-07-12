"use client";

import React, { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { Sun, Moon, Monitor, User as UserIcon, Code2, Pencil, Check, X } from "lucide-react";
import { cn, formatUsername, getAvatarColor } from "@/lib/utils";
import { useGetMeQuery, useUpdateUserMutation } from "@/state/api";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function SettingsPage() {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const { data: currentUser } = useGetMeQuery();
  const [updateUser, { isLoading: isUpdating }] = useUpdateUserMutation();
  const [mounted, setMounted] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editUsername, setEditUsername] = useState("");

  useEffect(() => {
    if (currentUser && !isEditing) {
      setEditUsername(currentUser.username);
    }
  }, [currentUser, isEditing]);

  const handleSaveUsername = async () => {
    if (!currentUser || !editUsername.trim() || editUsername === currentUser.username) {
      setIsEditing(false);
      return;
    }

    try {
      await updateUser({ userId: currentUser.userId, username: editUsername }).unwrap();
      setIsEditing(false);
    } catch (err: any) {
      alert(`Error updating username: ${err?.data?.error || "Unknown error"}`);
    }
  };

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
            {currentUser ? (
              <>
                <div
                  className={cn(
                    "flex h-24 w-24 items-center justify-center rounded-full text-4xl font-bold border-4 border-card shadow-sm text-white",
                    getAvatarColor(currentUser.username)
                  )}
                >
                  {formatUsername(currentUser.username).charAt(0).toUpperCase()}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-3">
                    {isEditing ? (
                      <div className="flex items-center gap-2">
                        <Input
                          value={editUsername}
                          onChange={(e) => setEditUsername(e.target.value)}
                          className="h-8 text-lg font-bold w-48"
                          autoFocus
                          onKeyDown={(e) => {
                            if (e.key === "Enter") handleSaveUsername();
                            if (e.key === "Escape") {
                              setIsEditing(false);
                              setEditUsername(currentUser.username);
                            }
                          }}
                        />
                        <Button
                          size="icon"
                          variant="ghost"
                          className="h-8 w-8 text-green-500 hover:text-green-600 hover:bg-green-500/10"
                          onClick={handleSaveUsername}
                          disabled={isUpdating}
                        >
                          <Check className="h-4 w-4" />
                        </Button>
                        <Button
                          size="icon"
                          variant="ghost"
                          className="h-8 w-8 text-red-500 hover:text-red-600 hover:bg-red-500/10"
                          onClick={() => {
                            setIsEditing(false);
                            setEditUsername(currentUser.username);
                          }}
                          disabled={isUpdating}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ) : (
                      <>
                        <h3 className="text-2xl font-bold text-foreground">
                          {formatUsername(currentUser.username)}
                        </h3>
                        <Button
                          size="icon"
                          variant="ghost"
                          className="h-6 w-6 text-muted-foreground hover:text-foreground"
                          onClick={() => setIsEditing(true)}
                        >
                          <Pencil className="h-3 w-3" />
                        </Button>
                      </>
                    )}
                  </div>
                  <p className="text-muted-foreground mt-1 flex items-center gap-2">
                    <UserIcon className="h-4 w-4" /> 
                    <span className="font-mono text-xs opacity-70">#{currentUser.userId}</span>
                    <span>•</span>
                    {currentUser.team?.productOwnerUserId === currentUser.userId 
                      ? "Product Owner" 
                      : currentUser.team?.projectManagerUserId === currentUser.userId 
                        ? "Project Manager" 
                        : "Team Member"}
                  </p>
                  <div className="mt-3 inline-flex items-center rounded-full bg-secondary px-3 py-1 text-sm font-medium text-foreground">
                    {currentUser.team?.teamName || "No Team Assigned"}
                  </div>
                </div>
              </>
            ) : (
              <div className="flex items-center gap-4 animate-pulse">
                <div className="h-24 w-24 rounded-full bg-secondary" />
                <div className="space-y-3">
                  <div className="h-6 w-32 bg-secondary rounded" />
                  <div className="h-4 w-24 bg-secondary rounded" />
                  <div className="h-6 w-28 bg-secondary rounded-full" />
                </div>
              </div>
            )}
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
