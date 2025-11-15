import { SystemAnnouncement } from "../models/SystemAnnouncement";
// index.ts in ../dto is not a module in the current build; declare a local type fallback.
// Replace `any` with the proper DTO shape or re-export AnnouncementDTO from ../dto/index.ts when available.
type AnnouncementDTO = any;

export const createAnnouncement = async (data: AnnouncementDTO) => {
  return await SystemAnnouncement.create(data);
};

export const getAnnouncements = async () => {
  return await SystemAnnouncement.find();
};

export const updateAnnouncement = async (id: string, data: Partial<AnnouncementDTO>) => {
  return await SystemAnnouncement.findByIdAndUpdate(id, data, { new: true });
};

export const deleteAnnouncement = async (id: string) => {
  return await SystemAnnouncement.findByIdAndDelete(id);
};
