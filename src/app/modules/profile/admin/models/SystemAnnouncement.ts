import { Schema, model, Types } from "mongoose";

export interface ISystemAnnouncement {
  title: string;
  message: string;
  createdBy: Types.ObjectId;
  isActive: boolean;
}

const systemAnnouncementSchema = new Schema<ISystemAnnouncement>({
  title: { type: String, required: true },
  message: { type: String, required: true },
  createdBy: { type: Schema.Types.ObjectId, ref: "AdminProfile", required: true },
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

export const SystemAnnouncement = model<ISystemAnnouncement>("SystemAnnouncement", systemAnnouncementSchema);
