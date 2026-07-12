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
    const tasks = await prisma.task.findMany({
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
    });

    const projects = await prisma.project.findMany({
      where: {
        orgId: orgId,
        OR: [
          { name: { contains: query, mode: "insensitive" } },
          { description: { contains: query, mode: "insensitive" } },
        ],
      },
    });

    const users = await prisma.user.findMany({
      where: {
        orgId: orgId,
        username: { contains: query, mode: "insensitive" },
      },
      include: {
        team: true,
      },
    });

    res.json({ tasks, projects, users });
  } catch (err) {
    res
      .status(500)
      .json({ error: "Error performing search.", details: String(err) });
  }
};
