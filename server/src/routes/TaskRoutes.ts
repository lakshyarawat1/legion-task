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

const router = Router();

router.get("/", getTasks);
router.post("/", createTask);
router.get("/user/:userId", getTasksByUser);
router.get("/:taskId", getTaskById);
router.put("/:taskId", updateTask);
router.patch("/:taskId/status", updateTaskStatus);
router.delete("/:taskId", deleteTask);

export default router;