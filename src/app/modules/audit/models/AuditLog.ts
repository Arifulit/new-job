import { Schema, model, Types } from "mongoose";

export interface IAuditLog {
  user: Types.ObjectId;
  action: string;
  resource: string;
  method: string;
  ip: string;
  status: "Success" | "Failed";
  description?: string;
}

const auditLogSchema = new Schema<IAuditLog>({
  user: { type: Schema.Types.ObjectId, ref: "User", required: true },
  action: { type: String, required: true },
  resource: { type: String, required: true },
  method: { type: String, required: true },
  ip: { type: String, required: true },
  status: { type: String, enum: ["Success", "Failed"], default: "Success" },
  description: { type: String }
}, { timestamps: true });

export const AuditLog = model<IAuditLog>("AuditLog", auditLogSchema);
