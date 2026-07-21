"use client";

import React, { useState } from "react";
import { Task, useGetPaginatedCommentsQuery } from "@/state/api";
import { MessageSquareMore, Loader2, ArrowUpDown } from "lucide-react";
import UserAvatar from "@/app/(components)/UserAvatar/UserAvatar";
import { formatDistanceToNow } from "date-fns";
import ReactMarkdown from "react-markdown";
import CommentComposer from "./CommentComposer";
import { Button } from "@/components/ui/button";

interface TaskDetailCommentsProps {
  task: Task;
}

export default function TaskDetailComments({ task }: TaskDetailCommentsProps) {
  const [order, setOrder] = useState<"asc" | "desc">("desc");
  const [limit, setLimit] = useState(20);
  
  const { data, isLoading, isFetching } = useGetPaginatedCommentsQuery({ 
    taskId: task.id,
    page: 1,
    limit,
    order
  });

  const comments = data?.comments || [];
  const total = data?.pagination.total || 0;
  const hasMore = comments.length < total;

  const handleLoadMore = () => {
    setLimit(prev => prev + 20);
  };

  return (
    <div className="rounded-2xl border border-border bg-card p-5 sm:p-6 flex flex-col h-full">
      <div className="flex items-center justify-between mb-4 border-b border-border/50 pb-4">
        <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
          <MessageSquareMore className="h-5 w-5 text-muted-foreground" />
          Comments
          <span className="text-xs bg-secondary text-muted-foreground px-2 py-0.5 rounded-full">
            {total}
          </span>
        </h3>
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => setOrder(order === "asc" ? "desc" : "asc")}
          className="text-muted-foreground"
        >
          <ArrowUpDown className="h-4 w-4 mr-2" />
          {order === "asc" ? "Oldest first" : "Newest first"}
        </Button>
      </div>

      <div className="flex-1 flex flex-col gap-6">
        {order === "desc" && <CommentComposer taskId={task.id} />}

        {isLoading && limit === 20 ? (
          <div className="flex justify-center p-8 text-muted-foreground">
            <Loader2 className="h-6 w-6 animate-spin" />
          </div>
        ) : comments.length === 0 ? (
          <div className="text-center p-8 bg-secondary/10 rounded-xl border border-dashed border-border/50">
            <p className="text-muted-foreground">No comments yet. Start the conversation!</p>
          </div>
        ) : (
          <div className="flex flex-col gap-6 mt-4">
            {comments.map((comment) => (
              <div key={comment.id} className="flex gap-4 group">
                <div className="flex-shrink-0 mt-1">
                  {comment.user ? (
                    <UserAvatar user={comment.user} size={36} />
                  ) : (
                    <div className="h-9 w-9 rounded-full bg-secondary flex items-center justify-center text-muted-foreground text-xs font-semibold">
                      ?
                    </div>
                  )}
                </div>
                <div className="flex flex-col gap-1 w-full max-w-[90%]">
                  <div className="flex items-baseline gap-2">
                    <span className="font-medium text-sm text-foreground">
                      {comment.user?.username || "Unknown"}
                    </span>
                    <span className="text-xs text-muted-foreground" title={comment.createdAt}>
                      {comment.createdAt ? formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true }) : ""}
                    </span>
                  </div>
                  <div className="bg-secondary/30 border border-border/50 rounded-2xl rounded-tl-sm p-4 prose prose-sm dark:prose-invert">
                    <ReactMarkdown>{comment.text}</ReactMarkdown>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {hasMore && (
          <div className="flex justify-center pt-4">
            <Button variant="outline" onClick={handleLoadMore} disabled={isFetching}>
              {isFetching ? (
                <><Loader2 className="h-4 w-4 mr-2 animate-spin" /> Loading...</>
              ) : (
                `Load more (${total - comments.length} remaining)`
              )}
            </Button>
          </div>
        )}

        {order === "asc" && (
          <div className="mt-auto pt-6 border-t border-border/50">
            <CommentComposer taskId={task.id} />
          </div>
        )}
      </div>
    </div>
  );
}
