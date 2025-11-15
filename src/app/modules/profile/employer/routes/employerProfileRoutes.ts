import { Router } from "express";
import {
  createEmployerProfileController,
  getEmployerProfileController,
  updateEmployerProfileController
} from "../controllers/employerProfileController";
import { authMiddleware } from "../../../../middleware/auth";

const router = Router();

router.post("/", authMiddleware(["Employer"]), createEmployerProfileController);
router.get("/:userId", authMiddleware(["Employer", "Admin"]), getEmployerProfileController);
router.put("/:userId", authMiddleware(["Employer"]), updateEmployerProfileController);

export default router;
