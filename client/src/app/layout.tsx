import type { Metadata } from "next";
import "./globals.css";
import DashboardWrapper from "./dashboardWrapper";
// import { ThemeProvider } from "@/providers/ThemeProvider";



export const metadata: Metadata = {
  title: "Legion-Task",
  description: "Manage your tasks with ease",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
 
      <body>
        {/* <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem={true}
          themes={["light", "dark"]}
        > */}
        <DashboardWrapper>{children}</DashboardWrapper>
        {/* </ThemeProvider> */}
      </body>
    </html>
  );
}
