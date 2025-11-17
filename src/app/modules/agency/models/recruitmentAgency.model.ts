// src/models/recruitmentAgency.model.ts
import { Schema, model } from "mongoose";

export interface IRecruitmentAgency {
  name: string;
  website?: string;
  size?: string;
  industry?: string;
}

const recruitmentAgencySchema = new Schema<IRecruitmentAgency>(
  {
    name: { type: String, required: true },
    website: { type: String },
    size: { type: String },
    industry: { type: String },
  },
  { timestamps: true }
);

export const RecruitmentAgency = model<IRecruitmentAgency>(
  "RecruitmentAgency",
  recruitmentAgencySchema
);
