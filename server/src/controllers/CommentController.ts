import { Request, Response } from "express";
import prisma from "../prisma";
import { NotificationService } from "../services/NotificationService";

export const getComments = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { taskId } = req.query as { [key: string]: string };
  const currentUser = (req as any).user;

  if (!taskId || typeof taskId !== "string") {
    res.status(400).json({ error: "taskId query parameter is required." });
    return;
  }

  try {
    const page = parseInt((req.query.page as string) || "1", 10);
    const limit = parseInt((req.query.limit as string) || "20", 10);
    const order = (req.query.order as string) === "desc" ? "desc" : "asc";
    const skip = (page - 1) * limit;

    const task = await prisma.task.findFirst({
      where: {
        id: taskId,
        project: { orgId: currentUser.orgId },
      },
    });

    if (!task) {
      res.status(404).json({ error: "Task not found in your organization." });
      return;
    }

    const [comments, total] = await Promise.all([
      prisma.comment.findMany({
        where: {
          taskId: taskId,
        },
        include: {
          user: true,
        },
        orderBy: {
          createdAt: order,
        },
        skip,
        take: limit,
      }),
      prisma.comment.count({
        where: {
          taskId: taskId,
        },
      }),
    ]);

    res.json({
      comments,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error: any) {
    res.status(500).json({ message: `Error retrieving comments: ${error.message}` });
  }
};

export const createComment = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { text, taskId } = req.body;
  const currentUser = (req as any).user;

  if (!taskId || typeof taskId !== "string") {
    res.status(400).json({ error: "taskId is required." });
    return;
  }

  if (!text || typeof text !== "string") {
    res.status(400).json({ error: "Comment text is required." });
    return;
  }

  try {
    const task = await prisma.task.findFirst({
      where: {
        id: taskId,
        project: { orgId: currentUser.orgId },
      },
    });

    if (!task) {
      res.status(404).json({ error: "Task not found in your organization." });
      return;
    }

    const newComment = await prisma.comment.create({
      data: {
        text,
        taskId: taskId,
        userId: currentUser.userId,
      },
    });
    res.status(201).json(newComment);

    const notifyUsers = new Set<string>();
    if (task.authorUserId !== currentUser.userId) notifyUsers.add(task.authorUserId);
    if (task.assignedUserId && task.assignedUserId !== currentUser.userId) notifyUsers.add(task.assignedUserId);

    notifyUsers.forEach((userId) => {
      NotificationService.create({
        type: "TASK_COMMENT",
        title: "New Comment",
        message: `New comment on **${task.title}**`,
        userId,
        actorId: currentUser.userId,
        resourceType: "TASK",
        resourceId: taskId,
        orgId: currentUser.orgId,
      });
    });
  } catch (error: any) {
    res.status(500).json({ message: `Error creating comment: ${error.message}` });
  }
};
