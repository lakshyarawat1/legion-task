"use client";

import React, { use } from "react";
import { useGetTaskByIdQuery } from "@/state/api";
import TaskDetailHeader from "@/app/(components)/TaskDetailPage/TaskDetailHeader";
import TaskDetailDescription from "@/app/(components)/TaskDetailPage/TaskDetailDescription";
import TaskDetailComments from "@/app/(components)/TaskDetailPage/TaskDetailComments";
import TaskDetailAttachments from "@/app/(components)/TaskDetailPage/TaskDetailAttachments";
import TaskDetailSidebar from "@/app/(components)/TaskDetailPage/TaskDetailSidebar";

export default function TaskDetailPage({ params }: { params: Promise<{ taskId: string }> }) {
  const resolvedParams = use(params);
  const taskId = resolvedParams.taskId;
  
  const { data: task, isLoading, isError } = useGetTaskByIdQuery({ taskId });

  if (isLoading) {
    return (
      <div className="p-8 w-full h-full animate-pulse flex flex-col gap-8">
        <div className="h-8 bg-secondary rounded w-1/4"></div>
        <div className="h-12 bg-secondary rounded w-3/4"></div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 flex flex-col gap-8">
            <div className="h-64 bg-secondary rounded-2xl w-full"></div>
            <div className="h-64 bg-secondary rounded-2xl w-full"></div>
          </div>
          <div className="h-[500px] bg-secondary rounded-2xl w-full"></div>
        </div>
      </div>
    );
  }

  if (isError || !task) {
    return (
      <div className="p-8 w-full h-full flex flex-col items-center justify-center text-red-500">
        <h2 className="text-2xl font-bold mb-4">Task not found or access denied.</h2>
        <p>The task may have been deleted, or you do not have permission to view it.</p>
      </div>
    );
  }

  return (
    <div className="w-full h-full p-4 sm:p-8 flex flex-col gap-6 overflow-y-auto">
      <TaskDetailHeader task={task} />
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pb-12">
        {/* Main Content (Left Column) */}
        <div className="lg:col-span-2 flex flex-col gap-8">
          <TaskDetailDescription task={task} />
          <TaskDetailAttachments task={task} />
          <TaskDetailComments task={task} />
        </div>

        {/* Sidebar (Right Column) */}
        <div className="lg:col-span-1">
          <div className="sticky top-8">
            <TaskDetailSidebar task={task} />
          </div>
        </div>
      </div>
    </div>
  );
}
