import React, { useState } from "react";
import {
  useGetNotificationsQuery,
  useMarkAllAsReadMutation,
  useMarkAsReadMutation,
  useDeleteNotificationMutation,
  Notification,
} from "@/state/api";
import { NotificationItem } from "./NotificationItem";
import { CheckCheck, BellOff, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";

interface NotificationPanelProps {
  onClose: () => void;
}

export const NotificationPanel: React.FC<NotificationPanelProps> = ({ onClose }) => {
  const [filter, setFilter] = useState<"all" | "unread">("all");
  const router = useRouter();

  const { data, isLoading, isFetching } = useGetNotificationsQuery({
    page: 1,
    limit: 50,
    unreadOnly: filter === "unread",
  });

  const [markAsRead] = useMarkAsReadMutation();
  const [markAllAsRead] = useMarkAllAsReadMutation();
  const [deleteNotification] = useDeleteNotificationMutation();

  const handleNotificationClick = (notification: Notification) => {
    if (!notification.isRead) {
      markAsRead(notification.id);
    }

    if (notification.resourceType === "TASK" && notification.resourceId) {
      // In a real app we might need to route to a specific project to view the task
      // For now, let's close the panel. The user can navigate to search or timeline.
      // E.g., router.push(`/projects/${projectId}`);
    }
    
    onClose();
  };

  const notifications = data?.notifications || [];

  return (
    <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-lg border border-gray-200 bg-white shadow-lg dark:border-dark-tertiary dark:bg-dark-secondary z-50">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-gray-200 px-4 py-3 dark:border-dark-tertiary">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Notifications</h3>
        {notifications.some((n) => !n.isRead) && (
          <button
            onClick={() => markAllAsRead()}
            className="flex items-center gap-1 text-xs font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
          >
            <CheckCheck className="h-4 w-4" />
            Mark all read
          </button>
        )}
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-200 px-4 dark:border-dark-tertiary">
        <button
          className={`border-b-2 px-3 py-2 text-sm font-medium transition-colors ${
            filter === "all"
              ? "border-blue-600 text-blue-600 dark:border-blue-400 dark:text-blue-400"
              : "border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
          }`}
          onClick={() => setFilter("all")}
        >
          All
        </button>
        <button
          className={`border-b-2 px-3 py-2 text-sm font-medium transition-colors ${
            filter === "unread"
              ? "border-blue-600 text-blue-600 dark:border-blue-400 dark:text-blue-400"
              : "border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
          }`}
          onClick={() => setFilter("unread")}
        >
          Unread
        </button>
      </div>

      {/* Content */}
      <div className="max-h-[60vh] overflow-y-auto">
        {isLoading ? (
          <div className="flex h-32 items-center justify-center">
            <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
          </div>
        ) : notifications.length === 0 ? (
          <div className="flex h-32 flex-col items-center justify-center text-gray-500 dark:text-gray-400">
            <BellOff className="mb-2 h-8 w-8 opacity-50" />
            <p className="text-sm">No notifications yet</p>
          </div>
        ) : (
          <div className="flex flex-col divide-y divide-gray-100 dark:divide-dark-tertiary/50">
            {notifications.map((notification) => (
              <NotificationItem
                key={notification.id}
                notification={notification}
                onMarkAsRead={(id) => markAsRead(id)}
                onDelete={(id) => deleteNotification(id)}
                onClick={handleNotificationClick}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
