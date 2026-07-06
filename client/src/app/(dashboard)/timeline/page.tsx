"use client";

import React, { useState } from "react";
import { useGetProjectsQuery, useGetTasksQuery } from "@/state/api";
import { CalendarDays } from "lucide-react";
import EmptyState from "@/app/(components)/EmptyState/EmptyState";
import { Gantt, Task as GanttTask, ViewMode } from "gantt-task-react";
import "gantt-task-react/dist/index.css";
import { format } from "date-fns";

export default function TimelinePage() {
  const { data: projects, isLoading: isProjectsLoading } = useGetProjectsQuery();
  const { data: tasks, isLoading: isTasksLoading } = useGetTasksQuery({});
  const [viewMode, setViewMode] = useState<ViewMode>(ViewMode.Month);

  if (isProjectsLoading || isTasksLoading) {
    return (
      <div className="flex h-full w-full flex-col p-8 gap-4">
        <div className="h-10 w-48 animate-pulse rounded bg-secondary" />
        <div className="h-[500px] w-full animate-pulse rounded-2xl bg-secondary" />
      </div>
    );
  }

  // Generate Gantt tasks for projects
  const ganttTasks: GanttTask[] = (projects || [])
    .filter((project) => project.startDate && project.endDate)
    .map((project) => {
      // Calculate progress based on tasks for this project
      const projectTasks = tasks?.filter((t) => t.projectId === project.id) || [];
      const totalTasks = projectTasks.length;
      const completedTasks = projectTasks.filter((t) => t.status === "Completed").length;
      
      const progress = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;
      
      return {
        id: `Project-${project.id}`,
        type: "project",
        name: project.name,
        start: new Date(project.startDate!),
        end: new Date(project.endDate!),
        progress,
        isDisabled: true, // Read-only for global timeline
        styles: {
          progressColor: "#3B82F6", // blue-500
          progressSelectedColor: "#2563EB", // blue-600
        }
      };
    });

  return (
    <div className="flex h-full w-full flex-col p-8 max-w-7xl mx-auto">
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <div className="rounded-xl bg-primary/10 p-2">
              <CalendarDays className="h-6 w-6 text-primary" />
            </div>
            Global Timeline
          </h1>
          <p className="text-muted-foreground mt-1">High-level view of all project schedules.</p>
        </div>

        <div className="flex items-center gap-2 rounded-xl bg-secondary p-1 w-fit">
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
        {ganttTasks.length === 0 ? (
          <EmptyState
            icon={CalendarDays}
            title="No timeline data available"
            description="Projects need both a start date and an end date to appear on the timeline."
            className="h-[400px]"
          />
        ) : (
          <div className="overflow-x-auto p-4 w-full h-full gantt-wrapper">
            <Gantt
              tasks={ganttTasks}
              viewMode={viewMode}
              listCellWidth="150px"
              columnWidth={viewMode === ViewMode.Month ? 150 : viewMode === ViewMode.Week ? 250 : 60}
              barCornerRadius={8}
              fontFamily="inherit"
              fontSize="12px"
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
        )}
      </div>
    </div>
  );
}
