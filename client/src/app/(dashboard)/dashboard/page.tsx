"use client";

import React, { useMemo } from "react";
import Link from "next/link";
import {
  useGetProjectsQuery,
  useGetTasksQuery,
  useGetMeQuery,
} from "@/state/api";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
  Cell,
} from "recharts";
import {
  Briefcase,
  CheckCircle2,
  ListTodo,
  Clock,
  AlertCircle,
  TrendingUp,
} from "lucide-react";
import { format, isAfter, isBefore, addDays } from "date-fns";
import { PriorityBadge } from "@/app/(components)/Badges/Badges";

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
  const { data: currentUser, isLoading: isUserLoading } = useGetMeQuery();

  if (isProjectsLoading || isTasksLoading || isUserLoading) {
    return (
      <div className="flex h-full w-full p-8 flex-col gap-6">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-28 w-full animate-pulse rounded-2xl bg-secondary" />
          ))}
        </div>
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="h-80 w-full animate-pulse rounded-2xl bg-secondary lg:col-span-2" />
          <div className="h-80 w-full animate-pulse rounded-2xl bg-secondary" />
        </div>
      </div>
    );
  }

  const totalProjects = projects?.length || 0;
  
  // My Open Tasks
  const myOpenTasks = tasks?.filter(t => t.assignedUserId === currentUser?.userId && t.status !== "Completed") || [];
  
  // Due Soon (Next 7 days, not completed)
  const today = new Date();
  const nextWeek = addDays(today, 7);
  const dueSoonTasks = tasks?.filter(t => {
    if (t.status === "Completed" || !t.dueDate) return false;
    const dueDate = new Date(t.dueDate);
    return isAfter(dueDate, today) && isBefore(dueDate, nextWeek);
  }) || [];

  const completedTasks = tasks?.filter((t) => t.status === "Completed") || [];
  const totalTasks = tasks?.length || 0;
  const completionRate = totalTasks ? Math.round((completedTasks.length / totalTasks) * 100) : 0;

  // Upcoming Deadlines List
  const upcomingDeadlines = [...dueSoonTasks]
    .sort((a, b) => new Date(a.dueDate!).getTime() - new Date(b.dueDate!).getTime())
    .slice(0, 5);

  // Priority chart data
  const priorityCounts = tasks?.reduce((acc: Record<string, number>, task) => {
    if (task.status !== "Completed") {
      acc[task.priority || "Medium"] = (acc[task.priority || "Medium"] || 0) + 1;
    }
    return acc;
  }, {});

  const priorityData = Object.keys(priorityCounts || {}).map((key) => ({
    name: key,
    count: priorityCounts![key],
    color: PRIORITY_COLORS[key as keyof typeof PRIORITY_COLORS] || "#cbd5e1",
  })).sort((a, b) => b.count - a.count);

  // Project Health Data (Top 5 projects by total tasks)
  const projectHealthData = projects?.map(p => {
    const projectTasks = tasks?.filter(t => t.projectId === p.id) || [];
    const completed = projectTasks.filter(t => t.status === "Completed").length;
    const pending = projectTasks.length - completed;
    return {
      name: p.name,
      Completed: completed,
      Pending: pending,
      total: projectTasks.length
    };
  }).sort((a, b) => b.total - a.total).slice(0, 5) || [];

  const CustomTooltip = ({ active, payload }: { active?: boolean; payload?: any[] }) => {
    if (active && payload && payload.length) {
      return (
        <div className="rounded-xl border border-border bg-card p-3 shadow-lg">
          <p className="text-sm font-semibold text-foreground mb-1">{payload[0].payload.name}</p>
          {payload.map((entry, index) => (
            <p key={index} className="text-sm text-muted-foreground flex items-center gap-2">
              <span className="w-3 h-3 rounded-full" style={{ backgroundColor: entry.color }} />
              {entry.name}: <span className="font-medium text-foreground">{entry.value}</span>
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="flex h-full w-full flex-col p-6 max-w-7xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
        <p className="text-muted-foreground mt-1 text-lg">Welcome back, {currentUser?.username}</p>
      </div>

      {/* Top Metrics Row */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          title="Total Projects"
          value={totalProjects}
          icon={<Briefcase className="h-6 w-6 text-blue-500" />}
          trend="Active workspaces"
          color="bg-blue-500/10"
        />
        <MetricCard
          title="My Open Tasks"
          value={myOpenTasks.length}
          icon={<ListTodo className="h-6 w-6 text-orange-500" />}
          trend="Needs your attention"
          color="bg-orange-500/10"
        />
        <MetricCard
          title="Due Soon"
          value={dueSoonTasks.length}
          icon={<Clock className="h-6 w-6 text-red-500" />}
          trend="Next 7 days"
          color="bg-red-500/10"
        />
        <MetricCard
          title="Completion Rate"
          value={`${completionRate}%`}
          icon={<TrendingUp className="h-6 w-6 text-emerald-500" />}
          trend="Across all projects"
          color="bg-emerald-500/10"
        />
      </div>

      {/* Charts & Lists Row */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        
        {/* Project Health Chart */}
        <div className="rounded-3xl border border-border bg-card p-6 shadow-sm lg:col-span-2 flex flex-col">
          <h2 className="mb-6 text-lg font-semibold text-foreground flex items-center gap-2">
            <CheckCircle2 className="h-5 w-5 text-emerald-500" />
            Project Health
          </h2>
          <div className="flex-1 min-h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={projectHealthData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip content={<CustomTooltip />} cursor={{ fill: 'var(--color-secondary)' }} />
                <Legend iconType="circle" wrapperStyle={{ paddingTop: '20px' }} />
                <Bar dataKey="Completed" stackId="a" fill="#10B981" radius={[0, 0, 4, 4]} barSize={40} />
                <Bar dataKey="Pending" stackId="a" fill="#3B82F6" radius={[4, 4, 0, 0]} barSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Upcoming Deadlines */}
        <div className="rounded-3xl border border-border bg-card p-6 shadow-sm flex flex-col h-full">
          <h2 className="mb-6 text-lg font-semibold text-foreground flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-red-500" />
            Upcoming Deadlines
          </h2>
          
          {upcomingDeadlines.length > 0 ? (
            <div className="flex flex-col gap-4 overflow-y-auto pr-2">
              {upcomingDeadlines.map((task) => (
                <Link 
                  href={`/projects/${task.projectId}?taskId=${task.id}`}
                  key={task.id}
                  className="group flex flex-col gap-2 rounded-2xl border border-border bg-secondary/30 p-4 transition-all hover:bg-secondary hover:border-primary/50"
                >
                  <div className="flex items-start justify-between gap-4">
                    <span className="font-semibold text-foreground text-sm line-clamp-2 group-hover:text-primary transition-colors">
                      {task.title}
                    </span>
                    <PriorityBadge priority={task.priority} />
                  </div>
                  <div className="flex items-center justify-between text-xs text-muted-foreground mt-2">
                    <span className="truncate max-w-[120px]">{task.project?.name}</span>
                    <span className="flex items-center gap-1 font-medium text-red-400">
                      <Clock className="h-3 w-3" />
                      {format(new Date(task.dueDate!), "MMM d")}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="flex flex-1 flex-col items-center justify-center text-center p-6 border border-dashed border-border rounded-2xl bg-secondary/20">
              <CheckCircle2 className="h-8 w-8 text-emerald-500 mb-3 opacity-80" />
              <p className="text-foreground font-medium">You're all caught up!</p>
              <p className="text-sm text-muted-foreground mt-1">No tasks due in the next 7 days.</p>
            </div>
          )}
        </div>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        
        {/* Priority Breakdown */}
        <div className="rounded-3xl border border-border bg-card p-6 shadow-sm flex flex-col">
          <h2 className="mb-6 text-lg font-semibold text-foreground">Open Task Priorities</h2>
          <div className="flex-1 min-h-[250px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={priorityData} layout="vertical" margin={{ top: 0, right: 30, left: 10, bottom: 0 }}>
                <XAxis type="number" hide />
                <YAxis dataKey="name" type="category" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} width={70} />
                <Tooltip content={<CustomTooltip />} cursor={{ fill: 'var(--color-secondary)' }} />
                <Bar dataKey="count" radius={[0, 4, 4, 0]} barSize={24}>
                  {priorityData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Your Projects List */}
        <div className="lg:col-span-2 rounded-3xl border border-border bg-card p-6 shadow-sm flex flex-col">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-foreground">Active Projects</h2>
            <Link href="/projects" className="text-sm font-medium text-primary hover:underline">View All</Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {projects?.slice(0, 4).map((project) => {
              const projectTasks = tasks?.filter(t => t.projectId === project.id) || [];
              const completed = projectTasks.filter(t => t.status === "Completed").length;
              const progress = projectTasks.length ? Math.round((completed / projectTasks.length) * 100) : 0;
              
              return (
                <Link 
                  href={`/projects/${project.id}`} 
                  key={project.id} 
                  className="group flex flex-col justify-between rounded-2xl border border-border bg-secondary/20 p-5 transition-all hover:bg-secondary hover:border-primary/50"
                >
                  <div>
                    <h3 className="mb-1 text-base font-bold text-foreground group-hover:text-primary transition-colors">{project.name}</h3>
                    <p className="mb-4 text-xs text-muted-foreground line-clamp-1">
                      {project.description || "No description provided."}
                    </p>
                  </div>
                  
                  <div className="flex flex-col gap-2 mt-auto">
                    <div className="flex items-center justify-between text-xs font-medium">
                      <span className="text-muted-foreground">{projectTasks.length} Tasks</span>
                      <span className="text-foreground">{progress}%</span>
                    </div>
                    <div className="h-1.5 w-full overflow-hidden rounded-full bg-border">
                      <div 
                        className="h-full bg-primary rounded-full transition-all duration-500 ease-in-out" 
                        style={{ width: `${progress}%` }} 
                      />
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>

      </div>
    </div>
  );
}

function MetricCard({ title, value, icon, trend, color }: { title: string; value: number | string; icon: React.ReactNode; trend?: string; color: string }) {
  return (
    <div className="flex flex-col justify-between rounded-3xl border border-border bg-card p-6 shadow-sm group hover:border-primary/30 transition-colors">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-muted-foreground mb-1">{title}</p>
          <h4 className="text-3xl font-bold text-foreground">{value}</h4>
        </div>
        <div className={`rounded-2xl p-3 ${color} group-hover:scale-110 transition-transform duration-300`}>
          {icon}
        </div>
      </div>
      {trend && (
        <p className="mt-4 text-xs font-medium text-muted-foreground opacity-80">{trend}</p>
      )}
    </div>
  );
}
