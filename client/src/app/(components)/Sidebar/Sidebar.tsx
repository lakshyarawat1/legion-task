"use client";

import {
  AlertCircle,
  AlertOctagon,
  AlertTriangle,
  Briefcase,
  ChevronDown,
  ChevronUp,
  Home,
  Layers3,
  LockIcon,
  LucideIcon,
  Search,
  Settings,
  ShieldAlert,
  User,
  Users,
  Plus,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useGetProjectsQuery } from "@/state/api";
import ModalNewProject from "../ModalNewProject/ModalNewProject";

interface SidebarProps {
  isSidebarCollapsed: boolean;
}

const Sidebar = ({ isSidebarCollapsed }: SidebarProps) => {
  const [showProjects, setShowProjects] = useState(true);
  const [showPriority, setShowPriority] = useState(true);
  const [isNewProjectModalOpen, setIsNewProjectModalOpen] = useState(false);

  const { data: projects } = useGetProjectsQuery();

  const sidebarClassNames = cn(
    "fixed flex flex-col h-full justify-between shadow-lg transition-all duration-300 z-40 bg-white/80 backdrop-blur-xl dark:bg-[#1C1C1E]/80 overflow-y-auto border-r border-border",
    isSidebarCollapsed ? "w-0 md:w-16 overflow-hidden hidden md:flex" : "w-64"
  );

  return (
    <div className={sidebarClassNames}>
      {/* Logo */}
      <div className="flex h-[100%] flex-col justify-start">
        <div className={cn("z-50 flex min-h-[56px] items-center px-6 pt-3", isSidebarCollapsed ? "justify-center px-0" : "justify-between")}>
          <div className={cn("text-xl font-bold text-foreground", isSidebarCollapsed ? "hidden" : "flex")}>
            LEGION-TASK
          </div>
          {isSidebarCollapsed && (
            <div className="text-xl font-bold text-foreground bg-primary text-primary-foreground h-8 w-8 rounded-lg flex items-center justify-center">
              LT
            </div>
          )}
        </div>
        
        <div className={cn("flex items-center gap-5 border-y-[0.5px] border-border py-4 mt-2", isSidebarCollapsed ? "px-2 justify-center" : "px-8")}>
          <Image
            src="/logo.png"
            alt="logo"
            width={isSidebarCollapsed ? 30 : 40}
            height={isSidebarCollapsed ? 30 : 40}
            className="rounded-full shadow-sm flex-shrink-0"
          />

          <div className={cn(isSidebarCollapsed ? "hidden" : "flex flex-col")}>
            <h3 className="text-md font-bold tracking-wide text-foreground">
              My Team
            </h3>
            <div className="mt-1 flex items-start gap-2">
              <LockIcon className="mt-[0.1rem] h-3 w-3 text-muted-foreground" />
              <p className="text-xs text-muted-foreground">Private</p>
            </div>
          </div>
        </div>

        <nav className="z-10 w-full pt-4 flex flex-col gap-1">
          <SidebarLink icon={Home} label="Home" href="/dashboard" isCollapsed={isSidebarCollapsed} />
          <SidebarLink icon={Briefcase} label="Timeline" href="/timeline" isCollapsed={isSidebarCollapsed} />
          <SidebarLink icon={Search} label="Search" href="/search" isCollapsed={isSidebarCollapsed} />
          <SidebarLink icon={Settings} label="Settings" href="/settings" isCollapsed={isSidebarCollapsed} />
          <SidebarLink icon={User} label="Users" href="/users" isCollapsed={isSidebarCollapsed} />
          <SidebarLink icon={Users} label="Teams" href="/teams" isCollapsed={isSidebarCollapsed} />
        </nav>

        {!isSidebarCollapsed && (
          <div className="mt-4 flex items-center justify-between px-6 py-3">
            <span className="font-semibold text-xs tracking-wider uppercase text-muted-foreground">Projects</span>
            <div className="flex items-center gap-2">
              <button onClick={() => setIsNewProjectModalOpen(true)} className="text-muted-foreground hover:text-foreground">
                <Plus className="h-4 w-4" />
              </button>
              <button onClick={() => setShowProjects((prev) => !prev)} className="text-muted-foreground hover:text-foreground">
                {showProjects ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
              </button>
            </div>
          </div>
        )}

        {showProjects && !isSidebarCollapsed && (
          <div className="pb-2 flex flex-col gap-1">
            {projects?.map((project) => (
              <SidebarLink 
                key={project.id} 
                icon={Briefcase} 
                label={project.name} 
                href={`/projects/${project.id}`} 
                isCollapsed={isSidebarCollapsed} 
              />
            ))}
          </div>
        )}

        {!isSidebarCollapsed && (
          <Button
            variant="ghost"
            onClick={() => setShowPriority((prev) => !prev)}
            className="w-full flex items-center justify-between px-6 py-3 text-muted-foreground hover:bg-secondary rounded-none h-auto"
          >
            <span className="font-semibold text-xs tracking-wider uppercase">Priority</span>
            {showPriority ? (
              <ChevronUp className="h-4 w-4" />
            ) : (
              <ChevronDown className="h-4 w-4" />
            )}
          </Button>
        )}
        
        {showPriority && !isSidebarCollapsed && (
          <div className="pb-4 flex flex-col gap-1">
            <SidebarLink icon={AlertCircle} label="Urgent" href="/priority/urgent" isCollapsed={isSidebarCollapsed} />
            <SidebarLink icon={ShieldAlert} label="High" href="/priority/high" isCollapsed={isSidebarCollapsed} />
            <SidebarLink icon={AlertTriangle} label="Medium" href="/priority/medium" isCollapsed={isSidebarCollapsed} />
            <SidebarLink icon={AlertOctagon} label="Low" href="/priority/low" isCollapsed={isSidebarCollapsed} />
            <SidebarLink icon={Layers3} label="Backlog" href="/priority/backlog" isCollapsed={isSidebarCollapsed} />
          </div>
        )}
      </div>

      <ModalNewProject open={isNewProjectModalOpen} onClose={() => setIsNewProjectModalOpen(false)} />
    </div>
  );
};

interface SidebarLinkProps {
  href: string;
  icon: LucideIcon;
  label: string;
  isCollapsed: boolean;
}

const SidebarLink = ({ href, icon: Icon, label, isCollapsed }: SidebarLinkProps) => {
  const pathName = usePathname();
  const isActive =
    pathName === href || (pathName === "/dashboard" && href === "/dashboard");

  return (
    <Link href={href} className={cn("w-full px-3 py-0.5 flex", isCollapsed ? "justify-center px-0" : "")}>
      <div
        className={cn(
          "relative flex cursor-pointer items-center w-full rounded-xl transition-all duration-200 px-3 py-2",
          isActive 
            ? "bg-primary text-primary-foreground shadow-sm" 
            : "text-foreground hover:bg-secondary",
          isCollapsed ? "justify-center mx-2 w-auto" : "gap-3"
        )}
        title={isCollapsed ? label : undefined}
      >
        <Icon className={cn("h-5 w-5 flex-shrink-0", isActive ? "text-primary-foreground" : "text-muted-foreground")} />
        {!isCollapsed && <span className="font-medium text-sm truncate">{label}</span>}
      </div>
    </Link>
  );
};

export default Sidebar;
