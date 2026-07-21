"use client";

import React, { useState } from "react";
import { useCreateCommentMutation } from "@/state/api";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Send, Loader2 } from "lucide-react";

interface CommentComposerProps {
  taskId: string;
}

export default function CommentComposer({ taskId }: CommentComposerProps) {
  const [createComment, { isLoading }] = useCreateCommentMutation();
  const [text, setText] = useState("");

  const handleSubmit = async () => {
    if (!text.trim() || isLoading) return;
    try {
      await createComment({
        taskId,
        text: text.trim(),
      }).unwrap();
      setText("");
    } catch (err) {
      console.error("Failed to create comment", err);
    }
  };

  return (
    <div className="flex flex-col gap-3 mt-4">
      <div className="relative">
        <Textarea 
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Write a comment... (markdown supported)"
          className="min-h-[100px] resize-y bg-background pr-12"
          onKeyDown={(e) => {
            if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
              e.preventDefault();
              handleSubmit();
            }
          }}
        />
        <Button 
          size="icon" 
          className="absolute bottom-3 right-3 h-8 w-8 rounded-full bg-blue-primary hover:bg-blue-600 text-white"
          onClick={handleSubmit}
          disabled={!text.trim() || isLoading}
        >
          {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
        </Button>
      </div>
      <span className="text-xs text-muted-foreground self-end px-1">
        Press <kbd className="font-sans px-1 rounded bg-secondary">Ctrl</kbd> + <kbd className="font-sans px-1 rounded bg-secondary">Enter</kbd> to submit
      </span>
    </div>
  );
}
