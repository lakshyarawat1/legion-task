import { Request, Response } from "express";
import prisma from "../prisma";

export const getUsers = async (req: Request, res: Response): Promise<void> => {
  try {
    const user = (req as any).user;
    const users = await prisma.user.findMany({
      where: {
        orgId: user?.orgId || null,
      },
      include: {
        team: true,
      },
    });
    res.json(users);
  } catch (err) {
    res
      .status(500)
      .json({ error: "Error retrieving users.", details: String(err) });
  }
};

export const getUserById = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { userId } = req.params as { [key: string]: string };
  const currentUser = (req as any).user;

  try {
    const user = await prisma.user.findFirst({
      where: {
        userId: userId,
        orgId: currentUser.orgId,
      },
      include: {
        team: true,
        authoredTasks: {
          where: {
            project: { orgId: currentUser.orgId },
          },
          include: {
            project: true,
          },
        },
        assignedTasks: {
          where: {
            project: { orgId: currentUser.orgId },
          },
          include: {
            project: true,
          },
        },
      },
    });

    if (!user) {
      res.status(404).json({ error: "User not found." });
      return;
    }

    res.json(user);
  } catch (err) {
    res
      .status(500)
      .json({ error: "Error retrieving user.", details: String(err) });
  }
};

export const updateUser = async (req: Request, res: Response): Promise<void> => {
  const { userId } = req.params as { userId: string };
  const { username } = req.body;
  const currentUser = (req as any).user;

  try {
    const user = await prisma.user.findFirst({
      where: {
        userId: userId,
        orgId: currentUser.orgId,
      },
    });

    if (!user) {
      res.status(404).json({ error: "User not found in your organization." });
      return;
    }

    const updatedUser = await prisma.user.update({
      where: { userId },
      data: { username },
    });
    res.json(updatedUser);
  } catch (err) {
    res
      .status(500)
      .json({ error: "Error updating user.", details: String(err) });
  }
};
