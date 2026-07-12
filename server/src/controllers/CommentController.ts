import { Request, Response } from "express";
import prisma from "../prisma";

export const getComments = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { taskId } = req.query as { [key: string]: string };
  const currentUser = (req as any).user;

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

    const comments = await prisma.comment.findMany({
      where: {
        taskId: taskId,
      },
      include: {
        user: true,
      },
    });
    res.json(comments);
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
  } catch (error: any) {
    res.status(500).json({ message: `Error creating comment: ${error.message}` });
  }
};
