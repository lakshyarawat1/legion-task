"use client";

import React from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { useGetTasksQuery, useUpdateTaskStatusMutation } from "@/state/api";
import BoardColumn from "./BoardColumn";

const taskStatus = ["To Do", "Work In Progress", "Under Review", "Completed"];

const BoardView = ({ projectId }: { projectId: string }) => {
  const { data: tasks, isLoading, error } = useGetTasksQuery({ projectId });
  const [updateTaskStatus] = useUpdateTaskStatusMutation();

  const moveTask = (taskId: string, toStatus: string) => {
    updateTaskStatus({ taskId, status: toStatus });
  };

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4 h-full">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-[500px] w-full animate-pulse rounded-2xl bg-secondary" />
        ))}
      </div>
    );
  }
  
  if (error) {
    return <div className="p-8 text-destructive bg-red-100 dark:bg-red-900/30 rounded-xl">An error occurred while fetching tasks.</div>;
  }

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="flex flex-col h-full w-full">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4 flex-1 overflow-y-auto">
          {taskStatus.map((status) => (
            <BoardColumn
              key={status}
              status={status}
              tasks={tasks?.filter((t) => t.status === status) || []}
              moveTask={moveTask}
            />
          ))}
        </div>
      </div>
    </DndProvider>
  );
};

export default BoardView;
