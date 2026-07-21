"use client";

import React, { useState, useEffect } from "react";
import { Task, useUpdateTaskMutation, useGetMeQuery } from "@/state/api";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Pencil } from "lucide-react";
import ReactMarkdown from "react-markdown";

interface TaskDetailDescriptionProps {
  task: Task;
}

export default function TaskDetailDescription({ task }: TaskDetailDescriptionProps) {
  const { data: currentUser } = useGetMeQuery();
  const [updateTask, { isLoading: isUpdating }] = useUpdateTaskMutation();

  const [isEditingDesc, setIsEditingDesc] = useState(false);
  const [editDesc, setEditDesc] = useState(task.description || "");

  useEffect(() => {
    setEditDesc(task.description || "");
  }, [task.description]);

  const isAuthor = currentUser?.userId === task.authorUserId;
  const isAssignee = currentUser?.userId === task.assignedUserId;
  const isPoOrPm = Boolean(
    currentUser?.teamId && 
    task.project?.projectTeams?.some(pt => pt.teamId === currentUser?.teamId) &&
    (currentUser.team?.productOwnerUserId === currentUser.userId || currentUser.team?.projectManagerUserId === currentUser.userId)
  );
  const canEdit = isAuthor || isAssignee || isPoOrPm;

  const handleSaveDesc = async () => {
    if (editDesc === task.description) {
      setIsEditingDesc(false);
      return;
    }
    await updateTask({ taskId: task.id, description: editDesc });
    setIsEditingDesc(false);
  };

  return (
    <div className="rounded-2xl border border-border bg-secondary/20 p-5 sm:p-6">
      <div className="flex items-center justify-between mb-4 border-b border-border/50 pb-4">
        <h3 className="text-lg font-semibold text-foreground">Description</h3>
        {canEdit && !isEditingDesc && (
          <Button variant="ghost" size="sm" onClick={() => setIsEditingDesc(true)}>
            <Pencil className="h-4 w-4 mr-2" /> Edit
          </Button>
        )}
      </div>
      
      {isEditingDesc ? (
        <div className="flex flex-col gap-4">
          <Textarea 
            value={editDesc}
            onChange={(e) => setEditDesc(e.target.value)}
            className="min-h-[150px] resize-y bg-background"
            placeholder="Add a more detailed description..."
          />
          <div className="flex gap-2 justify-end">
            <Button variant="outline" onClick={() => setIsEditingDesc(false)} disabled={isUpdating}>
              Cancel
            </Button>
            <Button onClick={handleSaveDesc} disabled={isUpdating}>
              {isUpdating ? "Saving..." : "Save"}
            </Button>
          </div>
        </div>
      ) : (
        <div className="prose prose-sm sm:prose-base dark:prose-invert max-w-none">
          {task.description ? (
            <ReactMarkdown>{task.description}</ReactMarkdown>
          ) : (
            <p className="text-muted-foreground italic">No description provided.</p>
          )}
        </div>
      )}
    </div>
  );
}
