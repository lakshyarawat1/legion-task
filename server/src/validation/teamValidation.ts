import { z } from "zod";

export const createTeamSchema = z.object({
  body: z.object({
    teamName: z.string().min(1, "Team name is required").max(255),
    productOwnerUserId: z.string().optional().nullable(),
    projectManagerUserId: z.string().optional().nullable(),
  }),
});

export const updateTeamSchema = z.object({
  body: z.object({
    teamName: z.string().min(1, "Team name is required").max(255).optional(),
    productOwnerUserId: z.string().optional().nullable(),
    projectManagerUserId: z.string().optional().nullable(),
  }),
});
