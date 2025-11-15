import { Schema, model, Types } from "mongoose";

export interface IRecruitmentHistory {
  recruiter: Types.ObjectId;
  candidate: Types.ObjectId;
  job: Types.ObjectId;
  status: "Applied" | "Interviewed" | "Hired" | "Rejected";
}

const recruitmentHistorySchema = new Schema<IRecruitmentHistory>({
  recruiter: { type: Schema.Types.ObjectId, ref: "RecruiterProfile", required: true },
  candidate: { type: Schema.Types.ObjectId, ref: "CandidateProfile", required: true },
  job: { type: Schema.Types.ObjectId, ref: "Job", required: true },
  status: { type: String, enum: ["Applied", "Interviewed", "Hired", "Rejected"], default: "Applied" }
}, { timestamps: true });

export const RecruitmentHistory = model<IRecruitmentHistory>("RecruitmentHistory", recruitmentHistorySchema);
