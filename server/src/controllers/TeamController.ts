import { Request, Response } from "express";
import prisma from "../prisma";

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
  const { teamId } = req.params as { [key: string]: string };
  const currentUser = (req as any).user;

  try {
    const team = await prisma.team.findFirst({
      where: {
        id: teamId,
        orgId: currentUser.orgId,
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

export const createTeam = async (req: Request, res: Response): Promise<void> => {
  const { teamName, productOwnerUserId, projectManagerUserId } = req.body;
  try {
    const user = (req as any).user;
    const newTeam = await prisma.team.create({
      data: {
        teamName,
        productOwnerUserId: productOwnerUserId || null,
        projectManagerUserId: projectManagerUserId || null,
        orgId: user?.orgId || null,
      },
      include: {
        user: true,
        projectTeams: true
      }
    });
    res.status(201).json(newTeam);
  } catch (err) {
    res.status(500).json({ error: "Error creating team.", details: String(err) });
  }
};

export const deleteTeam = async (req: Request, res: Response): Promise<void> => {
  const { teamId } = req.params as { teamId: string };
  try {
    await prisma.$transaction(async (tx) => {
      // 1. Delete project-team relations
      await tx.projectTeam.deleteMany({
        where: { teamId },
      });
      // 2. Clear teamId field on users belonging to this team
      await tx.user.updateMany({
        where: { teamId },
        data: { teamId: null },
      });
      // 3. Delete the team itself
      await tx.team.delete({
        where: { id: teamId },
      });
    });
    res.json({ message: "Team deleted successfully." });
  } catch (err) {
    res.status(500).json({ error: "Error deleting team.", details: String(err) });
  }
};

export const updateTeam = async (req: Request, res: Response): Promise<void> => {
  const { teamId } = req.params as { teamId: string };
  const { teamName, productOwnerUserId, projectManagerUserId } = req.body;
  try {
    const updatedTeam = await prisma.team.update({
      where: { id: teamId },
      data: {
        teamName,
        productOwnerUserId: productOwnerUserId === null || productOwnerUserId === "none" ? null : productOwnerUserId,
        projectManagerUserId: projectManagerUserId === null || projectManagerUserId === "none" ? null : projectManagerUserId,
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
    res.json(updatedTeam);
  } catch (err) {
    res.status(500).json({ error: "Error updating team.", details: String(err) });
  }
};

export const addTeamMember = async (req: Request, res: Response): Promise<void> => {
  const { teamId } = req.params as { teamId: string };
  const { userId } = req.body as { userId: string };
  try {
    const updatedUser = await prisma.user.update({
      where: { userId },
      data: { teamId },
    });
    res.json(updatedUser);
  } catch (err) {
    res.status(500).json({ error: "Error adding team member.", details: String(err) });
  }
};

export const removeTeamMember = async (req: Request, res: Response): Promise<void> => {
  const { teamId, userId } = req.params as { teamId: string; userId: string };
  try {
    const user = await prisma.user.findUnique({
      where: { userId },
    });
    if (!user || user.teamId !== teamId) {
      res.status(400).json({ error: "User is not a member of this team." });
      return;
    }
    const updatedUser = await prisma.user.update({
      where: { userId },
      data: { teamId: null },
    });
    res.json(updatedUser);
  } catch (err) {
    res.status(500).json({ error: "Error removing team member.", details: String(err) });
  }
};
