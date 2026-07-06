import { Router } from "express";
import { getTeams, getTeamById } from "../controllers/TeamController";

const router = Router();

router.get("/", getTeams);
router.get("/:teamId", getTeamById);

export default router;
