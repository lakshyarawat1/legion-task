import { Request, Response } from "express";
import prisma from "../prisma";
import { getAuth } from "@clerk/express";

export const getTeams = async (req: Request, res: Response): Promise<void> => {
  try {
    const user = (req as any).user;
    const teams = await prisma.team.findMany({
      where: {
        orgId: user?.orgId || null,
      },
      include: {
        user: true,
        projectTeams: {
          include: {
            project: true,
          },
        },
      },
    });
    res.json(teams);
  } catch (err) {
    res
      .status(500)
      .json({ error: "Error retrieving teams.", details: String(err) });
  }
};

export const getTeamById = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { teamId } = req.params;

  try {
    const team = await prisma.team.findUnique({
      where: {
        id: Number(teamId),
      },
      include: {
        user: true,
        projectTeams: {
          include: {
            project: true,
          },
        },
      },
    });

    if (!team) {
      res.status(404).json({ error: "Team not found." });
      return;
    }

    res.json(team);
  } catch (err) {
    res
      .status(500)
      .json({ error: "Error retrieving team.", details: String(err) });
  }
};
