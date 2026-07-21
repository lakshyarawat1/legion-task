"use client";

import React from "react";
import { useGetTasksQuery } from "@/state/api";
import { AlertCircle, AlertOctagon, AlertTriangle, Layers3, ShieldAlert } from "lucide-react";
import Link from "next/link";
import { StatusBadge, PriorityBadge } from "@/app/(components)/Badges/Badges";
import EmptyState from "@/app/(components)/EmptyState/EmptyState";
import { format } from "date-fns";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

interface PriorityPageProps {
  priority: string;
}

export default function PriorityPage({ priority }: PriorityPageProps) {
  const router = useRouter();
  const { data: tasks, isLoading, isError } = useGetTasksQuery({ priority });

  const getPriorityConfig = () => {
    switch (priority) {
      case "Urgent":
        return { icon: AlertCircle, color: "text-red-500", bg: "bg-red-500/10" };
      case "High":
        return { icon: ShieldAlert, color: "text-orange-500", bg: "bg-orange-500/10" };
      case "Medium":
        return { icon: AlertTriangle, color: "text-yellow-500", bg: "bg-yellow-500/10" };
      case "Low":
        return { icon: AlertOctagon, color: "text-blue-500", bg: "bg-blue-500/10" };
      case "Backlog":
        return { icon: Layers3, color: "text-gray-500", bg: "bg-gray-500/10" };
      default:
        return { icon: AlertCircle, color: "text-primary", bg: "bg-primary/10" };
    }
  };

  const config = getPriorityConfig();
  const Icon = config.icon;

  return (
    <div className="flex h-full w-full flex-col p-8 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
          <div className={`rounded-xl p-2 ${config.bg}`}>
            <Icon className={`h-6 w-6 ${config.color}`} />
          </div>
          {priority} Priority
          {tasks && (
            <span className="ml-2 rounded-full bg-secondary px-2.5 py-0.5 text-sm font-semibold text-muted-foreground">
              {tasks.length}
            </span>
          )}
        </h1>
        <p className="text-muted-foreground mt-1">All tasks marked with {priority.toLowerCase()} priority across projects.</p>
      </div>

      <div className="rounded-2xl border border-border bg-card shadow-sm overflow-hidden">
        {isLoading ? (
          <div className="w-full">
            <div className="h-10 bg-secondary/50 border-b border-border" />
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="h-16 border-b border-border bg-card animate-pulse" />
            ))}
          </div>
        ) : isError ? (
          <div className="p-8 text-destructive bg-red-100 dark:bg-red-900/30">
            Error loading tasks. Please try again.
          </div>
        ) : !tasks || tasks.length === 0 ? (
          <EmptyState
            icon={Icon}
            title={`No ${priority.toLowerCase()} priority tasks`}
            description="You're all caught up on this priority level."
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[800px] text-left text-sm">
              <thead className="bg-secondary/50 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                <tr>
                  <th className="px-6 py-3 border-b border-border">Task Name</th>
                  <th className="px-6 py-3 border-b border-border">Project</th>
                  <th className="px-6 py-3 border-b border-border">Status</th>
                  <th className="px-6 py-3 border-b border-border">Assignee</th>
                  <th className="px-6 py-3 border-b border-border">Due Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {tasks.map((task) => (
                  <motion.tr 
                    layoutId={`task-card-${task.id}`}
                    key={task.id} 
                    className="transition-colors hover:bg-secondary/50 group"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div 
                        onClick={() => {
                          const url = new URL(window.location.href);
                          url.searchParams.set("taskId", task.id.toString());
                          router.push(url.pathname + url.search, { scroll: false });
                        }}
                        className="font-semibold text-foreground group-hover:text-primary transition-colors cursor-pointer"
                      >
                        {task.title}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-muted-foreground">
                      {task.project?.name || "Unknown"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <StatusBadge status={task.status} />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-muted-foreground">
                      {task.assignee?.username || "Unassigned"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-muted-foreground">
                      {task.dueDate ? format(new Date(task.dueDate), "MMM d, yyyy") : "No date"}
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
