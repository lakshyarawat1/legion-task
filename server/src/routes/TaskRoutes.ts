import { Router } from "express";
import {
  createTask,
  getTasks,
  getTaskById,
  updateTask,
  updateTaskStatus,
  deleteTask,
  getTasksByUser,
} from "../controllers/TaskController";
import { validateRequest } from "../middleware/validationMiddleware";
import {
  createTaskSchema,
  updateTaskSchema,
  updateTaskStatusSchema,
} from "../validation/taskValidation";

const router = Router();

router.get("/", getTasks);
router.post("/", validateRequest(createTaskSchema), createTask);
router.get("/user/:userId", getTasksByUser);
router.get("/:taskId", getTaskById);
router.put("/:taskId", validateRequest(updateTaskSchema), updateTask);
router.patch(
  "/:taskId/status",
  validateRequest(updateTaskStatusSchema),
  updateTaskStatus
);
router.delete("/:taskId", deleteTask);

export default router;