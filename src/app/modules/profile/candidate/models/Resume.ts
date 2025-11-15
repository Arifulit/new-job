import { Schema, model, Types } from "mongoose";

export interface IResume {
  candidate: Types.ObjectId;
  fileUrl: string;
  fileName: string;
}

const resumeSchema = new Schema<IResume>({
  candidate: { type: Schema.Types.ObjectId, ref: "CandidateProfile", required: true },
  fileUrl: { type: String, required: true },
  fileName: { type: String, required: true }
}, { timestamps: true });

export const Resume = model<IResume>("Resume", resumeSchema);
