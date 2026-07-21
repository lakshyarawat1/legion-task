import { Request, Response } from "express";
import prisma from "../prisma";

export const search = async (req: Request, res: Response): Promise<void> => {
  const { query } = req.query as { [key: string]: string };
  const user = (req as any).user;
  const orgId = user?.orgId || null;

  if (!query || typeof query !== "string") {
    res.status(400).json({ error: "Search query is required." });
    return;
  }

  try {
    let tasks: any[] = [];
    let projects: any[] = [];
    let users: any[] = [];

    const displayIdMatch = query.match(/^([A-Za-z]+)-(\d+)$/);
    let exactTask = null;

    if (displayIdMatch) {
      const [, prefix, numberStr] = displayIdMatch;
      const taskNumber = parseInt(numberStr, 10);

      exactTask = await prisma.task.findFirst({
        where: {
          taskNumber,
          project: {
            prefix: { equals: prefix, mode: "insensitive" },
            orgId,
          },
        },
        include: { project: true, author: true, assignee: true },
      });
    }

    const [fuzzyTasks, fuzzyProjects, fuzzyUsers] = await Promise.all([
      prisma.task.findMany({
        where: {
          project: {
            orgId: orgId,
          },
          OR: [
            { title: { contains: query, mode: "insensitive" } },
            { description: { contains: query, mode: "insensitive" } },
          ],
        },
        include: {
          project: true,
          author: true,
          assignee: true,
        },
      }),
      prisma.project.findMany({
        where: {
          orgId: orgId,
          OR: [
            { name: { contains: query, mode: "insensitive" } },
            { description: { contains: query, mode: "insensitive" } },
          ],
        },
      }),
      prisma.user.findMany({
        where: {
          orgId: orgId,
          username: { contains: query, mode: "insensitive" },
        },
        include: {
          team: true,
        },
      }),
    ]);

    tasks = fuzzyTasks;
    projects = fuzzyProjects;
    users = fuzzyUsers;

    if (exactTask) {
      tasks = [exactTask, ...fuzzyTasks.filter(t => t.id !== exactTask?.id)];
    }

    res.json({ tasks, projects, users });
  } catch (err) {
    res
      .status(500)
      .json({ error: "Error performing search.", details: String(err) });
  }
};
