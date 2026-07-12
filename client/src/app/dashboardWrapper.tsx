"use client";

import React, { useEffect } from "react";
import Navbar from "./(components)/Navbar/Navbar";
import Sidebar from "./(components)/Sidebar/Sidebar";
import { useSelector } from "react-redux";
import { RootState } from "@/state/store";
import { Suspense } from "react";
import TaskModalProvider from "@/app/(components)/TaskModalProvider";
import { useUser } from "@clerk/nextjs";
import { useGetMeQuery } from "@/state/api";
import { useRouter, usePathname } from "next/navigation";
import PageLoader from "@/app/(components)/PageLoader/PageLoader";

const DashboardWrapper = ({ children }: { children: React.ReactNode }) => {
  const isSidebarCollapsed = useSelector((state: RootState) => state.global.isSidebarCollapsed);
  const { isLoaded, user } = useUser();
  const { data: localUser, isLoading: isLocalUserLoading } = useGetMeQuery(undefined, {
    skip: !isLoaded || !user,
  });
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (isLoaded && user && localUser) {
      if (!localUser.orgId && pathname !== "/onboarding") {
        router.push("/onboarding");
      }
    }
  }, [isLoaded, user, localUser, pathname, router]);

  if (!isLoaded || isLocalUserLoading) {
    return <PageLoader message="Loading workspace..." />;
  }

  // If user has no orgId and they are not on the onboarding page, we're currently redirecting.
  // We can render a blank screen or a loading state while the redirect happens.
  if (user && localUser && !localUser.orgId && pathname !== "/onboarding") {
    return <div className="flex min-h-screen items-center justify-center">Redirecting to onboarding...</div>;
  }

  return (
    <div className="flex min-h-screen w-full bg-background text-foreground">
      <Sidebar isSidebarCollapsed={isSidebarCollapsed} />
      <main
        className={`flex w-full flex-col bg-background transition-all duration-300 ${
          isSidebarCollapsed ? "md:pl-16" : "md:pl-64"
        }`}
      >
        <Navbar />
        {children}
        <Suspense fallback={null}>
          <TaskModalProvider />
        </Suspense>
      </main>
    </div>
  );
};

export default DashboardWrapper;