import { Schema, model, Types } from "mongoose";

export interface IExperience {
  candidate: Types.ObjectId;
  company: string;
  role: string;
  startDate: Date;
  endDate?: Date;
  description?: string;
}

const experienceSchema = new Schema<IExperience>({
  candidate: { type: Schema.Types.ObjectId, ref: "CandidateProfile", required: true },
  company: { type: String, required: true },
  role: { type: String, required: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date },
  description: { type: String }
}, { timestamps: true });

export const Experience = model<IExperience>("Experience", experienceSchema);
