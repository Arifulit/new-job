import { Router } from "express";
import { uploadResumeController, getResumeController } from "../controllers/resumeController";
import { authMiddleware } from "../../../../middleware/auth";

const router = Router();

router.post("/", authMiddleware(["Candidate"]), uploadResumeController);
router.get("/:candidateId", authMiddleware(["Candidate", "Admin"]), getResumeController);

export default router;
