import { Request, Response } from "express";
import prisma from "../prisma";

export const getAttachments = async (
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

    const attachments = await prisma.attachment.findMany({
      where: {
        taskId: taskId,
      },
      include: {
        uploadedBy: true,
      },
    });
    res.json(attachments);
  } catch (error: any) {
    res.status(500).json({ message: `Error retrieving attachments: ${error.message}` });
  }
};

export const createAttachment = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { fileURL, fileName, taskId } = req.body;
  const currentUser = (req as any).user;

  if (!taskId || typeof taskId !== "string") {
    res.status(400).json({ error: "taskId is required." });
    return;
  }

  if (!fileURL || typeof fileURL !== "string") {
    res.status(400).json({ error: "fileURL is required." });
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

    const newAttachment = await prisma.attachment.create({
      data: {
        fileURL,
        fileName,
        taskId: taskId,
        uploadedById: currentUser.userId,
      },
    });
    res.status(201).json(newAttachment);
  } catch (error: any) {
    res.status(500).json({ message: `Error creating attachment: ${error.message}` });
  }
};
