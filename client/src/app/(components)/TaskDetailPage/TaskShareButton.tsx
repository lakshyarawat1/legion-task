"use client";

import React, { useState } from "react";
import { Link2, Check } from "lucide-react";
import { Button } from "@/components/ui/button";

interface TaskShareButtonProps {
  taskId: string;
}

export default function TaskShareButton({ taskId }: TaskShareButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      const url = `${window.location.origin}/tasks/${taskId}`;
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy URL:", err);
    }
  };

  return (
    <Button variant="outline" size="sm" onClick={handleCopy} className="gap-2">
      {copied ? <Check className="h-4 w-4 text-green-500" /> : <Link2 className="h-4 w-4" />}
      <span>{copied ? "Copied!" : "Share"}</span>
    </Button>
  );
}
