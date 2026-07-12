import { Request, Response } from "express";
import prisma from "../prisma";
import crypto from "crypto";

// Helper to generate a 6-character random invite code
const generateInviteCode = () => {
  return crypto.randomBytes(3).toString("hex").toUpperCase(); // e.g. 'A1B2C3'
};

export const createOrg = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name } = req.body;
    const user = (req as any).user;

    if (!user) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }

    if (!name) {
      res.status(400).json({ error: "Organization name is required." });
      return;
    }

    // Generate unique invite code with retry logic
    let inviteCode = "";
    let isUnique = false;
    let attempts = 0;

    while (!isUnique && attempts < 10) {
      inviteCode = generateInviteCode();
      const existing = await prisma.organization.findUnique({
        where: { inviteCode },
      });
      if (!existing) {
        isUnique = true;
      }
      attempts++;
    }

    if (!isUnique) {
      res.status(500).json({ error: "Failed to generate a unique invite code after multiple attempts." });
      return;
    }

    // Create the org
    const org = await prisma.organization.create({
      data: {
        name,
        inviteCode,
      },
    });

    // Update the user's orgId
    const updatedUser = await prisma.user.update({
      where: { userId: user.userId },
      data: { orgId: org.id },
      include: { organization: true },
    });

    res.status(201).json({ user: updatedUser, organization: org });
  } catch (err) {
    res
      .status(500)
      .json({ error: "Error creating organization.", details: String(err) });
  }
};

export const joinOrg = async (req: Request, res: Response): Promise<void> => {
  try {
    const { inviteCode } = req.body;
    const user = (req as any).user;

    if (!user) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }

    if (!inviteCode) {
      res.status(400).json({ error: "Invite code is required." });
      return;
    }

    const org = await prisma.organization.findUnique({
      where: { inviteCode: inviteCode.toUpperCase().trim() },
    });

    if (!org) {
      res.status(404).json({ error: "Organization not found for that invite code." });
      return;
    }

    // Update the user's orgId
    const updatedUser = await prisma.user.update({
      where: { userId: user.userId },
      data: { orgId: org.id },
      include: { organization: true },
    });

    res.json({ user: updatedUser, organization: org });
  } catch (err) {
    res
      .status(500)
      .json({ error: "Error joining organization.", details: String(err) });
  }
};

export const getMe = async (req: Request, res: Response): Promise<void> => {
  try {
    const user = (req as any).user;

    if (!user) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }

    // Return the user with their organization details
    const fullUser = await prisma.user.findUnique({
      where: { userId: user.userId },
      include: { organization: true },
    });

    res.json(fullUser);
  } catch (err) {
    res.status(500).json({ error: "Error fetching user info." });
  }
};
