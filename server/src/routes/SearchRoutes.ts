import { Router } from "express";
import { search } from "../controllers/SearchController";

const router = Router();

router.get("/", search);

export default router;
