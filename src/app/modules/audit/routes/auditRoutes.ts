import { Router } from "express";
import { getAuditLogsController } from "../controllers/auditController";
import { authMiddleware } from "../../../middleware/auth";

const router = Router();

// Only Admin can access audit logs
router.get("/", authMiddleware(["Admin"]), getAuditLogsController);

export default router;
