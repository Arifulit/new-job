import adminProfileRoutes from "./adminProfileRoutes";
import announcementRoutes from "./announcementRoutes";
import { Router } from "express";

const router = Router();

router.use("/profile", adminProfileRoutes);
router.use("/announcement", announcementRoutes);

export default router;
