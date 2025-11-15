import { Router } from "express";
import {
  applyJob,
  updateApplication,
  getCandidateApplications,
  getJobApplications
} from "../controllers/applicationController";

import { authMiddleware } from "../../../middleware/auth";

const router = Router();

// Candidate routes
router.post("/", authMiddleware(["Candidate"]), applyJob);
router.get("/me", authMiddleware(["Candidate"]), getCandidateApplications);

// Employer routes
router.get("/job/:jobId", authMiddleware(["Employer"]), getJobApplications);
router.put("/:id", authMiddleware(["Employer"]), updateApplication);

export default router;
