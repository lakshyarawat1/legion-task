import React, { useEffect } from "react";
import { Notification } from "@/state/api";
import { X } from "lucide-react";
import ReactMarkdown from "react-markdown";

interface NotificationToastProps {
  notification: Notification | null;
  onClose: () => void;
}

export const NotificationToast: React.FC<NotificationToastProps> = ({ notification, onClose }) => {
  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => {
        onClose();
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [notification, onClose]);

  if (!notification) return null;

  return (
    <div className="fixed right-4 top-20 z-50 w-80 animate-slide-in-right rounded-lg border border-gray-200 bg-white p-4 shadow-xl dark:border-dark-tertiary dark:bg-dark-secondary">
      <button
        onClick={onClose}
        className="absolute right-2 top-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
      >
        <X className="h-4 w-4" />
      </button>
      <p className="text-sm font-semibold text-gray-900 dark:text-white pr-4">
        {notification.title}
      </p>
      <div className="mt-1 text-sm text-gray-600 dark:text-gray-300 prose prose-sm dark:prose-invert">
        <ReactMarkdown>{notification.message}</ReactMarkdown>
      </div>
    </div>
  );
};
