import { Request, Response } from "express";
import prisma from "../prisma";
import { getAuth } from "@clerk/express";

export const getTasks = async (req: Request, res: Response): Promise<void> => {
  try {
    const { projectId, priority } = req.query;

    const where: Record<string, unknown> = {};

    if (projectId) {
      where.projectId = Number(projectId);
    }

    if (priority && typeof priority === "string") {
      where.priority = priority;
    }

    const user = (req as any).user;
    where.project = {
      orgId: user?.orgId || null,
    };

    const tasks = await prisma.task.findMany({
      where,
      include: {
        author: true,
        assignee: true,
        comments: true,
        attachments: true,
        project: true,
      },
    });
    res.json(tasks);
  } catch (err) {
    res
      .status(500)
      .json({ error: "Error retrieving tasks.", details: String(err) });
  }
};

export const getTaskById = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { taskId } = req.params;

  try {
    const task = await prisma.task.findUnique({
      where: {
        id: Number(taskId),
      },
      include: {
        author: true,
        assignee: true,
        comments: {
          include: {
            user: true,
          },
        },
        attachments: {
          include: {
            uploadedBy: true,
          },
        },
        project: true,
        taskAssignments: {
          include: {
            user: true,
          },
        },
      },
    });

    if (!task) {
      res.status(404).json({ error: "Task not found." });
      return;
    }

    res.json(task);
  } catch (err) {
    res
      .status(500)
      .json({ error: "Error retrieving task.", details: String(err) });
  }
};

export const createTask = async (
  req: Request,
  res: Response
): Promise<void> => {
  const {
    title,
    description,
    status,
    priority,
    tags,
    startDate,
    dueDate,
    points,
    projectId,
    authorUserId,
    assignedUserId,
  } = req.body;

  try {
    const newTask = await prisma.task.create({
      data: {
        title,
        description,
        status,
        priority,
        tags,
        startDate,
        dueDate,
        points,
        projectId,
        authorUserId,
        assignedUserId,
      },
    });
    res.status(201).json(newTask);
  } catch (err) {
    res
      .status(500)
      .json({ error: "Error creating task.", details: String(err) });
  }
};

export const updateTask = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { taskId } = req.params;
  const {
    title,
    description,
    status,
    priority,
    tags,
    startDate,
    dueDate,
    points,
    assignedUserId,
  } = req.body;

  try {
    const updatedTask = await prisma.task.update({
      where: {
        id: Number(taskId),
      },
      data: {
        title,
        description,
        status,
        priority,
        tags,
        startDate,
        dueDate,
        points,
        assignedUserId,
      },
    });
    res.json(updatedTask);
  } catch (err) {
    res
      .status(500)
      .json({ error: "Error updating task.", details: String(err) });
  }
};

export const updateTaskStatus = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { taskId } = req.params;
  const { status } = req.body;

  try {
    const updatedTask = await prisma.task.update({
      where: {
        id: Number(taskId),
      },
      data: {
        status: status as string,
      },
    });
    res.json(updatedTask);
  } catch (err) {
    res.status(500).json({ error: "Error updating task status." });
  }
};

export const deleteTask = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { taskId } = req.params;

  try {
    // Delete related records first to avoid FK constraint errors
    await prisma.taskAssignment.deleteMany({
      where: { taskId: Number(taskId) },
    });
    await prisma.attachment.deleteMany({
      where: { taskId: Number(taskId) },
    });
    await prisma.comment.deleteMany({
      where: { taskId: Number(taskId) },
    });

    await prisma.task.delete({
      where: {
        id: Number(taskId),
      },
    });
    res.status(204).send();
  } catch (err) {
    res
      .status(500)
      .json({ error: "Error deleting task.", details: String(err) });
  }
};

export const getTasksByUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { userId } = req.params;

  try {
    const tasks = await prisma.task.findMany({
      where: {
        OR: [
          { authorUserId: Number(userId) },
          { assignedUserId: Number(userId) },
        ],
      },
      include: {
        author: true,
        assignee: true,
        project: true,
        comments: true,
        attachments: true,
      },
    });
    res.json(tasks);
  } catch (err) {
    res
      .status(500)
      .json({
        error: "Error retrieving tasks for user.",
        details: String(err),
      });
  }
};