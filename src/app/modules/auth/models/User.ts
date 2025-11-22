
import { Schema, model } from "mongoose";

export interface IUser {
  name: string;
  email: string;
  password: string;
  role: "recruiter" | "admin" | "candidate";
  isSuspended?: boolean;
}

const userSchema = new Schema<IUser>({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ["recruiter", "admin", "candidate"], default: "recruiter" },
  isSuspended: { type: Boolean, default: false },
}, { timestamps: true });

export const User = model<IUser>("User", userSchema);
