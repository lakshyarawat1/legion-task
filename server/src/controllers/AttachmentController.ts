import { Request, Response } from "express";
import prisma from "../prisma";

export const getAttachments = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { taskId } = req.query;

  try {
    const attachments = await prisma.attachment.findMany({
      where: {
        taskId: Number(taskId),
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
  const user = (req as any).user;

  try {
    const newAttachment = await prisma.attachment.create({
      data: {
        fileURL,
        fileName,
        taskId: Number(taskId),
        uploadedById: user.userId,
      },
    });
    res.status(201).json(newAttachment);
  } catch (error: any) {
    res.status(500).json({ message: `Error creating attachment: ${error.message}` });
  }
};
