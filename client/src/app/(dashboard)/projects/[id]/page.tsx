"use client";

import React, { useState } from "react";
import { useParams } from "next/navigation";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useGetProjectByIdQuery } from "@/state/api";
import BoardView from "./BoardView";
import ListView from "./ListView";
import TableView from "./TableView";
import TimelineView from "./TimelineView";
import ModalNewTask from "@/app/(components)/ModalNewTask/ModalNewTask";

export default function ProjectPage() {
  const { id } = useParams();
  const projectId = id as string;
  const [activeTab, setActiveTab] = useState("board");
  const [isNewTaskModalOpen, setIsNewTaskModalOpen] = useState(false);

  const { data: project, isLoading, isError, error } = useGetProjectByIdQuery({ id: projectId });

  if (!projectId) {
    return <div className="p-8 text-destructive bg-red-100 dark:bg-red-900/30">Invalid project ID</div>;
  }

  return (
    <div className="flex h-full w-full flex-col p-8 max-w-7xl mx-auto">
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">
            {isLoading ? (
              <div className="h-8 w-64 animate-pulse rounded bg-secondary" />
            ) : isError ? (
              <span className="text-red-500 text-sm">Error loading project: {JSON.stringify(error)}</span>
            ) : (
              project?.name || "Unknown Project"
            )}
          </h1>
          {!isLoading && !isError && project?.description && (
            <p className="text-muted-foreground mt-1">{project.description}</p>
          )}
        </div>
        
        <Button onClick={() => setIsNewTaskModalOpen(true)} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          New Task
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col min-h-0">
        <TabsList className="mb-6 w-fit bg-secondary p-1 rounded-xl">
          <TabsTrigger value="board">Board</TabsTrigger>
          <TabsTrigger value="list">List</TabsTrigger>
          <TabsTrigger value="table">Table</TabsTrigger>
          <TabsTrigger value="timeline">Timeline</TabsTrigger>
        </TabsList>

        <div className="flex-1 min-h-[500px]">
          <TabsContent value="board" className="h-full mt-0">
            <BoardView projectId={projectId} />
          </TabsContent>
          <TabsContent value="list" className="h-full mt-0">
            <ListView projectId={projectId} />
          </TabsContent>
          <TabsContent value="table" className="h-full mt-0">
            <TableView projectId={projectId} />
          </TabsContent>
          <TabsContent value="timeline" className="h-full mt-0">
            <TimelineView projectId={projectId} />
          </TabsContent>
        </div>
      </Tabs>

      <ModalNewTask
        open={isNewTaskModalOpen}
        onClose={() => setIsNewTaskModalOpen(false)}
        projectId={projectId}
      />
    </div>
  );
}
