import type { Metadata } from "next";
import "../globals.css";
import { ThemeProvider } from "@/providers/ThemeProvider";
import StoreProvider from "@/providers/StoreProvider";
import { Inter } from "next/font/google";
import { cn } from "@/lib/utils";
import { AuthProvider } from "@/providers/AuthProvider";

const inter = Inter({subsets:['latin'],variable:'--font-sans'});

export const metadata: Metadata = {
  title: "Legion-Task",
  description: "Manage your tasks with ease",
};

import { ClerkProvider } from "@clerk/nextjs";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en" suppressHydrationWarning className={cn("font-sans", inter.variable)}>
        <body suppressHydrationWarning>
          <StoreProvider>
            <AuthProvider>
              <ThemeProvider
                attribute="class"
                defaultTheme="system"
                enableSystem={true}
                themes={["light", "dark"]}
              >
                {children}
              </ThemeProvider>
            </AuthProvider>
          </StoreProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
