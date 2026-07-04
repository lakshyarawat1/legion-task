"use client";

import { AlertCircle, AlertOctagon, AlertTriangle, Briefcase, ChevronDown, ChevronUp, Home, Layers3, LockIcon, LucideIcon, Search, Settings, ShieldAlert, User, Users } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const Sidebar = () => {
  const [showProjects, setShowProjects] = useState(true);
  const [showPriority, setShowPriority] = useState(true);

  const sidebarClassNames =
    "fixed flex flex-col h-full justify-between shadow-lg transition-all duration-300 z-40 bg-white/80 backdrop-blur-xl dark:bg-[#1C1C1E]/80 overflow-y-auto md:w-64 w-22 border-r border-border";

  return (
    <div className={sidebarClassNames}>
      {/* Logo */}
      <div className="flex h-[100%] flex-col justify-start">
        <div className="z-50 flex min-h-[56px] w-64 items-center justify-between px-6 pt-3">
          <div className="text-xl hidden md:flex font-bold text-foreground">
            LEGION-TASK
          </div>
        </div>
        <div className="flex items-center gap-5 border-y-[0.5px] border-border px-8 py-4 mt-2">
          <Image
            src="/logo.png"
            alt="logo"
            width={40}
            height={40}
            className="rounded-full shadow-sm"
          />

          <div>
            <h3 className="text-md font-bold tracking-wide text-foreground hidden md:flex">
              My Team
            </h3>
            <div className="mt-1 items-start gap-2 hidden md:flex">
              <LockIcon className="mt-[0.1rem] h-3 w-3 text-muted-foreground" />
              <p className="text-xs text-muted-foreground">Private</p>
            </div>
          </div>
        </div>
        <nav className="z-10 w-full pt-4">
          <SidebarLink icon={Home} label="Home" href="/" />
          <SidebarLink icon={Briefcase} label="Timeline" href="/timeline" />
          <SidebarLink icon={Search} label="Search" href="/search" />
          <SidebarLink icon={Settings} label="Settings" href="/settings" />
          <SidebarLink icon={User} label="Users" href="/users" />
          <SidebarLink icon={Users} label="Teams" href="/teams" />
        </nav>

        <Button
          variant="ghost"
          onClick={() => setShowProjects((prev) => !prev)}
          className="w-full flex items-center justify-between px-6 py-3 mt-4 text-muted-foreground hover:bg-black/5 dark:hover:bg-white/5 rounded-none hidden md:flex h-auto"
        >
          <span className="font-semibold text-xs tracking-wider uppercase">Projects</span>
          {showProjects ? (
            <ChevronUp className="h-4 w-4" />
          ) : (
            <ChevronDown className="h-4 w-4" />
          )}
        </Button>

        <Button
          variant="ghost"
          onClick={() => setShowPriority((prev) => !prev)}
          className="md:flex hidden w-full items-center justify-between px-6 py-3 text-muted-foreground hover:bg-black/5 dark:hover:bg-white/5 rounded-none h-auto"
        >
          <span className="font-semibold text-xs tracking-wider uppercase">Priority</span>
          {showPriority ? (
            <ChevronUp className="h-4 w-4" />
          ) : (
            <ChevronDown className="h-4 w-4" />
          )}
        </Button>
        {showPriority && (
          <div className="pb-4">
            <SidebarLink icon={AlertCircle} label="Urgent" href="/priority/urgent" />
            <SidebarLink icon={ShieldAlert} label="High" href="/priority/high" />
            <SidebarLink icon={AlertTriangle} label="Medium" href="/priority/medium" />
            <SidebarLink icon={AlertOctagon} label="Low" href="/priority/low" />
            <SidebarLink icon={Layers3} label="Backlog" href="/priority/backlog" />
          </div>
        )}
      </div>
    </div>
  );
};

interface SidebarLinkProps {
  href: string;
  icon: LucideIcon;
  label: string;
}

const SidebarLink = ({ href, icon: Icon, label }: SidebarLinkProps) => {
  const pathName = usePathname();
  const isActive =
    pathName === href || (pathName === "/" && href === "/dashboard");

  return (
    <Link href={href} className="w-full px-3 py-0.5 flex">
      <div
        className={cn(
          "relative flex cursor-pointer items-center gap-3 w-full rounded-xl transition-all duration-200 px-3 py-2",
          isActive 
            ? "bg-primary text-primary-foreground shadow-sm" 
            : "text-foreground hover:bg-secondary"
        )}
      >
        <Icon className={cn("h-5 w-5", isActive ? "text-primary-foreground" : "text-muted-foreground")} />
        <span className="font-medium hidden md:flex text-sm">{label}</span>
      </div>
    </Link>
  );
};

export default Sidebar;
