import { Request, Response } from "express";
import * as auditService from "../services/auditService";

export const getAuditLogsController = async (req: Request, res: Response) => {
  try {
    const logs = await auditService.getAuditLogs(req.query);
    res.status(200).json({ success: true, data: logs });
  } catch (err: any) {
    res.status(400).json({ success: false, message: err.message });
  }
};
