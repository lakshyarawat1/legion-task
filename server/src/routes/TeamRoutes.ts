import { Router } from "express";
import { getTeams, getTeamById, createTeam, deleteTeam, updateTeam, addTeamMember, removeTeamMember } from "../controllers/TeamController";

const router = Router();

router.get("/", getTeams);
router.post("/", createTeam);
router.get("/:teamId", getTeamById);
router.delete("/:teamId", deleteTeam);
router.patch("/:teamId", updateTeam);
router.post("/:teamId/members", addTeamMember);
router.delete("/:teamId/members/:userId", removeTeamMember);

export default router;
