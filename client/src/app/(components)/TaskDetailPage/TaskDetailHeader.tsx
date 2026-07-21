"use client";

import React, { useState, useEffect } from "react";
import { Task, useUpdateTaskMutation, useGetMeQuery } from "@/state/api";
import { PriorityBadge, StatusBadge } from "@/app/(components)/Badges/Badges";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Check, X, Pencil, MoreVertical } from "lucide-react";
import TaskShareButton from "./TaskShareButton";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface TaskDetailHeaderProps {
  task: Task;
}

export default function TaskDetailHeader({ task }: TaskDetailHeaderProps) {
  const router = useRouter();
  const { data: currentUser } = useGetMeQuery();
  const [updateTask, { isLoading: isUpdating }] = useUpdateTaskMutation();

  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [editTitle, setEditTitle] = useState(task.title);

  useEffect(() => {
    setEditTitle(task.title);
  }, [task.title]);

  const isAuthor = currentUser?.userId === task.authorUserId;
  const isAssignee = currentUser?.userId === task.assignedUserId;
  const isPoOrPm = Boolean(
    currentUser?.teamId && 
    task.project?.projectTeams?.some(pt => pt.teamId === currentUser?.teamId) &&
    (currentUser.team?.productOwnerUserId === currentUser.userId || currentUser.team?.projectManagerUserId === currentUser.userId)
  );
  const canEdit = isAuthor || isAssignee || isPoOrPm;

  const handleSaveTitle = async () => {
    if (!editTitle.trim() || editTitle === task.title) {
      setIsEditingTitle(false);
      return;
    }
    await updateTask({ taskId: task.id, title: editTitle });
    setIsEditingTitle(false);
  };

  return (
    <div className="flex flex-col gap-4">
      {/* Breadcrumb & Navigation */}
      <div className="flex items-center text-sm text-muted-foreground gap-2">
        <Link href="/dashboard" className="hover:text-foreground transition-colors">Home</Link>
        <span>&gt;</span>
        <Link href={`/projects/${task.projectId}`} className="hover:text-foreground transition-colors">
          {task.project?.name || "Project"}
        </Link>
        <span>&gt;</span>
        <span className="font-semibold text-foreground">{task.displayId || task.id.substring(0, 8)}</span>
      </div>
      
      <Button variant="ghost" className="w-fit -ml-4 px-4 text-muted-foreground hover:text-foreground" onClick={() => router.back()}>
        &larr; Back
      </Button>

      {/* Title & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
        <div className="flex flex-col gap-3 flex-1">
          {/* Badges */}
          <div className="flex items-center gap-3">
            <PriorityBadge priority={task.priority} />
            <StatusBadge status={task.status} />
          </div>

          {/* Editable Title */}
          <div className="group flex flex-col gap-2 max-w-3xl">
            {isEditingTitle ? (
              <div className="flex items-center gap-2 w-full">
                <Input 
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  className="text-2xl sm:text-3xl font-bold h-14 flex-1"
                  autoFocus
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleSaveTitle();
                    if (e.key === "Escape") setIsEditingTitle(false);
                  }}
                />
                <Button size="icon" variant="ghost" onClick={handleSaveTitle} disabled={isUpdating} className="text-green-500">
                  <Check className="h-6 w-6"/>
                </Button>
                <Button size="icon" variant="ghost" onClick={() => setIsEditingTitle(false)} disabled={isUpdating} className="text-red-500">
                  <X className="h-6 w-6"/>
                </Button>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <h1 className="text-2xl sm:text-4xl font-bold text-foreground break-words">{task.title}</h1>
                {canEdit && (
                  <button 
                    onClick={() => setIsEditingTitle(true)}
                    className="opacity-0 group-hover:opacity-100 transition-opacity p-2 text-muted-foreground hover:text-foreground hover:bg-secondary rounded-full flex-shrink-0"
                  >
                    <Pencil className="h-5 w-5" />
                  </button>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          <TaskShareButton taskId={task.id} />
          <Button variant="outline" size="icon">
            <MoreVertical className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
