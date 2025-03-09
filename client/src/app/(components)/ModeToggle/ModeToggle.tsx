"use client";

import * as React from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

export function ModeToggle() {
  const { setTheme, theme } = useTheme();

  return (
    <>
      {theme === "dark" ? (
        <button onClick={() => setTheme("light")}>
          <Sun className="h-6 w-6 cursor-pointer" />
        </button>
      ) : (
        <button onClick={() => setTheme("dark")}>
          <Moon className="w-6 h-6 cursor-pointer" />
        </button>
      )}
    </>
  );
}
