import { Router } from "express";
import { createDevUser, updateDevUserRole, getDevUsers } from "../controllers/DevController";

const router = Router();

// These routes should only be mounted if process.env.NODE_ENV !== "production"
router.get("/users", getDevUsers);
router.post("/users", createDevUser);
router.patch("/users/:userId/role", updateDevUserRole);

export default router;
