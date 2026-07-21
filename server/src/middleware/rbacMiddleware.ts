import { Request, Response, NextFunction } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const requireRole = (allowedRoles: string[]) => {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      let user = (req as any).user;
      
      if (!user) {
        const auth = (req as any).auth;
        if (!auth || !auth.userId) {
          res.status(401).json({ error: "Unauthorized. User ID not found." });
          return;
        }

        user = await prisma.user.findUnique({
          where: { clerkUserId: auth.userId },
        });

        if (!user) {
          res.status(404).json({ error: "User not found." });
          return;
        }
        
        (req as any).user = user;
      }

      if (!allowedRoles.includes(user.role)) {
        res.status(403).json({ 
          error: "Forbidden", 
          message: `Access denied. Requires one of: ${allowedRoles.join(', ')}. Your role: ${user.role}` 
        });
        return;
      }

      next();
    } catch (error: any) {
      console.error(`Error in RBAC middleware: ${error.message}`);
      res.status(500).json({ error: "Internal Server Error" });
    }
  };
};
