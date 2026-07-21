"use client";

import React, { useEffect } from "react";
import Navbar from "./(components)/Navbar/Navbar";
import Sidebar from "./(components)/Sidebar/Sidebar";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "@/state/store";
import { Suspense } from "react";
import TaskModalProvider from "@/app/(components)/TaskModalProvider";
import { useUser } from "@clerk/nextjs";
import { useGetMeQuery } from "@/state/api";
import { useRouter, usePathname } from "next/navigation";
import PageLoader from "@/app/(components)/PageLoader/PageLoader";
import { useTheme } from "next-themes";
import useKeyboardShortcuts from "@/hooks/useKeyboardShortcuts";
import ShortcutOverlay from "@/app/(components)/ShortcutOverlay/ShortcutOverlay";
import { toggleSidebar, toggleShortcutOverlay, setShortcutOverlayOpen, setNewTaskModalOpen } from "@/state/globalSlice";
import ModalNewTask from "@/app/(components)/ModalNewTask/ModalNewTask";
import { useNotificationStream } from "@/app/(components)/Notifications/useNotificationStream";
import { NotificationToast } from "@/app/(components)/Notifications/NotificationToast";

const DashboardWrapper = ({ children }: { children: React.ReactNode }) => {
  const dispatch = useDispatch<AppDispatch>();
  const isSidebarCollapsed = useSelector((state: RootState) => state.global.isSidebarCollapsed);
  const isShortcutOverlayOpen = useSelector((state: RootState) => state.global.isShortcutOverlayOpen);
  const isNewTaskModalOpen = useSelector((state: RootState) => state.global.isNewTaskModalOpen);
  const { isLoaded, user } = useUser();
  const { data: localUser, isLoading: isLocalUserLoading } = useGetMeQuery(undefined, {
    skip: !isLoaded || !user,
  });
  const router = useRouter();
  const pathname = usePathname();
  const { resolvedTheme, setTheme } = useTheme();

  const { lastNotification } = useNotificationStream();
  const [activeNotification, setActiveNotification] = React.useState<any>(null);

  React.useEffect(() => {
    if (lastNotification) {
      setActiveNotification(lastNotification);
    }
  }, [lastNotification]);

  useKeyboardShortcuts({
    onNavigateDashboard: () => router.push("/dashboard"),
    onNavigateProjects: () => router.push("/projects"),
    onNavigateTimeline: () => router.push("/timeline"),
    onNavigateSettings: () => router.push("/settings"),
    onFocusSearch: () => {
      const searchInput = document.getElementById("global-search-input");
      if (searchInput) searchInput.focus();
    },
    onCreateTask: () => dispatch(setNewTaskModalOpen(true)),
    onToggleTheme: () => setTheme(resolvedTheme === "dark" ? "light" : "dark"),
    onToggleSidebar: () => dispatch(toggleSidebar()),
    onEscape: () => {
      dispatch(setShortcutOverlayOpen(false));
      dispatch(setNewTaskModalOpen(false));
    },
    onToggleShortcutHelp: () => dispatch(toggleShortcutOverlay()),
  });

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
      <ShortcutOverlay
        isOpen={isShortcutOverlayOpen}
        onClose={() => dispatch(setShortcutOverlayOpen(false))}
      />
      <ModalNewTask
        open={isNewTaskModalOpen}
        onClose={() => dispatch(setNewTaskModalOpen(false))}
        projectId=""
      />
      <NotificationToast
        notification={activeNotification}
        onClose={() => setActiveNotification(null)}
      />
    </div>
  );
};

export default DashboardWrapper;