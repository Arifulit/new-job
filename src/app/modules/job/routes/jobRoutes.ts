import { Router } from "express";
import { createJob, updateJob, getJobs, getJobById, deleteJob } from "../controllers/jobController";
import { authMiddleware } from "../../../middleware/auth";

const router = Router();

router.get("/", getJobs);
router.get("/:id", getJobById);

// Employer only routes
router.post("/", authMiddleware(["employer"]), createJob);
router.put("/:id", authMiddleware(["employer"]), updateJob);
router.delete("/:id", authMiddleware(["employer"]), deleteJob);

export default router;
