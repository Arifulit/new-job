import { Schema, model, Types } from "mongoose";

export interface IEmployerProfile {
  user: Types.ObjectId;
  company: Types.ObjectId;
  designation: string;
  phone: string;
  website?: string;
  location?: string;
}

const employerProfileSchema = new Schema<IEmployerProfile>({
  user: { type: Schema.Types.ObjectId, ref: "User", required: true, unique: true },
  company: { type: Schema.Types.ObjectId, ref: "Company", required: true },
  designation: { type: String, required: true },
  phone: { type: String, required: true },
  website: { type: String },
  location: { type: String }
}, { timestamps: true });

export const EmployerProfile = model<IEmployerProfile>("EmployerProfile", employerProfileSchema);
