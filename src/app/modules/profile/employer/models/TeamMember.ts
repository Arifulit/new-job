import { Schema, model, Types } from "mongoose";

export interface ITeamMember {
  company: Types.ObjectId;
  name: string;
  email: string;
  role: string;
}

const teamMemberSchema = new Schema<ITeamMember>({
  company: { type: Schema.Types.ObjectId, ref: "Company", required: true },
  name: { type: String, required: true },
  email: { type: String, required: true },
  role: { type: String, required: true }
}, { timestamps: true });

export const TeamMember = model<ITeamMember>("TeamMember", teamMemberSchema);
