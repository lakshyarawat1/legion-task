import { Request, Response } from "express";
import prisma from "../prisma";

export const getUsers = async (req: Request, res: Response): Promise<void> => {
  try {
    const users = await prisma.user.findMany({
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
  const { userId } = req.params;

  try {
    const user = await prisma.user.findUnique({
      where: {
        userId: Number(userId),
      },
      include: {
        team: true,
        authoredTasks: {
          include: {
            project: true,
          },
        },
        assignedTasks: {
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
