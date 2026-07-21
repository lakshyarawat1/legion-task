import { PrismaClient } from "@prisma/client";
import { sseManager } from "./SSEManager";

const prisma = new PrismaClient();

export class NotificationService {
  /**
   * Create a new notification and emit it via SSE.
   * This method is designed to be fire-and-forget; errors are caught and logged
   * so they do not interrupt the primary request flow.
   */
  public static async create(params: {
    type: string;
    title: string;
    message: string;
    userId: string;
    actorId?: string;
    resourceType?: string;
    resourceId?: string;
    orgId?: string;
  }): Promise<void> {
    try {
      const notification = await prisma.notification.create({
        data: {
          type: params.type,
          title: params.title,
          message: params.message,
          userId: params.userId,
          actorId: params.actorId,
          resourceType: params.resourceType,
          resourceId: params.resourceId,
          orgId: params.orgId,
        },
        include: {
          actor: {
            select: {
              userId: true,
              username: true,
              profilePictureUrl: true,
            },
          },
        },
      });

      // Emit the notification in real-time
      sseManager.sendToUser(params.userId, "notification", notification);
    } catch (error) {
      console.error("[NotificationService] Failed to create notification:", error);
    }
  }

  /**
   * Fetch paginated notifications for a user.
   */
  public static async getForUser(
    userId: string,
    orgId: string | undefined,
    page: number = 1,
    limit: number = 20,
    unreadOnly: boolean = false
  ) {
    const skip = (page - 1) * limit;
    const whereClause: any = { userId };
    
    if (orgId) {
      whereClause.orgId = orgId;
    }
    
    if (unreadOnly) {
      whereClause.isRead = false;
    }

    const [notifications, total] = await Promise.all([
      prisma.notification.findMany({
        where: whereClause,
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
        include: {
          actor: {
            select: {
              userId: true,
              username: true,
              profilePictureUrl: true,
            },
          },
        },
      }),
      prisma.notification.count({ where: whereClause }),
    ]);

    const unreadCount = await prisma.notification.count({
      where: { userId, orgId, isRead: false },
    });

    return {
      notifications,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
      unreadCount,
    };
  }

  /**
   * Get only the unread count for a user (lightweight for badge).
   */
  public static async getUnreadCount(userId: string, orgId: string | undefined) {
    const count = await prisma.notification.count({
      where: { userId, orgId, isRead: false },
    });
    return count;
  }

  /**
   * Mark a specific notification as read.
   */
  public static async markAsRead(notificationId: string, userId: string) {
    const notification = await prisma.notification.findUnique({
      where: { id: notificationId },
    });

    if (!notification || notification.userId !== userId) {
      throw new Error("NOT_FOUND");
    }

    return prisma.notification.update({
      where: { id: notificationId },
      data: { isRead: true, readAt: new Date() },
    });
  }

  /**
   * Mark all unread notifications as read for a user.
   */
  public static async markAllAsRead(userId: string, orgId: string | undefined) {
    const result = await prisma.notification.updateMany({
      where: { userId, orgId, isRead: false },
      data: { isRead: true, readAt: new Date() },
    });
    return result.count;
  }

  /**
   * Delete a notification permanently.
   */
  public static async delete(notificationId: string, userId: string) {
    const notification = await prisma.notification.findUnique({
      where: { id: notificationId },
    });

    if (!notification || notification.userId !== userId) {
      throw new Error("NOT_FOUND");
    }

    await prisma.notification.delete({
      where: { id: notificationId },
    });
  }
}
