"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useCreateTaskMutation, useGetUsersQuery } from "@/state/api";
import { formatUsername } from "@/lib/utils";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const statusOptions = ["To Do", "Work In Progress", "Under Review", "Completed"];
const priorityOptions = ["Urgent", "High", "Medium", "Low", "Backlog"];

interface ModalNewTaskProps {
  open: boolean;
  onClose: () => void;
  projectId: string;
}

const ModalNewTask = ({ open, onClose, projectId }: ModalNewTaskProps) => {
  const [createTask, { isLoading }] = useCreateTaskMutation();
  const { data: users } = useGetUsersQuery();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("To Do");
  const [priority, setPriority] = useState("Medium");
  const [tags, setTags] = useState("");
  const [startDate, setStartDate] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [points, setPoints] = useState("");
  const [assignedUserId, setAssignedUserId] = useState("");

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setStatus("To Do");
    setPriority("Medium");
    setTags("");
    setStartDate("");
    setDueDate("");
    setPoints("");
    setAssignedUserId("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    try {
      await createTask({
        title,
        description: description || undefined,
        status,
        priority,
        tags: tags || undefined,
        startDate: startDate ? new Date(startDate).toISOString() : undefined,
        dueDate: dueDate ? new Date(dueDate).toISOString() : undefined,
        points: points ? Number(points) : undefined,
        projectId,
        assignedUserId: assignedUserId ? assignedUserId : undefined,
      }).unwrap();
      resetForm();
      onClose();
    } catch (err) {
      console.error("Failed to create task:", err);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent onClose={onClose} className="max-w-xl">
        <DialogHeader>
          <DialogTitle>Create New Task</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="task-title">
              Title <span className="text-destructive">*</span>
            </Label>
            <Input
              id="task-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter task title..."
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="task-description">Description</Label>
            <Textarea
              id="task-description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe this task..."
              rows={3}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="task-status">Status</Label>
              <Select value={status} onValueChange={(val) => setStatus(val || "To Do")}>
                <SelectTrigger className="w-full h-10">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  {statusOptions.map((s) => (
                    <SelectItem key={s} value={s}>
                      {s}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="task-priority">Priority</Label>
              <Select value={priority} onValueChange={(val) => setPriority(val || "Medium")}>
                <SelectTrigger className="w-full h-10">
                  <SelectValue placeholder="Priority" />
                </SelectTrigger>
                <SelectContent>
                  {priorityOptions.map((p) => (
                    <SelectItem key={p} value={p}>
                      {p}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="task-start">Start Date</Label>
              <Input
                id="task-start"
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="task-due">Due Date</Label>
              <Input
                id="task-due"
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="task-points">Story Points</Label>
              <Input
                id="task-points"
                type="number"
                min="0"
                value={points}
                onChange={(e) => setPoints(e.target.value)}
                placeholder="0"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="task-assignee">Assignee</Label>
              <Select value={assignedUserId || "none"} onValueChange={(val) => setAssignedUserId(val === "none" ? "" : val || "")}>
                <SelectTrigger className="w-full h-10">
                  <SelectValue placeholder="Unassigned">
                    {assignedUserId 
                      ? formatUsername(users?.find((u) => u.userId === assignedUserId)?.username || "")
                      : "Unassigned"}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">Unassigned</SelectItem>
                  {users?.map((user) => (
                    <SelectItem key={user.userId} value={user.userId}>
                      {formatUsername(user.username)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="task-tags">Tags</Label>
            <Input
              id="task-tags"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              placeholder="Comma-separated tags (e.g. Design, UX)"
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading || !title.trim()}>
              {isLoading ? "Creating..." : "Create Task"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ModalNewTask;
