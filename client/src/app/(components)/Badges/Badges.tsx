"use client";

import React from "react";
import { cn } from "@/lib/utils";

const statusConfig: Record<string, { label: string; className: string }> = {
  "To Do": {
    label: "To Do",
    className: "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300",
  },
  "Work In Progress": {
    label: "In Progress",
    className: "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300",
  },
  "Under Review": {
    label: "Under Review",
    className: "bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300",
  },
  Completed: {
    label: "Completed",
    className: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300",
  },
};

export const StatusBadge = ({ status }: { status?: string }) => {
  const config = statusConfig[status || ""] || {
    label: status || "Unknown",
    className: "bg-secondary text-muted-foreground",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold",
        config.className
      )}
    >
      {config.label}
    </span>
  );
};

const priorityConfig: Record<string, { className: string }> = {
  Urgent: {
    className: "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300",
  },
  High: {
    className: "bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-300",
  },
  Medium: {
    className: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-300",
  },
  Low: {
    className: "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300",
  },
  Backlog: {
    className: "bg-gray-100 text-gray-600 dark:bg-gray-800/40 dark:text-gray-400",
  },
};

export const PriorityBadge = ({ priority }: { priority?: string }) => {
  const config = priorityConfig[priority || ""] || {
    className: "bg-secondary text-muted-foreground",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold",
        config.className
      )}
    >
      {priority || "None"}
    </span>
  );
};
