import { Router } from "express";
import { authMiddleware } from "../../../../middleware/auth";
import {
  createAdminController,
  getAdminController,
  updateAdminController,
  getAllAdminsController
} from "../controllers/adminProfileController";

const router = Router();

router.post("/", authMiddleware(["Admin"]), createAdminController);
router.get("/", authMiddleware(["Admin"]), getAllAdminsController);
router.get("/:id", authMiddleware(["Admin"]), getAdminController);
router.put("/:id", authMiddleware(["Admin"]), updateAdminController);

export default router;
