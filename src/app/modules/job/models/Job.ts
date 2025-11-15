import { Schema, model, Types } from "mongoose";

export interface IJob {
  employer: Types.ObjectId; // Reference to Employer
  title: string;
  description: string;
  location: string;
  type: "Full-time" | "Part-time" | "Contract";
  salary?: number;
  skills?: string[];
  status?: "Open" | "Closed";
}

const jobSchema = new Schema<IJob>({
  employer: { type: Schema.Types.ObjectId, ref: "User", required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  location: { type: String, required: true },
  type: { type: String, enum: ["Full-time", "Part-time", "Contract"], default: "Full-time" },
  salary: { type: Number },
  skills: [{ type: String }],
  status: { type: String, enum: ["Open", "Closed"], default: "Open" },
}, { timestamps: true });

export const Job = model<IJob>("Job", jobSchema);
