import { Schema, model, Types } from "mongoose";

export interface IEmployerVerification {
  employer: Types.ObjectId;
  documentUrl: string;
  status: "Pending" | "Approved" | "Rejected";
}

const employerVerificationSchema = new Schema<IEmployerVerification>({
  employer: { type: Schema.Types.ObjectId, ref: "EmployerProfile", required: true },
  documentUrl: { type: String, required: true },
  status: { type: String, enum: ["Pending", "Approved", "Rejected"], default: "Pending" }
}, { timestamps: true });

export const EmployerVerification = model<IEmployerVerification>("EmployerVerification", employerVerificationSchema);
