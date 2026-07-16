"use client";

import React, { useState } from "react";
import { useGetTasksQuery, useGetProjectByIdQuery } from "@/state/api";
import { CalendarDays } from "lucide-react";
import EmptyState from "@/app/(components)/EmptyState/EmptyState";
import { Gantt, Task as GanttTask, ViewMode } from "gantt-task-react";
import "gantt-task-react/dist/index.css";
import { useTheme } from "next-themes";
import { format } from "date-fns";
import TimelineFilters from "../../timeline/TimelineFilters";

const TimelineView = ({ projectId }: { projectId: string }) => {
  const { data: project, isLoading: isProjectLoading } = useGetProjectByIdQuery({ id: projectId });
  const { data: tasks, isLoading: isTasksLoading, error } = useGetTasksQuery({ projectId });
  const [viewMode, setViewMode] = useState<ViewMode>(ViewMode.Month);
  const [hiddenProjects, setHiddenProjects] = useState<Record<string, boolean>>({});
  const { resolvedTheme } = useTheme();
  
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [priorityFilter, setPriorityFilter] = useState("All");
  
  const isDark = resolvedTheme === "dark";

  if (isProjectLoading || isTasksLoading) {
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

  // Filter tasks based on filters state
  const filteredTasks = validTasks.filter((task) => {
    if (statusFilter !== "All" && task.status !== statusFilter) return false;
    if (priorityFilter !== "All" && task.priority !== priorityFilter) return false;
    if (searchQuery && !task.title.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  const getProgress = (status?: string) => {
    switch (status) {
      case "Completed": return 100;
      case "Under Review": return 75;
      case "Work In Progress": return 50;
      default: return 0;
    }
  };

  // Priority color mapping based on theme (representing criticality)
  const getPriorityColor = (priority?: string) => {
    if (isDark) {
      switch (priority) {
        case "Urgent": return { bg: "#dc2626", sel: "#b91c1c" }; // Red
        case "High": return { bg: "#ea580c", sel: "#c2410c" }; // Orange
        case "Medium": return { bg: "#d97706", sel: "#b45309" }; // Amber/Yellow
        case "Low": return { bg: "#2563eb", sel: "#1d4ed8" }; // Blue
        case "Backlog": return { bg: "#4b5563", sel: "#374151" }; // Gray
        default: return { bg: "#2563eb", sel: "#1d4ed8" };
      }
    }
    switch (priority) {
      case "Urgent": return { bg: "#ef4444", sel: "#dc2626" };
      case "High": return { bg: "#f97316", sel: "#ea580c" };
      case "Medium": return { bg: "#f59e0b", sel: "#d97706" };
      case "Low": return { bg: "#3b82f6", sel: "#2563eb" };
      case "Backlog": return { bg: "#6b7280", sel: "#4b5563" };
      default: return { bg: "#3b82f6", sel: "#2563eb" };
    }
  };

  const ganttTasks: GanttTask[] = [];

  if (project && project.startDate && project.endDate) {
    const projectMatchesSearch = !searchQuery || project.name.toLowerCase().includes(searchQuery.toLowerCase());
    
    // If the project matches the search or we have matching tasks, render the hierarchical view
    if (projectMatchesSearch || filteredTasks.length > 0) {
      const totalTasks = validTasks.length;
      const completedTasks = validTasks.filter((t) => t.status === "Completed").length;
      const progress = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;
      const projectGanttId = `Project-${project.id}`;

      // Add the Project Task
      ganttTasks.push({
        id: projectGanttId,
        type: "project",
        name: project.name,
        start: new Date(project.startDate),
        end: new Date(project.endDate),
        progress,
        hideChildren: hiddenProjects[projectGanttId] ?? false,
        isDisabled: true,
        priority: "Project",
        status: progress === 100 ? "Completed" : "Active",
        styles: {
          progressColor: "#0275ff", // Brand Accent (blue-primary)
          progressSelectedColor: "#3b82f6",
          backgroundColor: isDark ? "#2d3135" : "#e5e7eb",
          backgroundSelectedColor: isDark ? "#3b3d40" : "#d1d5db",
        }
      } as any);

      // Add the individual Tasks under this project
      filteredTasks.forEach((task) => {
        const colors = getPriorityColor(task.priority);
        ganttTasks.push({
          id: `Task-${task.id}`,
          type: "task",
          project: projectGanttId,
          name: task.title,
          start: new Date(task.startDate!),
          end: new Date(task.dueDate!),
          progress: getProgress(task.status),
          isDisabled: true,
          priority: task.priority,
          status: task.status,
          styles: {
            progressColor: colors.bg,
            progressSelectedColor: colors.sel,
            backgroundColor: isDark ? "#1d1f21" : "#f3f4f6",
            backgroundSelectedColor: isDark ? "#2d3135" : "#e5e7eb",
          }
        } as any);
      });
    }
  } else {
    // Fallback: If no project dates, map tasks flatly
    filteredTasks.forEach((task) => {
      const colors = getPriorityColor(task.priority);
      ganttTasks.push({
        id: `Task-${task.id}`,
        type: "task",
        name: task.title,
        start: new Date(task.startDate!),
        end: new Date(task.dueDate!),
        progress: getProgress(task.status),
        isDisabled: true,
        priority: task.priority,
        status: task.status,
        styles: {
          progressColor: colors.bg,
          progressSelectedColor: colors.sel,
          backgroundColor: isDark ? "#1d1f21" : "#f3f4f6",
          backgroundSelectedColor: isDark ? "#2d3135" : "#e5e7eb",
        }
      } as any);
    });
  }

  const hasNoValidTasks = validTasks.length === 0;

  return (
    <div className="flex flex-col h-full w-full gap-4">
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        <TimelineFilters
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          statusFilter={statusFilter}
          setStatusFilter={setStatusFilter}
          priorityFilter={priorityFilter}
          setPriorityFilter={setPriorityFilter}
        />
        
        <div className="flex items-center gap-2 rounded-xl bg-secondary p-1 w-fit md:ml-auto">
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
      </div>

      <div className="rounded-2xl border border-border bg-card shadow-sm overflow-hidden flex-1 min-h-[500px]">
        {hasNoValidTasks ? (
          <EmptyState
            icon={CalendarDays}
            title="No timeline data available"
            description="Tasks need both a start date and a due date to appear on the timeline."
            className="h-[400px]"
          />
        ) : ganttTasks.length === 0 ? (
          <EmptyState
            icon={CalendarDays}
            title="No matching tasks"
            description="Try adjusting your filters or search query."
            className="h-[400px]"
          />
        ) : (
          <div className="overflow-x-auto p-4 w-full h-full gantt-wrapper">
            <Gantt
              tasks={ganttTasks}
              viewMode={viewMode}
              onExpanderClick={(task) => setHiddenProjects(prev => ({ ...prev, [task.id]: !prev[task.id] }))}
              listCellWidth="150px"
              columnWidth={viewMode === ViewMode.Month ? 150 : viewMode === ViewMode.Week ? 250 : 60}
              barCornerRadius={8}
              fontFamily="inherit"
              fontSize="12px"
              rowHeight={50}
              todayColor={isDark ? "rgba(2, 117, 255, 0.15)" : "rgba(59, 130, 246, 0.15)"}
              arrowColor={isDark ? "#2d3135" : "#e5e7eb"}
              barBackgroundColor={isDark ? "#1d1f21" : "#f3f4f6"}
              barBackgroundSelectedColor={isDark ? "#2d3135" : "#e5e7eb"}
              projectBackgroundColor={isDark ? "#1d1f21" : "#f3f4f6"}
              projectProgressColor={isDark ? "#0275ff" : "#3b82f6"}
              projectProgressSelectedColor={isDark ? "#3b82f6" : "#2563eb"}
              TooltipContent={({ task }: any) => (
                <div className="relative rounded-xl border border-border bg-card/90 backdrop-blur-xl p-4 shadow-xl z-[100] min-w-[220px]">
                  <div className="flex justify-between items-start gap-2 mb-2">
                    <h4 className="font-bold text-foreground text-sm line-clamp-2">{task.name}</h4>
                    {task.priority && (
                      <span className={`text-[10px] px-1.5 py-0.5 rounded-md font-semibold shrink-0 ${
                        task.priority === "Project" ? "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300" :
                        task.priority === "Urgent" ? "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300" :
                        task.priority === "High" ? "bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-300" :
                        task.priority === "Medium" ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-300" :
                        task.priority === "Low" ? "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300" :
                        "bg-gray-100 text-gray-700 dark:bg-gray-800/40 dark:text-gray-300"
                      }`}>
                        {task.priority}
                      </span>
                    )}
                  </div>
                  <div className="flex flex-col gap-1 text-xs text-muted-foreground">
                    <div className="flex justify-between">
                      <span>Timeline:</span>
                      <span className="font-medium text-foreground">{format(task.start, "MMM d")} - {format(task.end, "MMM d")}</span>
                    </div>
                    {task.status && (
                      <div className="flex justify-between">
                        <span>Status:</span>
                        <span className="font-medium text-foreground">{task.status}</span>
                      </div>
                    )}
                    <div className="flex justify-between mt-1 pt-1 border-t border-border/40">
                      <span>Progress:</span>
                      <span className="font-bold text-primary">
                        {Math.round(task.progress)}%
                      </span>
                    </div>
                  </div>
                </div>
              )}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default TimelineView;
