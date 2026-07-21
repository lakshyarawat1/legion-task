import { Router } from "express";
import { getTeams, getTeamById, createTeam, deleteTeam, updateTeam, addTeamMember, removeTeamMember } from "../controllers/TeamController";
import { requireRole } from "../middleware/rbacMiddleware";
import { validateRequest } from "../middleware/validationMiddleware";
import { createTeamSchema, updateTeamSchema } from "../validation/teamValidation";

const router = Router();

router.get("/", getTeams);
router.post("/", requireRole(["ADMIN"]), validateRequest(createTeamSchema), createTeam);
router.get("/:teamId", getTeamById);
router.delete("/:teamId", requireRole(["ADMIN"]), deleteTeam);
router.patch("/:teamId", requireRole(["ADMIN"]), validateRequest(updateTeamSchema), updateTeam);
router.post("/:teamId/members", requireRole(["ADMIN"]), addTeamMember);
router.delete("/:teamId/members/:userId", requireRole(["ADMIN"]), removeTeamMember);

export default router;
