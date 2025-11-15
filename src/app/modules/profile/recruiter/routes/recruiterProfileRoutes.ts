import { Router } from "express";
import {
  createRecruiterProfileController,
  getRecruiterProfileController,
  updateRecruiterProfileController
} from "../controllers/recruiterProfileController";
import { authMiddleware } from "../../../../middleware/auth";

const router = Router();

router.post("/", authMiddleware(["Recruiter"]), createRecruiterProfileController);
router.get("/:userId", authMiddleware(["Recruiter", "Admin"]), getRecruiterProfileController);
router.put("/:userId", authMiddleware(["Recruiter"]), updateRecruiterProfileController);

export default router;
