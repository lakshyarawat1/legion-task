"use client";

import React from "react";
import { useDrag } from "react-dnd";
import { Task } from "@/state/api";
import { format } from "date-fns";
import { MessageSquareMore } from "lucide-react";
import Image from "next/image";

type TaskCardProps = {
  task: Task;
};

const TaskCard = ({ task }: TaskCardProps) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: "task",
    item: { id: task.id },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }));

  const taskTagsSplit = task.tags ? task.tags.split(",") : [];

  const formattedStartDate = task.startDate ? format(new Date(task.startDate), "P") : "";
  const formattedDueDate = task.dueDate ? format(new Date(task.dueDate), "P") : "";

  const numberOfComments = (task.comments && task.comments.length) || 0;

  const PriorityTag = ({ priority }: { priority: Task["priority"] }) => (
    <div
      className={`rounded-full px-2 py-1 text-xs font-semibold ${
        priority === "Urgent"
          ? "bg-red-200 text-red-700"
          : priority === "High"
            ? "bg-yellow-200 text-yellow-700"
            : priority === "Medium"
              ? "bg-green-200 text-green-700"
              : priority === "Low"
                ? "bg-blue-200 text-blue-700"
                : "bg-gray-200 text-gray-700"
      }`}
    >
      {priority}
    </div>
  );

  return (
    <div
      ref={(instance) => {
        drag(instance);
      }}
      className={`mb-4 rounded-xl bg-card p-4 shadow-sm transition-all duration-200 hover:shadow-md dark:border dark:border-border dark:bg-card/80 dark:backdrop-blur-sm ${
        isDragging ? "opacity-50" : "opacity-100"
      }`}
    >
      {task.attachments && task.attachments.length > 0 && (
        <Image
          src={`/${task.attachments[0].fileURL}`}
          alt={task.attachments[0].fileName || "Attachment"}
          width={400}
          height={200}
          className="mb-3 h-auto w-full rounded-lg"
        />
      )}
      <div className="mb-2 flex items-start justify-between">
        <div className="flex flex-1 flex-wrap items-center gap-2">
          {task.priority && <PriorityTag priority={task.priority} />}
          <div className="flex gap-2">
            {taskTagsSplit.map((tag) => (
              <div key={tag} className="rounded-full bg-secondary px-2 py-1 text-xs text-foreground">
                {tag}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="my-3 flex justify-between">
        <h4 className="text-md font-bold text-foreground">{task.title}</h4>
      </div>

      <div className="text-xs text-muted-foreground">
        {formattedStartDate && <span>{formattedStartDate} - </span>}
        {formattedDueDate && <span>{formattedDueDate}</span>}
      </div>
      <p className="mt-2 text-sm text-muted-foreground">{task.description}</p>
      <div className="mt-4 flex items-center justify-between border-t border-border pt-4">
        <div className="flex -space-x-[6px] overflow-hidden">
          {task.assignee && task.assignee.profilePictureUrl && (
            <Image
              src={`/${task.assignee.profilePictureUrl}`}
              alt={task.assignee.username}
              width={30}
              height={30}
              className="h-8 w-8 rounded-full border-2 border-white object-cover dark:border-black"
            />
          )}
          {task.author && task.author.profilePictureUrl && (
            <Image
              src={`/${task.author.profilePictureUrl}`}
              alt={task.author.username}
              width={30}
              height={30}
              className="h-8 w-8 rounded-full border-2 border-white object-cover dark:border-black"
            />
          )}
        </div>
        <div className="flex items-center text-muted-foreground">
          <MessageSquareMore className="mr-1 h-4 w-4" />
          <span className="text-sm">{numberOfComments}</span>
        </div>
      </div>
    </div>
  );
};

export default TaskCard;
