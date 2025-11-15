import { Router } from "express";
import { createAgencyController, getAgencyController } from "../controllers/agencyController";
import { authMiddleware } from "../../../../middleware/auth";

const router = Router();

router.post("/", authMiddleware(["Recruiter"]), createAgencyController);
router.get("/:id", authMiddleware(["Recruiter", "Admin"]), getAgencyController);

export default router;
