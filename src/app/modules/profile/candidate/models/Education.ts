import { Schema, model, Types } from "mongoose";

export interface IEducation {
  candidate: Types.ObjectId;
  institution: string;
  degree: string;
  fieldOfStudy?: string;
  startDate: Date;
  endDate?: Date;
}

const educationSchema = new Schema<IEducation>({
  candidate: { type: Schema.Types.ObjectId, ref: "CandidateProfile", required: true },
  institution: { type: String, required: true },
  degree: { type: String, required: true },
  fieldOfStudy: { type: String },
  startDate: { type: Date, required: true },
  endDate: { type: Date }
}, { timestamps: true });

export const Education = model<IEducation>("Education", educationSchema);
