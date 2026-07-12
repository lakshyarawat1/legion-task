import { Request, Response } from "express";
import prisma from "../prisma";

export const getTasks = async (req: Request, res: Response): Promise<void> => {
  try {
    const { projectId, priority } = req.query as { [key: string]: string };

    const where: Record<string, unknown> = {};

    if (projectId) {
      where.projectId = projectId;
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
  const { taskId } = req.params as { [key: string]: string };
  const currentUser = (req as any).user;

  try {
    const task = await prisma.task.findFirst({
      where: {
        id: taskId,
        project: { orgId: currentUser.orgId },
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
    assignedUserId,
  } = req.body;
  const currentUser = (req as any).user;

  try {
    const project = await prisma.project.findFirst({
      where: {
        id: projectId,
        orgId: currentUser.orgId,
      },
    });

    if (!project) {
      res.status(404).json({ error: "Project not found in your organization." });
      return;
    }

    const authorUserId = currentUser.userId;
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
  const { taskId } = req.params as { [key: string]: string };
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

    const updatedTask = await prisma.task.update({
      where: {
        id: taskId,
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
  const { taskId } = req.params as { [key: string]: string };
  const { status } = req.body;
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

    const updatedTask = await prisma.task.update({
      where: {
        id: taskId,
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
  const { taskId } = req.params as { [key: string]: string };
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

    await prisma.taskAssignment.deleteMany({
      where: { taskId: taskId },
    });
    await prisma.attachment.deleteMany({
      where: { taskId: taskId },
    });
    await prisma.comment.deleteMany({
      where: { taskId: taskId },
    });

    await prisma.task.delete({
      where: {
        id: taskId,
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
  const { userId } = req.params as { [key: string]: string };
  const currentUser = (req as any).user;

  try {
    const targetUser = await prisma.user.findFirst({
      where: {
        userId: userId,
        orgId: currentUser.orgId,
      },
    });

    if (!targetUser) {
      res.status(404).json({ error: "User not found in your organization." });
      return;
    }

    const tasks = await prisma.task.findMany({
      where: {
        project: { orgId: currentUser.orgId },
        OR: [
          { authorUserId: userId },
          { assignedUserId: userId },
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
      .json({ error: "Error retrieving user tasks.", details: String(err) });
  }
};