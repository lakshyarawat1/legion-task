"use client";

import React, { useState } from "react";
import { useDrag } from "react-dnd";
import { Task } from "@/state/api";
import { format, isValid } from "date-fns";
import { MessageSquareMore } from "lucide-react";
import Image from "next/image";
import { motion } from "framer-motion";
import UserAvatar from "@/app/(components)/UserAvatar/UserAvatar";

import { useRouter } from "next/navigation";

type TaskCardProps = {
  task: Task;
};

const TaskCard = ({ task }: TaskCardProps) => {
  const router = useRouter();
  const [imageError, setImageError] = useState(false);
  const [{ isDragging }, drag] = useDrag(() => ({
    type: "task",
    item: { id: task.id },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }));

  const taskTagsSplit = task.tags ? task.tags.split(",") : [];

  const startDateObj = task.startDate ? new Date(task.startDate) : null;
  const formattedStartDate = startDateObj && isValid(startDateObj) ? format(startDateObj, "P") : "";

  const dueDateObj = task.dueDate ? new Date(task.dueDate) : null;
  const formattedDueDate = dueDateObj && isValid(dueDateObj) ? format(dueDateObj, "P") : "";

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
      ref={drag as unknown as React.Ref<HTMLDivElement>}
      className={`mb-3 ${isDragging ? "opacity-50" : "opacity-100"}`}
    >
      <motion.div
        layoutId={`task-card-${task.id}`}
        onClick={() => {
          const url = new URL(window.location.href);
          url.searchParams.set("taskId", task.id.toString());
          router.push(url.pathname + url.search, { scroll: false });
        }}
        className="rounded-2xl bg-card p-4 shadow-sm border border-border transition-all hover:shadow-md hover:border-blue-500/50 cursor-pointer"
      >
      {task.attachments && task.attachments.length > 0 && !imageError && (
        <Image
          src={task.attachments[0].fileURL.startsWith("http") ? task.attachments[0].fileURL : `/${task.attachments[0].fileURL}`}
          alt={task.attachments[0].fileName || "Attachment"}
          width={400}
          height={200}
          className="mb-3 h-auto w-full rounded-lg object-cover"
          onError={() => setImageError(true)}
        />
      )}
      <div className="mb-2 flex items-start justify-between">
        <div className="flex flex-1 flex-wrap items-center gap-2">
          {task.priority && <PriorityTag priority={task.priority} />}
          <div className="text-xs font-semibold text-blue-500 px-2 py-1 bg-blue-500/10 rounded">
            {task.displayId || task.id.substring(0,8)}
          </div>
          <div className="flex gap-2">
            {taskTagsSplit.map((tag) => (
              <div key={tag} className="rounded-full bg-secondary px-2 py-1 text-xs text-foreground">
                {tag}
              </div>
            ))}
          </div>
        </div>
      </div>

      <motion.div layoutId={`task-title-${task.id}`} className="my-3 flex justify-between">
        <h4 className="text-md font-bold text-foreground">{task.title}</h4>
      </motion.div>

      <div className="text-xs text-muted-foreground">
        {formattedStartDate && <span>{formattedStartDate} - </span>}
        {formattedDueDate && <span>{formattedDueDate}</span>}
      </div>
      <p className="mt-2 text-sm text-muted-foreground">{task.description}</p>
      <div className="mt-4 flex items-center justify-between border-t border-border pt-4">
        <div className="flex -space-x-[6px] overflow-hidden">
          {task.assignee && (
            <div className="border-2 border-card rounded-full shadow-sm z-10">
              <UserAvatar user={task.assignee} size={28} />
            </div>
          )}
          {task.author && task.author.userId !== task.assignee?.userId && (
            <div className="border-2 border-card rounded-full shadow-sm">
              <UserAvatar user={task.author} size={28} />
            </div>
          )}
        </div>
        <div className="flex items-center text-muted-foreground">
          <MessageSquareMore className="mr-1 h-4 w-4" />
          <span className="text-sm">{numberOfComments}</span>
        </div>
        </div>
      </motion.div>
    </div>
  );
};

export default TaskCard;
