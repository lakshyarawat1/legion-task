import { Request, Response } from "express";
import { NotificationService } from "../services/NotificationService";
import { sseManager } from "../services/SSEManager";
import { validationResult } from "express-validator";

export const getNotifications = async (req: Request, res: Response): Promise<void> => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() });
      return;
    }

    const { userId, orgId } = (req as any).user;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const unreadOnly = req.query.unreadOnly === "true";

    const result = await NotificationService.getForUser(userId, orgId, page, limit, unreadOnly);
    res.json(result);
  } catch (error: any) {
    console.error("[NotificationController] Error getting notifications:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getUnreadCount = async (req: Request, res: Response): Promise<void> => {
  try {
    const { userId, orgId } = (req as any).user;
    const unreadCount = await NotificationService.getUnreadCount(userId, orgId);
    res.json({ unreadCount });
  } catch (error: any) {
    console.error("[NotificationController] Error getting unread count:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const markAsRead = async (req: Request, res: Response): Promise<void> => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() });
      return;
    }

    const { userId } = (req as any).user;
    const { notificationId } = req.params;

    const notification = await NotificationService.markAsRead(notificationId as string, userId);
    res.json({ notification });
  } catch (error: any) {
    if (error.message === "NOT_FOUND") {
      res.status(404).json({ message: "Notification not found" });
      return;
    }
    console.error("[NotificationController] Error marking as read:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const markAllAsRead = async (req: Request, res: Response): Promise<void> => {
  try {
    const { userId, orgId } = (req as any).user;
    const updatedCount = await NotificationService.markAllAsRead(userId, orgId);
    res.json({ updatedCount });
  } catch (error: any) {
    console.error("[NotificationController] Error marking all as read:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const deleteNotification = async (req: Request, res: Response): Promise<void> => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() });
      return;
    }

    const { userId } = (req as any).user;
    const { notificationId } = req.params;

    await NotificationService.delete(notificationId as string, userId);
    res.json({ message: "Notification deleted" });
  } catch (error: any) {
    if (error.message === "NOT_FOUND") {
      res.status(404).json({ message: "Notification not found" });
      return;
    }
    console.error("[NotificationController] Error deleting notification:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const streamNotifications = async (req: Request, res: Response): Promise<void> => {
  try {
    const { userId } = (req as any).user;

    res.writeHead(200, {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      "Connection": "keep-alive",
      "X-Accel-Buffering": "no",
    });

    sseManager.addConnection(userId, res);

    req.on("close", () => {
      sseManager.removeConnection(userId, res);
    });
  } catch (error: any) {
    console.error("[NotificationController] Error in SSE stream:", error);
    if (!res.headersSent) {
      res.status(500).json({ message: "Internal server error" });
    }
  }
};
