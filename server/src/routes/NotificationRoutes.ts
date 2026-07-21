import { Router } from "express";
import {
  getNotifications,
  getUnreadCount,
  markAsRead,
  markAllAsRead,
  deleteNotification,
  streamNotifications
} from "../controllers/NotificationController";
import {
  getNotificationsValidation,
  notificationIdValidation
} from "../validation/notificationValidation";

const router = Router();

// SSE Stream Endpoint (must be registered before /:notificationId routes to prevent conflict)
router.get("/stream", streamNotifications);

router.get("/", getNotificationsValidation, getNotifications);
router.get("/unread-count", getUnreadCount);
router.patch("/read-all", markAllAsRead);
router.patch("/:notificationId/read", notificationIdValidation, markAsRead);
router.delete("/:notificationId", notificationIdValidation, deleteNotification);

export default router;
