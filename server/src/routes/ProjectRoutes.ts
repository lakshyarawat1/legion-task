import { Router } from "express";
import { getProjects } from "../controllers/ProjectController";

const router = Router();

router.get("/", getProjects);

export default router;