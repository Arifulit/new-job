import { Schema, model, Types } from "mongoose";

export interface IAdminProfile {
  user: Types.ObjectId;
  firstName: string;
  lastName: string;
  email: string;
  role: "Admin";
}

const adminProfileSchema = new Schema<IAdminProfile>({
  user: { type: Schema.Types.ObjectId, ref: "User", required: true, unique: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  role: { type: String, default: "Admin" }
}, { timestamps: true });

export const AdminProfile = model<IAdminProfile>("AdminProfile", adminProfileSchema);
