import { Router } from "express";
import { authMiddleware, optionalAuth } from "../../../../middleware/auth";
import {
  createAdminController,
  getAdminController,
  updateAdminController,
  getAllAdminsController
} from "../controllers/adminProfileController";

const router = Router();

// Protected routes (require admin role for create/update/delete)
router.post("/", authMiddleware(["admin"]), createAdminController);
router.put("/:id", authMiddleware(["admin"]), updateAdminController);

// Allow both admin and user roles to view admin profiles
router.get("/", authMiddleware(["admin", "user"]), getAllAdminsController);

// Public route to get admin profile by ID (optional auth, but requires auth for certain operations)
router.get("/:id", optionalAuth, getAdminController);

export default router;
