// src/app/modules/analytics/index.ts
import { Router } from "express";
import { getDashboardStatsController } from "./controllers/analyticsController";
import { authMiddleware } from "../../middleware/auth";

const router = Router();

// Only Admin can access analytics
router.get("/dashboard", authMiddleware(["admin"]), getDashboardStatsController);

export default router;