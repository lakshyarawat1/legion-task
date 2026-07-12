import { z } from "zod";

const taskStatusEnum = z.enum(["To Do", "Work In Progress", "Under Review", "Completed"]);
const taskPriorityEnum = z.enum(["Urgent", "High", "Medium", "Low", "Backlog"]);

export const createTaskSchema = z.object({
  body: z.object({
    title: z.string().min(1, "Title is required").max(255),
    description: z.string().optional(),
    status: taskStatusEnum.optional(),
    priority: taskPriorityEnum.optional(),
    tags: z.string().optional(),
    startDate: z.string().datetime({ precision: 3 }).optional().or(z.string().nullable()),
    dueDate: z.string().datetime({ precision: 3 }).optional().or(z.string().nullable()),
    points: z.number().int().nonnegative().optional(),
    projectId: z.string().uuid("Invalid project ID format"),
    assignedUserId: z.string().uuid("Invalid assignee ID format").nullable().optional(),
  }),
});

export const updateTaskSchema = z.object({
  body: z.object({
    title: z.string().min(1).max(255).optional(),
    description: z.string().optional(),
    status: taskStatusEnum.optional(),
    priority: taskPriorityEnum.optional(),
    tags: z.string().optional(),
    startDate: z.string().datetime({ precision: 3 }).optional().or(z.string().nullable()),
    dueDate: z.string().datetime({ precision: 3 }).optional().or(z.string().nullable()),
    points: z.number().int().nonnegative().optional(),
    assignedUserId: z.string().uuid("Invalid assignee ID format").nullable().optional(),
  }),
});

export const updateTaskStatusSchema = z.object({
  body: z.object({
    status: taskStatusEnum,
  }),
});
