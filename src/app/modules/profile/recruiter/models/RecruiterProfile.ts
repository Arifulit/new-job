import { Schema, model, Types } from "mongoose";

export interface IRecruiterProfile {
  user: Types.ObjectId;
  agency: Types.ObjectId;
  designation: string;
  phone: string;
}

const recruiterProfileSchema = new Schema<IRecruiterProfile>({
  user: { type: Schema.Types.ObjectId, ref: "User", required: true, unique: true },
  agency: { type: Schema.Types.ObjectId, ref: "RecruitmentAgency", required: true },
  designation: { type: String, required: true },
  phone: { type: String, required: true },
}, { timestamps: true });

export const RecruiterProfile = model<IRecruiterProfile>("RecruiterProfile", recruiterProfileSchema);
