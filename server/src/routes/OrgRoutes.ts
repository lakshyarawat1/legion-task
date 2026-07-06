import { Router } from "express";
import { createOrg, joinOrg, getMe } from "../controllers/OrgController";

const router = Router();

router.get("/me", getMe);
router.post("/create", createOrg);
router.post("/join", joinOrg);

export default router;
