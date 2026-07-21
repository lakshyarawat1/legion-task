import { Router } from "express";
import { getUsers, getUserById, updateUser } from "../controllers/UserController";

const router = Router();

router.get("/", getUsers);
router.get("/:userId", getUserById);
router.patch("/:userId", updateUser);

export default router;
