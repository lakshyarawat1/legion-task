"use client";

import React, { useState } from "react";
import { useGetTasksQuery } from "@/state/api";
import { ChevronDown, ChevronUp, Calendar } from "lucide-react";
import { PriorityBadge } from "@/app/(components)/Badges/Badges";
import EmptyState from "@/app/(components)/EmptyState/EmptyState";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { getAvatarColor } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

const statusGroups = [
  { id: "To Do", color: "bg-blue-500" },
  { id: "Work In Progress", color: "bg-amber-500" },
  { id: "Under Review", color: "bg-purple-500" },
  { id: "Completed", color: "bg-emerald-500" },
];

const ListView = ({ projectId }: { projectId: string }) => {
  const router = useRouter();
  const { data: tasks, isLoading, error } = useGetTasksQuery({ projectId });
  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>({
    "To Do": true,
    "Work In Progress": true,
    "Under Review": true,
    "Completed": true,
  });

  const toggleGroup = (status: string) => {
    setExpandedGroups((prev) => ({
      ...prev,
      [status]: !prev[status],
    }));
  };

  if (isLoading) {
    return (
      <div className="flex flex-col gap-6 w-full">
        {[1, 2, 3].map((i) => (
          <div key={i} className="flex flex-col gap-3">
            <div className="h-10 w-full animate-pulse rounded-xl bg-secondary" />
            <div className="h-24 w-full animate-pulse rounded-xl bg-secondary/50" />
            <div className="h-24 w-full animate-pulse rounded-xl bg-secondary/50" />
          </div>
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

  return (
    <div className="flex flex-col gap-6 h-full w-full overflow-y-auto pr-2 pb-8">
      {statusGroups.map((group) => {
        const groupTasks = tasks.filter((t) => t.status === group.id);
        if (groupTasks.length === 0) return null;
        
        const isExpanded = expandedGroups[group.id];

        return (
          <div key={group.id} className="flex flex-col rounded-2xl border border-border bg-card shadow-sm overflow-hidden">
            <button
              onClick={() => toggleGroup(group.id)}
              className="flex items-center justify-between bg-secondary/50 p-4 hover:bg-secondary/70 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className={cn("h-3 w-3 rounded-full", group.color)} />
                <h3 className="font-bold text-foreground">{group.id}</h3>
                <span className="rounded-full bg-secondary px-2 py-0.5 text-xs font-semibold text-muted-foreground border border-border">
                  {groupTasks.length}
                </span>
              </div>
              {isExpanded ? (
                <ChevronUp className="h-5 w-5 text-muted-foreground" />
              ) : (
                <ChevronDown className="h-5 w-5 text-muted-foreground" />
              )}
            </button>
            
            {isExpanded && (
              <div className="flex flex-col divide-y divide-border">
                {groupTasks.map((task) => (
                  <motion.div 
                    layoutId={`task-card-${task.id}`}
                    key={task.id} 
                    onClick={() => {
                      const url = new URL(window.location.href);
                      url.searchParams.set("taskId", task.id.toString());
                      router.push(url.pathname + url.search, { scroll: false });
                    }}
                    className="flex flex-col sm:flex-row sm:items-center justify-between p-4 transition-colors hover:bg-secondary/50 cursor-pointer"
                  >
                    <div className="flex flex-col gap-2">
                      <div className="flex items-center gap-3">
                        <span className="font-semibold text-foreground text-base">{task.title}</span>
                        <PriorityBadge priority={task.priority} />
                        {task.points !== undefined && (
                          <span className="rounded-md bg-secondary px-1.5 py-0.5 text-xs font-mono font-medium text-muted-foreground border border-border">
                            {task.points} pts
                          </span>
                        )}
                      </div>
                      {task.tags && (
                        <div className="flex items-center gap-1.5 mt-1">
                          {task.tags.split(",").map((tag) => (
                            <span key={tag} className="text-xs bg-secondary/70 text-muted-foreground px-2 py-0.5 rounded-full border border-border/50">
                              {tag.trim()}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                    
                    <div className="flex items-center gap-6 mt-4 sm:mt-0">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground min-w-[120px]">
                        <Calendar className="h-4 w-4" />
                        {task.dueDate ? format(new Date(task.dueDate), "MMM d, yyyy") : "No date"}
                      </div>
                      
                      <div className="flex items-center gap-2 min-w-[140px]">
                        {task.assignee ? (
                          <>
                            <div className={cn("flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold text-white", getAvatarColor(task.assignee.username))}>
                              {task.assignee.username.charAt(0).toUpperCase()}
                            </div>
                            <span className="text-sm font-medium text-foreground">{task.assignee.username}</span>
                          </>
                        ) : (
                          <span className="text-sm text-muted-foreground italic">Unassigned</span>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default ListView;
