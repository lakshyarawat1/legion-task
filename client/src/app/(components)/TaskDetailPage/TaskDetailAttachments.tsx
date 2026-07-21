"use client";

import React from "react";
import { Task, useGetAttachmentsQuery } from "@/state/api";
import { FileIcon, Download, Loader2 } from "lucide-react";
import Image from "next/image";

interface TaskDetailAttachmentsProps {
  task: Task;
}

export default function TaskDetailAttachments({ task }: TaskDetailAttachmentsProps) {
  const { data: attachments, isLoading } = useGetAttachmentsQuery({ taskId: task.id });

  return (
    <div className="rounded-2xl border border-border bg-card p-5 sm:p-6">
      <div className="flex items-center justify-between mb-4 border-b border-border/50 pb-4">
        <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
          Attachments
          {attachments && attachments.length > 0 && (
            <span className="text-xs bg-secondary text-muted-foreground px-2 py-0.5 rounded-full">
              {attachments.length}
            </span>
          )}
        </h3>
        {/* Placeholder for Add Attachment button logic */}
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center p-8 text-muted-foreground">
          <Loader2 className="h-6 w-6 animate-spin" />
        </div>
      ) : !attachments || attachments.length === 0 ? (
        <div className="text-center p-8 border-2 border-dashed border-border rounded-xl bg-secondary/10">
          <FileIcon className="h-8 w-8 text-muted-foreground mx-auto mb-2 opacity-50" />
          <p className="text-muted-foreground text-sm">No attachments yet</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {attachments.map((attachment) => {
            const isImage = attachment.fileURL.match(/\.(jpeg|jpg|gif|png)$/i) != null;
            
            return (
              <div 
                key={attachment.id} 
                className="group relative flex flex-col items-center justify-center border border-border rounded-xl overflow-hidden bg-secondary/20 hover:border-blue-500/50 transition-colors h-32"
              >
                {isImage ? (
                  <Image 
                    src={attachment.fileURL} 
                    alt={attachment.fileName || "Attachment"} 
                    fill 
                    className="object-cover opacity-80 group-hover:opacity-100 transition-opacity" 
                  />
                ) : (
                  <FileIcon className="h-10 w-10 text-muted-foreground" />
                )}
                
                <div className="absolute inset-x-0 bottom-0 bg-background/90 backdrop-blur-sm border-t border-border p-2 translate-y-full group-hover:translate-y-0 transition-transform flex items-center justify-between">
                  <span className="text-xs font-medium truncate max-w-[70%]">
                    {attachment.fileName || "File"}
                  </span>
                  <a 
                    href={attachment.fileURL} 
                    download
                    target="_blank"
                    rel="noreferrer"
                    className="p-1 hover:bg-secondary rounded text-muted-foreground hover:text-foreground"
                  >
                    <Download className="h-4 w-4" />
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
