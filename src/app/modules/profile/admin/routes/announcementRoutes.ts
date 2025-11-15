import { Router } from "express";
import { authMiddleware } from "../../../../middleware/auth";
import {
  createAnnouncementController,
  getAnnouncementsController,
  updateAnnouncementController,
  deleteAnnouncementController
} from "../controllers/announcementController";

const router = Router();

router.post("/", authMiddleware(["Admin"]), createAnnouncementController);
router.get("/", authMiddleware(["Admin"]), getAnnouncementsController);
router.put("/:id", authMiddleware(["Admin"]), updateAnnouncementController);
router.delete("/:id", authMiddleware(["Admin"]), deleteAnnouncementController);

export default router;
