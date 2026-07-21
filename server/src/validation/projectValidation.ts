import { z } from "zod";

const dateSchema = z.preprocess((val) => {
  if (typeof val === "string" && val.trim() !== "") {
    const parsed = Date.parse(val);
    if (!isNaN(parsed)) {
      return new Date(parsed);
    }
  }
  return val;
}, z.date({ message: "Invalid date format" }).optional().nullable());

export const createProjectSchema = z.object({
  body: z.object({
    name: z.string().min(1, "Project name is required").max(255),
    prefix: z.string().max(5, "Prefix cannot exceed 5 characters").optional().nullable(),
    description: z.string().optional().nullable(),
    startDate: dateSchema,
    endDate: dateSchema,
  }),
});

export const updateProjectSchema = z.object({
  body: z.object({
    name: z.string().min(1, "Project name is required").max(255).optional(),
    prefix: z.string().max(5, "Prefix cannot exceed 5 characters").optional().nullable(),
    description: z.string().optional().nullable(),
    startDate: dateSchema,
    endDate: dateSchema,
  }),
});
