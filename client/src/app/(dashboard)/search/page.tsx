"use client";

import React, { useState, useEffect } from "react";
import { Search as SearchIcon } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useSearchQuery } from "@/state/api";
import EmptyState from "@/app/(components)/EmptyState/EmptyState";
import { StatusBadge, PriorityBadge } from "@/app/(components)/Badges/Badges";
import Link from "next/link";

export default function SearchPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchTerm);
    }, 300);

    return () => {
      clearTimeout(handler);
    };
  }, [searchTerm]);

  const { data: searchResults, isLoading, isError } = useSearchQuery(
    { query: debouncedSearch },
    { skip: !debouncedSearch || debouncedSearch.length < 2 }
  );

  return (
    <div className="flex h-full w-full flex-col p-8">
      <div className="mb-8 relative max-w-2xl mx-auto w-full">
        <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
        <Input
          type="text"
          placeholder="Search across tasks, projects, and users..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-12 h-14 rounded-2xl border-border bg-card text-lg shadow-sm focus-visible:ring-primary"
        />
      </div>

      {!debouncedSearch || debouncedSearch.length < 2 ? (
        <EmptyState
          icon={SearchIcon}
          title="Search LegionTask"
          description="Type at least 2 characters to search across tasks, projects, and users."
        />
      ) : isLoading ? (
        <div className="flex flex-col gap-8">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex flex-col gap-4">
              <div className="h-6 w-32 animate-pulse rounded bg-secondary" />
              <div className="flex flex-col gap-3">
                <div className="h-20 w-full animate-pulse rounded-xl bg-secondary" />
                <div className="h-20 w-full animate-pulse rounded-xl bg-secondary" />
              </div>
            </div>
          ))}
        </div>
      ) : isError ? (
        <div className="text-destructive p-4 rounded-xl bg-red-100 dark:bg-red-900/30">
          An error occurred while fetching search results.
        </div>
      ) : !searchResults?.tasks.length &&
        !searchResults?.projects.length &&
        !searchResults?.users.length ? (
        <EmptyState
          title={`No results found for "${debouncedSearch}"`}
          description="Try checking for typos or using more general terms."
        />
      ) : (
        <div className="flex flex-col gap-10">
          {searchResults.tasks && searchResults.tasks.length > 0 && (
            <section>
              <div className="mb-4 flex items-center gap-2">
                <h2 className="text-xl font-bold text-foreground">Tasks</h2>
                <span className="rounded-full bg-secondary px-2.5 py-0.5 text-xs font-semibold text-muted-foreground">
                  {searchResults.tasks.length}
                </span>
              </div>
              <div className="flex flex-col gap-3">
                {searchResults.tasks.map((task) => (
                  <Link
                    key={task.id}
                    href={`/projects/${task.projectId}`}
                    className="flex flex-col gap-2 rounded-xl border border-border bg-card p-4 shadow-sm transition-all hover:bg-secondary/50 hover:shadow-md sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div>
                      <h3 className="font-semibold text-foreground">{task.title}</h3>
                      <p className="text-sm text-muted-foreground mt-1">
                        Project: {task.project?.name || "Unknown"} • Assignee: {task.assignee?.username || "Unassigned"}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 mt-2 sm:mt-0">
                      <PriorityBadge priority={task.priority} />
                      <StatusBadge status={task.status} />
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          )}

          {searchResults.projects && searchResults.projects.length > 0 && (
            <section>
              <div className="mb-4 flex items-center gap-2">
                <h2 className="text-xl font-bold text-foreground">Projects</h2>
                <span className="rounded-full bg-secondary px-2.5 py-0.5 text-xs font-semibold text-muted-foreground">
                  {searchResults.projects.length}
                </span>
              </div>
              <div className="flex flex-col gap-3">
                {searchResults.projects.map((project) => (
                  <Link
                    key={project.id}
                    href={`/projects/${project.id}`}
                    className="flex flex-col gap-2 rounded-xl border border-border bg-card p-4 shadow-sm transition-all hover:bg-secondary/50 hover:shadow-md"
                  >
                    <h3 className="font-semibold text-foreground">{project.name}</h3>
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {project.description || "No description"}
                    </p>
                    <div className="text-xs text-muted-foreground mt-2">
                      {project.startDate ? new Date(project.startDate).toLocaleDateString() : "N/A"} -{" "}
                      {project.endDate ? new Date(project.endDate).toLocaleDateString() : "N/A"}
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          )}

          {searchResults.users && searchResults.users.length > 0 && (
            <section>
              <div className="mb-4 flex items-center gap-2">
                <h2 className="text-xl font-bold text-foreground">Users</h2>
                <span className="rounded-full bg-secondary px-2.5 py-0.5 text-xs font-semibold text-muted-foreground">
                  {searchResults.users.length}
                </span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {searchResults.users.map((user) => (
                  <div
                    key={user.userId}
                    className="flex items-center gap-4 rounded-xl border border-border bg-card p-4 shadow-sm"
                  >
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-lg font-semibold text-primary">
                      {user.username.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground">{user.username}</h3>
                      <p className="text-sm text-muted-foreground">
                        {user.team?.teamName || "No Team"}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>
      )}
    </div>
  );
}
