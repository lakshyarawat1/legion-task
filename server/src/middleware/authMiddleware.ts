import { clerkMiddleware, getAuth } from "@clerk/express";
import { Request, Response, NextFunction } from "express";
import prisma from "../prisma";

export const requireAuthMiddleware = (req: Request, res: Response, next: NextFunction): void => {
  const auth = getAuth(req);
  
  if (!auth || !auth.userId) {
    res.status(401).json({ 
      message: "Unauthorized - No Clerk user ID", 
      debugAuth: auth, 
      debugHeaders: req.headers.authorization 
    });
    return;
  }
  next();
};

export const requireLocalUser = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const auth = getAuth(req);
    if (!auth || !auth.userId) {
      res.status(401).json({ message: "Unauthorized - No Clerk user ID" });
      return;
    }

    let user = await prisma.user.findUnique({
      where: { clerkUserId: auth.userId },
    });

    if (!user) {
      // Create user if they don't exist locally yet
      user = await prisma.user.create({
        data: {
          clerkUserId: auth.userId,
          username: `user_${auth.userId.substring(5, 12)}`,
        },
      });
    }

    (req as any).user = user;
    next();
  } catch (error) {
    res.status(500).json({ message: "Error verifying local user" });
  }
};
