// middleware/auditLogger.ts
import { Request, Response, NextFunction } from "express";
import { createAuditLog } from "../modules/audit/services/auditService";

export const auditLogger = (action: string) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    res.on("finish", async () => {
      await createAuditLog({
        user: req.user?.id,
        action,
        resource: req.originalUrl,
        method: req.method,
        ip: req.ip,
        status: res.statusCode < 400 ? "Success" : "Failed",
        description: `${res.statusCode} ${res.statusMessage}`
      });
    });
    next();
  };
};
