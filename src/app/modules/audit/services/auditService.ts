import { AuditLog, IAuditLog } from "../models/AuditLog";

// Create new audit log
export const createAuditLog = async (log: IAuditLog) => {
  return await AuditLog.create(log);
};

// Get audit logs with filters
export const getAuditLogs = async (filters: any = {}) => {
  return await AuditLog.find(filters).sort({ createdAt: -1 });
};
