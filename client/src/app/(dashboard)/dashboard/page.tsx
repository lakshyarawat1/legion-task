"use client";

import React from "react";
import {
  useGetProjectsQuery,
  useGetTasksQuery,
} from "@/state/api";
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import {
  Briefcase,
  CheckCircle2,
  ListTodo,
  Layers,
} from "lucide-react";

const STATUS_COLORS = {
  "To Do": "#3B82F6",
  "Work In Progress": "#F59E0B",
  "Under Review": "#8B5CF6",
  Completed: "#10B981",
};

const PRIORITY_COLORS = {
  Urgent: "#EF4444",
  High: "#F97316",
  Medium: "#EAB308",
  Low: "#3B82F6",
  Backlog: "#6B7280",
};

export default function Home() {
  const { data: projects, isLoading: isProjectsLoading } = useGetProjectsQuery();
  const { data: tasks, isLoading: isTasksLoading } = useGetTasksQuery({});

  if (isProjectsLoading || isTasksLoading) {
    return (
      <div className="flex h-full w-full p-8 flex-col gap-6">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-28 w-full animate-pulse rounded-2xl bg-secondary" />
          ))}
        </div>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div className="h-80 w-full animate-pulse rounded-2xl bg-secondary" />
          <div className="h-80 w-full animate-pulse rounded-2xl bg-secondary" />
        </div>
      </div>
    );
  }

  const totalProjects = projects?.length || 0;
  const totalTasks = tasks?.length || 0;
  const completedTasks = tasks?.filter((t) => t.status === "Completed").length || 0;
  const todoTasks = tasks?.filter((t) => t.status === "To Do").length || 0;

  // Status chart data
  const statusCounts = tasks?.reduce((acc: Record<string, number>, task) => {
    acc[task.status || "To Do"] = (acc[task.status || "To Do"] || 0) + 1;
    return acc;
  }, {});

  const statusData = Object.keys(statusCounts || {}).map((key) => ({
    name: key,
    count: statusCounts[key],
    color: STATUS_COLORS[key as keyof typeof STATUS_COLORS] || "#cbd5e1",
  }));

  // Priority chart data
  const priorityCounts = tasks?.reduce((acc: Record<string, number>, task) => {
    acc[task.priority || "Medium"] = (acc[task.priority || "Medium"] || 0) + 1;
    return acc;
  }, {});

  const priorityData = Object.keys(priorityCounts || {}).map((key) => ({
    name: key,
    count: priorityCounts[key],
    color: PRIORITY_COLORS[key as keyof typeof PRIORITY_COLORS] || "#cbd5e1",
  }));

  const CustomTooltip = ({ active, payload }: { active?: boolean; payload?: any[] }) => {
    if (active && payload && payload.length) {
      return (
        <div className="rounded-xl border border-border bg-card p-3 shadow-lg">
          <p className="text-sm font-semibold text-foreground">{payload[0].name}</p>
          <p className="text-sm text-muted-foreground">
            Tasks: <span className="font-medium text-foreground">{payload[0].value}</span>
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="flex h-full w-full flex-col p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
        <p className="text-muted-foreground">Overview of your projects and tasks.</p>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4 mb-6">
        <MetricCard
          title="Total Projects"
          value={totalProjects}
          icon={<Briefcase className="h-6 w-6 text-blue-500" />}
          trend="All active"
        />
        <MetricCard
          title="Total Tasks"
          value={totalTasks}
          icon={<Layers className="h-6 w-6 text-purple-500" />}
          trend="Across all projects"
        />
        <MetricCard
          title="Completed Tasks"
          value={completedTasks}
          icon={<CheckCircle2 className="h-6 w-6 text-emerald-500" />}
          trend={`${Math.round((completedTasks / (totalTasks || 1)) * 100)}% completion`}
        />
        <MetricCard
          title="To Do Tasks"
          value={todoTasks}
          icon={<ListTodo className="h-6 w-6 text-orange-500" />}
          trend="Needs attention"
        />
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 mb-6">
        <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
          <h2 className="mb-4 text-lg font-semibold text-foreground">Task Status Distribution</h2>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  innerRadius={70}
                  outerRadius={100}
                  paddingAngle={2}
                  dataKey="count"
                >
                  {statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
                <Legend verticalAlign="bottom" height={36} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
          <h2 className="mb-4 text-lg font-semibold text-foreground">Task Priority Breakdown</h2>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={priorityData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `${value}`} />
                <Tooltip content={<CustomTooltip />} cursor={{ fill: 'var(--color-secondary)' }} />
                <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                  {priorityData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div>
        <h2 className="mb-4 text-xl font-bold text-foreground">Your Projects</h2>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
          {projects?.map((project) => (
            <div key={project.id} className="rounded-2xl border border-border bg-card p-6 shadow-sm transition-all hover:shadow-md">
              <h3 className="mb-2 text-lg font-bold text-foreground">{project.name}</h3>
              <p className="mb-4 text-sm text-muted-foreground line-clamp-2 min-h-[40px]">
                {project.description || "No description provided."}
              </p>
              <div className="flex items-center justify-between border-t border-border pt-4">
                <span className="text-sm font-medium text-muted-foreground">
                  {project.tasks?.length || 0} Tasks
                </span>
                <span className="text-xs text-muted-foreground">
                  {project.startDate ? new Date(project.startDate).toLocaleDateString() : "N/A"} -{" "}
                  {project.endDate ? new Date(project.endDate).toLocaleDateString() : "N/A"}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function MetricCard({ title, value, icon, trend }: { title: string; value: number | string; icon: React.ReactNode; trend?: string }) {
  return (
    <div className="flex flex-col justify-between rounded-2xl border border-border bg-card p-6 shadow-sm">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <h4 className="mt-2 text-3xl font-bold text-foreground">{value}</h4>
        </div>
        <div className="rounded-xl bg-secondary p-3">
          {icon}
        </div>
      </div>
      {trend && (
        <p className="mt-4 text-xs text-muted-foreground">{trend}</p>
      )}
    </div>
  );
}
