"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useGetProjectsQuery, useGetTasksQuery } from "@/state/api";
import { Layout, Plus, Search, Calendar, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import EmptyState from "@/app/(components)/EmptyState/EmptyState";
import ModalNewProject from "@/app/(components)/ModalNewProject/ModalNewProject";
import { format } from "date-fns";

export default function ProjectsPage() {
  const { data: projects, isLoading: isProjectsLoading } = useGetProjectsQuery();
  const { data: tasks, isLoading: isTasksLoading } = useGetTasksQuery({});
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const isLoading = isProjectsLoading || isTasksLoading;

  const filteredProjects = projects?.filter((project) =>
    project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (project.description?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false)
  );

  if (isLoading) {
    return (
      <div className="flex h-full w-full flex-col p-8 max-w-7xl mx-auto gap-6">
        <div className="h-10 w-48 animate-pulse rounded bg-secondary" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="h-48 w-full animate-pulse rounded-2xl bg-secondary" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-full w-full flex-col p-8 max-w-7xl mx-auto">
      <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <div className="rounded-xl bg-primary/10 p-2">
              <Layout className="h-6 w-6 text-primary" />
            </div>
            All Projects
            {projects && (
              <span className="ml-2 rounded-full bg-secondary px-2.5 py-0.5 text-sm font-semibold text-muted-foreground">
                {projects.length}
              </span>
            )}
          </h1>
          <p className="text-muted-foreground mt-1">Browse and manage all your organization's projects.</p>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
          <div className="relative w-full sm:max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search projects..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 h-10 w-full rounded-xl bg-card border-border"
            />
          </div>
          <Button onClick={() => setIsModalOpen(true)} className="flex items-center gap-2 w-full sm:w-auto">
            <Plus className="h-4 w-4" />
            New Project
          </Button>
        </div>
      </div>

      {!filteredProjects || filteredProjects.length === 0 ? (
        <EmptyState
          icon={Layout}
          title={searchTerm ? `No projects found matching "${searchTerm}"` : "No projects found"}
          description={searchTerm ? "Try a different search term." : "Create your first project to get started."}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((project) => {
            const projectTasks = tasks?.filter((t) => t.projectId === project.id) || [];
            const completed = projectTasks.filter((t) => t.status === "Completed").length;
            const progress = projectTasks.length ? Math.round((completed / projectTasks.length) * 100) : 0;

            return (
              <Link
                href={`/projects/${project.id}`}
                key={project.id}
                className="group flex flex-col justify-between rounded-2xl border border-border bg-card p-6 shadow-sm transition-all hover:shadow-md hover:border-primary/50"
              >
                <div>
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="text-lg font-bold text-foreground group-hover:text-primary transition-colors line-clamp-1">
                      {project.name}
                    </h3>
                  </div>
                  <p className="mb-6 text-sm text-muted-foreground line-clamp-2 min-h-[40px]">
                    {project.description || "No description provided."}
                  </p>
                </div>

                <div className="flex flex-col gap-4 mt-auto border-t border-border pt-4">
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <div className="flex items-center gap-1.5">
                      <Calendar className="h-3.5 w-3.5" />
                      <span>
                        {project.startDate ? format(new Date(project.startDate), "MMM d") : "No Date"} 
                        {" - "} 
                        {project.endDate ? format(new Date(project.endDate), "MMM d") : "No Date"}
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <CheckCircle2 className="h-3.5 w-3.5" />
                      <span>{completed}/{projectTasks.length} Tasks</span>
                    </div>
                  </div>

                  <div className="flex flex-col gap-2">
                    <div className="flex items-center justify-between text-xs font-medium">
                      <span className="text-muted-foreground">Progress</span>
                      <span className="text-foreground">{progress}%</span>
                    </div>
                    <div className="h-1.5 w-full overflow-hidden rounded-full bg-secondary">
                      <div
                        className="h-full bg-primary rounded-full transition-all duration-500 ease-in-out"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}

      <ModalNewProject
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
}
