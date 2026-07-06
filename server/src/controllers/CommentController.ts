import { Request, Response } from "express";
import prisma from "../prisma";

export const getComments = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { taskId } = req.query;

  try {
    const comments = await prisma.comment.findMany({
      where: {
        taskId: Number(taskId),
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
  const user = (req as any).user;

  try {
    const newComment = await prisma.comment.create({
      data: {
        text,
        taskId: Number(taskId),
        userId: user.userId,
      },
    });
    res.status(201).json(newComment);
  } catch (error: any) {
    res.status(500).json({ message: `Error creating comment: ${error.message}` });
  }
};
