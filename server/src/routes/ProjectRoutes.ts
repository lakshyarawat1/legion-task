import { Router } from "express";
import {
  createProject,
  getProjects,
  getProjectById,
  updateProject,
  deleteProject,
} from "../controllers/ProjectController";
import { requireRole } from "../middleware/rbacMiddleware";
import { validateRequest } from "../middleware/validationMiddleware";
import { createProjectSchema, updateProjectSchema } from "../validation/projectValidation";

const router = Router();

router.get("/", getProjects);
router.post(
  "/",
  requireRole(["ADMIN", "PROJECT_MANAGER"]),
  validateRequest(createProjectSchema),
  createProject
);
router.get("/:id", getProjectById);
router.put(
  "/:id",
  requireRole(["ADMIN", "PROJECT_MANAGER"]),
  validateRequest(updateProjectSchema),
  updateProject
);
router.delete("/:id", requireRole(["ADMIN", "PROJECT_MANAGER"]), deleteProject);

export default router;