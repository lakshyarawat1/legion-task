import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const createDevUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { username, role, orgId, teamId } = req.body;

    if (!username || !role) {
      res.status(400).json({ error: "username and role are required." });
      return;
    }

    const clerkUserId = `mock_user_${Math.random().toString(36).substring(2, 10)}`;

    const newUser = await prisma.user.create({
      data: {
        clerkUserId,
        username,
        role,
        orgId: orgId || null,
        teamId: teamId || null,
      },
    });

    res.status(201).json(newUser);
  } catch (error: any) {
    console.error(`Error creating dev user: ${error.message}`);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const updateDevUserRole = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.params.userId as string;
    const { role } = req.body;

    if (!role) {
      res.status(400).json({ error: "role is required." });
      return;
    }

    const updatedUser = await prisma.user.update({
      where: { userId },
      data: { role },
    });

    res.json(updatedUser);
  } catch (error: any) {
    console.error(`Error updating dev user role: ${error.message}`);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const getDevUsers = async (req: Request, res: Response): Promise<void> => {
  try {
    // Only return users if an orgId is provided to simulate tenant isolation
    const { orgId } = req.query;
    
    let whereClause = {};
    if (orgId && typeof orgId === 'string') {
      whereClause = { orgId };
    }

    const users = await prisma.user.findMany({
      where: whereClause,
      orderBy: { username: 'asc' }
    });

    res.json(users);
  } catch (error: any) {
    console.error(`Error fetching dev users: ${error.message}`);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
