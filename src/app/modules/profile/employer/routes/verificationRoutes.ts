import { Router } from "express";
import { createVerificationController, updateVerificationController } from "../controllers/verificationController";
import { authMiddleware } from "../../../../middleware/auth";

const router = Router();

router.post("/", authMiddleware(["Employer"]), createVerificationController);
router.put("/:id", authMiddleware(["Admin"]), updateVerificationController);

export default router;
