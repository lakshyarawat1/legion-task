import { Request, Response, NextFunction } from "express";
import { ZodType, ZodError, ZodIssue } from "zod";

export const validateRequest = (schema: ZodType<any, any, any>) => {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      await schema.parseAsync({
        body: req.body,
        query: req.query,
        params: req.params,
      });
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        res.status(400).json({
          error: "Validation failed.",
          details: error.issues.map((issue: ZodIssue) => ({
            path: issue.path.join("."),
            message: issue.message,
          })),
        });
        return;
      }
      res.status(500).json({ error: "Internal validation error." });
    }
  };
};
