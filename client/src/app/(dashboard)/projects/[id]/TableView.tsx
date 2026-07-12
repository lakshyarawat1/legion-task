"use client";

import React, { useState } from "react";
import { useGetTasksQuery, Task } from "@/state/api";
import { ChevronDown, ChevronUp, ArrowUpDown } from "lucide-react";
import { StatusBadge, PriorityBadge } from "@/app/(components)/Badges/Badges";
import EmptyState from "@/app/(components)/EmptyState/EmptyState";
import { format } from "date-fns";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

type SortField = keyof Task | "assigneeName";
type SortDirection = "asc" | "desc";

const TableView = ({ projectId }: { projectId: string }) => {
  const router = useRouter();
  const { data: tasks, isLoading, error } = useGetTasksQuery({ projectId });
  const [sortField, setSortField] = useState<SortField>("dueDate");
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc");

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  if (isLoading) {
    return (
      <div className="w-full rounded-2xl border border-border bg-card overflow-hidden">
        <div className="h-12 bg-secondary/50 border-b border-border" />
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="h-16 border-b border-border bg-card animate-pulse" />
        ))}
      </div>
    );
  }

  if (error) {
    return <div className="p-8 text-destructive bg-red-100 dark:bg-red-900/30 rounded-xl">An error occurred while fetching tasks.</div>;
  }

  if (!tasks || tasks.length === 0) {
    return (
      <EmptyState
        title="No tasks found"
        description="Get started by creating a new task for this project."
        className="mt-12"
      />
    );
  }

  const sortedTasks = [...tasks].sort((a, b) => {
    let aVal: unknown = a[sortField as keyof Task];
    let bVal: unknown = b[sortField as keyof Task];

    if (sortField === "assigneeName") {
      aVal = a.assignee?.username || "";
      bVal = b.assignee?.username || "";
    } else if (sortField === "dueDate" || sortField === "startDate") {
      aVal = aVal ? new Date(aVal as string).getTime() : 0;
      bVal = bVal ? new Date(bVal as string).getTime() : 0;
    } else if (sortField === "points") {
      aVal = aVal !== null && aVal !== undefined ? Number(aVal) : -Infinity;
      bVal = bVal !== null && bVal !== undefined ? Number(bVal) : -Infinity;
    } else {
      aVal = aVal !== null && aVal !== undefined ? String(aVal).toLowerCase() : "";
      bVal = bVal !== null && bVal !== undefined ? String(bVal).toLowerCase() : "";
    }

    if (aVal < bVal) return sortDirection === "asc" ? -1 : 1;
    if (aVal > bVal) return sortDirection === "asc" ? 1 : -1;
    return 0;
  });

  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortField !== field) return <ArrowUpDown className="ml-1 h-3 w-3 opacity-30 hover:opacity-100 transition-opacity" />;
    return sortDirection === "asc" ? 
      <ChevronUp className="ml-1 h-4 w-4 text-primary" /> : 
      <ChevronDown className="ml-1 h-4 w-4 text-primary" />;
  };

  const thClass = "px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground cursor-pointer hover:bg-secondary transition-colors select-none";

  return (
    <div className="rounded-2xl border border-border bg-card shadow-sm overflow-hidden h-full flex flex-col">
      <div className="overflow-x-auto flex-1">
        <table className="w-full min-w-[800px] text-sm">
          <thead className="bg-secondary/50 sticky top-0 z-10 border-b border-border backdrop-blur-sm">
            <tr>
              <th className={thClass} onClick={() => handleSort("title")}>
                <div className="flex items-center">Title <SortIcon field="title" /></div>
              </th>
              <th className={thClass} onClick={() => handleSort("status")}>
                <div className="flex items-center">Status <SortIcon field="status" /></div>
              </th>
              <th className={thClass} onClick={() => handleSort("priority")}>
                <div className="flex items-center">Priority <SortIcon field="priority" /></div>
              </th>
              <th className={thClass} onClick={() => handleSort("assigneeName")}>
                <div className="flex items-center">Assignee <SortIcon field="assigneeName" /></div>
              </th>
              <th className={thClass} onClick={() => handleSort("dueDate")}>
                <div className="flex items-center">Due Date <SortIcon field="dueDate" /></div>
              </th>
              <th className={thClass} onClick={() => handleSort("points")}>
                <div className="flex items-center">Points <SortIcon field="points" /></div>
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Tags
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border bg-card">
            {sortedTasks.map((task) => (
              <motion.tr 
                layoutId={`task-card-${task.id}`}
                key={task.id} 
                onClick={() => {
                  const url = new URL(window.location.href);
                  url.searchParams.set("taskId", task.id.toString());
                  router.push(url.pathname + url.search, { scroll: false });
                }}
                className="transition-colors hover:bg-secondary/40 cursor-pointer"
              >
                <td className="px-6 py-4 whitespace-nowrap font-semibold text-foreground">
                  {task.title}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <StatusBadge status={task.status} />
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <PriorityBadge priority={task.priority} />
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-muted-foreground font-medium">
                  {task.assignee?.username || <span className="italic opacity-50">Unassigned</span>}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-muted-foreground">
                  {task.dueDate ? format(new Date(task.dueDate), "MMM d, yyyy") : "-"}
                </td>
                <td className="px-6 py-4 whitespace-nowrap font-mono text-muted-foreground">
                  {task.points !== undefined ? task.points : "-"}
                </td>
                <td className="px-6 py-4">
                  {task.tags ? (
                    <div className="flex flex-wrap gap-1 max-w-[200px]">
                      {task.tags.split(",").slice(0, 2).map((tag) => (
                        <span key={tag} className="text-[10px] bg-secondary/80 text-muted-foreground px-1.5 py-0.5 rounded border border-border/50 truncate max-w-[80px]">
                          {tag.trim()}
                        </span>
                      ))}
                      {task.tags.split(",").length > 2 && (
                        <span className="text-[10px] bg-secondary/80 text-muted-foreground px-1.5 py-0.5 rounded border border-border/50">
                          +{task.tags.split(",").length - 2}
                        </span>
                      )}
                    </div>
                  ) : (
                    <span className="text-muted-foreground">-</span>
                  )}
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TableView;
