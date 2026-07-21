"use client";

import React from "react";
import { Task, useUpdateTaskMutation, useGetMeQuery, useGetUsersQuery } from "@/state/api";
import { format } from "date-fns";
import UserAvatar from "@/app/(components)/UserAvatar/UserAvatar";
import { Copy, Calendar as CalendarIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

interface TaskDetailSidebarProps {
  task: Task;
}

export default function TaskDetailSidebar({ task }: TaskDetailSidebarProps) {
  const { data: currentUser } = useGetMeQuery();
  const { data: users } = useGetUsersQuery();
  const [updateTask] = useUpdateTaskMutation();

  const handleCopyId = async () => {
    try {
      await navigator.clipboard.writeText(task.displayId || task.id);
    } catch (err) {
      console.error("Failed to copy ID:", err);
    }
  };

  const formattedStartDate = task.startDate ? format(new Date(task.startDate), "MMM d, yyyy") : "Not set";
  const formattedDueDate = task.dueDate ? format(new Date(task.dueDate), "MMM d, yyyy") : "Not set";
  const formattedCreated = task.createdAt ? format(new Date(task.createdAt), "MMM d, yyyy") : "Unknown";
  const formattedUpdated = task.updatedAt ? format(new Date(task.updatedAt), "MMM d, yyyy") : "Unknown";

  return (
    <div className="rounded-2xl border border-border bg-card p-5 sm:p-6 flex flex-col gap-6">
      <h3 className="text-lg font-semibold border-b border-border/50 pb-3">Details</h3>
      
      {/* Assignee & Reporter */}
      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col gap-2">
          <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Assignee</span>
          <div className="flex items-center gap-2">
            {task.assignee ? (
              <>
                <UserAvatar user={task.assignee} size={28} />
                <span className="text-sm font-medium">{task.assignee.username}</span>
              </>
            ) : (
              <span className="text-sm text-muted-foreground italic">Unassigned</span>
            )}
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Reporter</span>
          <div className="flex items-center gap-2">
            {task.author ? (
              <>
                <UserAvatar user={task.author} size={28} />
                <span className="text-sm font-medium">{task.author.username}</span>
              </>
            ) : (
              <span className="text-sm text-muted-foreground italic">Unknown</span>
            )}
          </div>
        </div>
      </div>

      <hr className="border-border/50" />

      {/* Dates */}
      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col gap-2">
          <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Start Date</span>
          <div className="flex items-center gap-2 text-sm">
            <CalendarIcon className="h-4 w-4 text-muted-foreground" />
            <span>{formattedStartDate}</span>
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Due Date</span>
          <div className="flex items-center gap-2 text-sm">
            <CalendarIcon className="h-4 w-4 text-muted-foreground" />
            <span className={task.dueDate && new Date(task.dueDate) < new Date() ? "text-red-500 font-medium" : ""}>
              {formattedDueDate}
            </span>
          </div>
        </div>
      </div>

      <hr className="border-border/50" />

      {/* Metadata */}
      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col gap-2">
          <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Story Points</span>
          <span className="text-sm font-medium bg-secondary w-fit px-3 py-1 rounded-full">{task.points || "-"}</span>
        </div>

        <div className="flex flex-col gap-2">
          <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Task ID</span>
          <div className="flex items-center gap-1 group">
            <span className="text-sm font-medium bg-blue-500/10 text-blue-500 w-fit px-2 py-0.5 rounded">
              {task.displayId || task.id.substring(0, 8)}
            </span>
            <button 
              onClick={handleCopyId}
              className="p-1 text-muted-foreground hover:text-foreground opacity-0 group-hover:opacity-100 transition-opacity"
              title="Copy ID"
            >
              <Copy className="h-3 w-3" />
            </button>
          </div>
        </div>
      </div>

      {/* Tags */}
      {task.tags && (
        <>
          <hr className="border-border/50" />
          <div className="flex flex-col gap-2">
            <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Tags</span>
            <div className="flex flex-wrap gap-2">
              {task.tags.split(',').map(tag => (
                <span key={tag.trim()} className="text-xs font-medium bg-secondary px-2 py-1 rounded">
                  {tag.trim()}
                </span>
              ))}
            </div>
          </div>
        </>
      )}

      {/* Timestamps */}
      <hr className="border-border/50" />
      <div className="flex flex-col gap-1 text-xs text-muted-foreground">
        <div>Created {formattedCreated}</div>
        <div>Updated {formattedUpdated}</div>
      </div>
    </div>
  );
}
