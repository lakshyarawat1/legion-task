import React from "react";
import { Notification } from "@/state/api";
import { formatDistanceToNow } from "date-fns";
import Image from "next/image";
import { Check, X, Bell } from "lucide-react";
import ReactMarkdown from "react-markdown";

interface NotificationItemProps {
  notification: Notification;
  onMarkAsRead: (id: string) => void;
  onDelete: (id: string) => void;
  onClick: (notification: Notification) => void;
}

export const NotificationItem: React.FC<NotificationItemProps> = ({
  notification,
  onMarkAsRead,
  onDelete,
  onClick,
}) => {
  return (
    <div
      className={`group relative flex items-start gap-3 p-4 transition-colors hover:bg-gray-50 dark:hover:bg-dark-tertiary/50 ${
        !notification.isRead ? "bg-blue-50/50 dark:bg-blue-900/10" : ""
      }`}
    >
      {/* Unread indicator */}
      {!notification.isRead && (
        <div className="absolute left-2 top-6 h-2 w-2 rounded-full bg-blue-500" />
      )}

      {/* Avatar / Icon */}
      <div className="flex-shrink-0 ml-2">
        {notification.actor?.profilePictureUrl ? (
          <Image
            src={notification.actor.profilePictureUrl}
            alt={notification.actor.username}
            width={36}
            height={36}
            className="rounded-full"
          />
        ) : (
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-200 dark:bg-dark-tertiary">
            <Bell className="h-4 w-4 text-gray-500 dark:text-gray-400" />
          </div>
        )}
      </div>

      {/* Content */}
      <div 
        className="flex-1 cursor-pointer"
        onClick={() => onClick(notification)}
      >
        <p className="text-sm font-semibold text-gray-900 dark:text-white">
          {notification.title}
        </p>
        <div className="mt-1 text-sm text-gray-600 dark:text-gray-300 prose prose-sm dark:prose-invert">
          <ReactMarkdown>{notification.message}</ReactMarkdown>
        </div>
        <p className="mt-1 text-xs text-gray-400 dark:text-gray-500">
          {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}
        </p>
      </div>

      {/* Actions */}
      <div className="flex flex-col gap-2 opacity-0 transition-opacity group-hover:opacity-100">
        {!notification.isRead && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onMarkAsRead(notification.id);
            }}
            className="text-gray-400 hover:text-blue-500"
            title="Mark as read"
          >
            <Check className="h-4 w-4" />
          </button>
        )}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete(notification.id);
          }}
          className="text-gray-400 hover:text-red-500"
          title="Delete"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
};
