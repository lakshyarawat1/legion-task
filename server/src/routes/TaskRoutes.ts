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
import { requireRole } from "../middleware/rbacMiddleware";

const router = Router();

router.get("/", getTasks);
router.post("/", requireRole(["ADMIN", "PROJECT_MANAGER", "MEMBER"]), validateRequest(createTaskSchema), createTask);
router.get("/user/:userId", getTasksByUser);
router.get("/:taskId", getTaskById);
router.put("/:taskId", requireRole(["ADMIN", "PROJECT_MANAGER", "MEMBER"]), validateRequest(updateTaskSchema), updateTask);
router.patch(
  "/:taskId/status",
  requireRole(["ADMIN", "PROJECT_MANAGER", "MEMBER"]),
  validateRequest(updateTaskStatusSchema),
  updateTaskStatus
);
router.delete("/:taskId", requireRole(["ADMIN", "PROJECT_MANAGER"]), deleteTask);

export default router;