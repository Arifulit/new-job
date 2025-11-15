import { Schema, model, Types } from "mongoose";

export interface IAdminActivity {
  admin: Types.ObjectId;
  action: string;
  resource: string;
  timestamp: Date;
}

const adminActivitySchema = new Schema<IAdminActivity>({
  admin: { type: Schema.Types.ObjectId, ref: "AdminProfile", required: true },
  action: { type: String, required: true },
  resource: { type: String, required: true },
  timestamp: { type: Date, default: Date.now }
});

export const AdminActivity = model<IAdminActivity>("AdminActivity", adminActivitySchema);
