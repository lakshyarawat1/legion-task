"use client";

import React, { useState } from "react";
import { useGetTasksQuery } from "@/state/api";
import { CalendarDays } from "lucide-react";
import EmptyState from "@/app/(components)/EmptyState/EmptyState";
import { Gantt, Task as GanttTask, ViewMode } from "gantt-task-react";
import "gantt-task-react/dist/index.css";
import { useTheme } from "next-themes";
import { format } from "date-fns";

const TimelineView = ({ projectId }: { projectId: string }) => {
  const { data: tasks, isLoading, error } = useGetTasksQuery({ projectId });
  const [viewMode, setViewMode] = useState<ViewMode>(ViewMode.Month);
  const { resolvedTheme } = useTheme();
  
  const isDark = resolvedTheme === "dark";

  if (isLoading) {
    return (
      <div className="flex h-full w-full flex-col gap-4">
        <div className="h-10 w-48 animate-pulse rounded bg-secondary" />
        <div className="h-[500px] w-full animate-pulse rounded-2xl bg-secondary" />
      </div>
    );
  }

  if (error) {
    return <div className="p-8 text-destructive bg-red-100 dark:bg-red-900/30 rounded-xl">An error occurred while fetching tasks.</div>;
  }

  const isValidDate = (dateString?: string) => {
    if (!dateString) return false;
    const date = new Date(dateString);
    return !isNaN(date.getTime());
  };

  const validTasks = tasks?.filter((t) => isValidDate(t.startDate) && isValidDate(t.dueDate)) || [];

  if (validTasks.length === 0) {
    return (
      <EmptyState
        icon={CalendarDays}
        title="No timeline data available"
        description="Tasks need both a start date and a due date to appear on the timeline."
        className="mt-12 rounded-2xl border border-border bg-card p-12"
      />
    );
  }

  const getProgress = (status?: string) => {
    switch (status) {
      case "Completed": return 100;
      case "Under Review": return 75;
      case "Work In Progress": return 50;
      default: return 0;
    }
  };

  const getColor = (status?: string) => {
    if (isDark) {
      switch (status) {
        case "Completed": return { bg: "#059669", sel: "#047857" };
        case "Under Review": return { bg: "#7C3AED", sel: "#6D28D9" };
        case "Work In Progress": return { bg: "#D97706", sel: "#B45309" };
        default: return { bg: "#2563EB", sel: "#1D4ED8" };
      }
    }
    switch (status) {
      case "Completed": return { bg: "#10B981", sel: "#059669" };
      case "Under Review": return { bg: "#8B5CF6", sel: "#7C3AED" };
      case "Work In Progress": return { bg: "#F59E0B", sel: "#D97706" };
      default: return { bg: "#3B82F6", sel: "#2563EB" };
    }
  };

  const ganttTasks: GanttTask[] = validTasks.map((task) => {
    const colors = getColor(task.status);
    return {
      id: String(task.id),
      type: "task",
      name: task.title,
      start: new Date(task.startDate!),
      end: new Date(task.dueDate!),
      progress: getProgress(task.status),
      isDisabled: true,
      styles: {
        progressColor: colors.bg,
        progressSelectedColor: colors.sel,
        backgroundColor: isDark ? "#3f3f46" : "#e4e4e7",
        backgroundSelectedColor: isDark ? "#52525b" : "#d4d4d8",
      }
    };
  });

  return (
    <div className="flex flex-col h-full w-full gap-4">
      <div className="flex items-center justify-end gap-2 rounded-xl bg-secondary p-1 w-fit ml-auto">
        <button
          onClick={() => setViewMode(ViewMode.Day)}
          className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
            viewMode === ViewMode.Day ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
          }`}
        >
          Day
        </button>
        <button
          onClick={() => setViewMode(ViewMode.Week)}
          className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
            viewMode === ViewMode.Week ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
          }`}
        >
          Week
        </button>
        <button
          onClick={() => setViewMode(ViewMode.Month)}
          className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
            viewMode === ViewMode.Month ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
          }`}
        >
          Month
        </button>
      </div>

      <div className="rounded-2xl border border-border bg-card shadow-sm overflow-hidden flex-1 min-h-[500px]">
        <div className="overflow-x-auto p-4 w-full h-full gantt-wrapper">
          <Gantt
            tasks={ganttTasks}
            viewMode={viewMode}
            listCellWidth="150px"
            columnWidth={viewMode === ViewMode.Month ? 150 : viewMode === ViewMode.Week ? 250 : 60}
            barCornerRadius={8}
            fontFamily="inherit"
            fontSize="12px"
            rowHeight={50}
            TooltipContent={({ task }) => (
              <div className="relative rounded-xl border border-border bg-card/90 backdrop-blur-xl p-4 shadow-xl z-[100] min-w-[200px]">
                <h4 className="font-bold text-foreground text-sm mb-1">{task.name}</h4>
                <div className="flex justify-between items-center text-xs text-muted-foreground mb-2">
                  <span>{format(task.start, "MMM d")} - {format(task.end, "MMM d")}</span>
                  <span className="font-medium text-primary bg-primary/10 px-2 py-0.5 rounded-full">
                    {Math.round(task.progress)}%
                  </span>
                </div>
              </div>
            )}
          />
        </div>
      </div>
    </div>
  );
};

export default TimelineView;
