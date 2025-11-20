// import { Schema, model } from "mongoose";

// export interface IUser {
//   name: string;
//   email: string;
//   password: string;
//   role: "candidate" | "recruiter" | "admin";
// }

// const userSchema = new Schema<IUser>({
//   name: { type: String, required: true },
//   email: { type: String, required: true, unique: true },
//   password: { type: String, required: true },
//   role: { type: String, enum: ["candidate", "recruiter", "admin"], default: "candidate" },
// }, { timestamps: true });

// export const User = model<IUser>("User", userSchema);
import { Schema, model } from "mongoose";

export interface IUser {
  name: string;
  email: string;
  password: string;
  role: "candidate" | "recruiter" | "admin";
}

const userSchema = new Schema<IUser>({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ["candidate", "recruiter", "admin"], default: "candidate" },
}, { timestamps: true });

export const User = model<IUser>("User", userSchema);
