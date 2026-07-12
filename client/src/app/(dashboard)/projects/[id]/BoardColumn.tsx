"use client";

import React from "react";
import { useDrop } from "react-dnd";
import { Task } from "@/state/api";
import TaskCard from "./TaskCard";

type BoardColumnProps = {
  status: string;
  tasks: Task[];
  moveTask: (taskId: string, toStatus: string) => void;
};

const BoardColumn = ({ status, tasks, moveTask }: BoardColumnProps) => {
  const [{ isOver }, drop] = useDrop(() => ({
    accept: "task",
    drop: (item: { id: string }) => moveTask(item.id, status),
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
  }));

  const tasksCount = tasks.length;

  const statusColor: Record<string, string> = {
    "To Do": "#2563EB",
    "Work In Progress": "#059669",
    "Under Review": "#D97706",
    Completed: "#000000",
  };

  return (
    <div
      ref={(instance) => {
        drop(instance);
      }}
      className={`flex flex-col rounded-2xl py-4 transition-colors xl:px-4 ${isOver ? "bg-secondary" : ""}`}
    >
      <div className="mb-4 flex w-full justify-between items-center px-4 xl:px-0">
        <div className="flex items-center gap-2">
          <div
            className="h-3 w-3 rounded-full"
            style={{ backgroundColor: statusColor[status] || "#6B7280" }}
          />
          <h3 className="font-semibold text-foreground">{status}</h3>
        </div>
        <div className="flex h-6 w-6 items-center justify-center rounded-full bg-secondary text-xs font-semibold text-foreground">
          {tasksCount}
        </div>
      </div>
      <div className="flex-1 overflow-y-auto px-4 xl:px-0">
        {tasks.map((task) => (
          <TaskCard key={task.id} task={task} />
        ))}
      </div>
    </div>
  );
};

export default BoardColumn;
