import { Router } from "express";
import { getAttachments, createAttachment } from "../controllers/AttachmentController";

const router = Router();

router.get("/", getAttachments);
router.post("/", createAttachment);

export default router;
