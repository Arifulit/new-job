import { Request, Response } from "express";
import * as announcementService from "../services/announcementService";

export const createAnnouncementController = async (req: Request, res: Response) => {
  const announcement = await announcementService.createAnnouncement(req.body);
  res.status(201).json({ success: true, data: announcement });
};

export const getAnnouncementsController = async (req: Request, res: Response) => {
  const announcements = await announcementService.getAnnouncements();
  res.status(200).json({ success: true, data: announcements });
};

export const updateAnnouncementController = async (req: Request, res: Response) => {
  const announcement = await announcementService.updateAnnouncement(req.params.id, req.body);
  res.status(200).json({ success: true, data: announcement });
};

export const deleteAnnouncementController = async (req: Request, res: Response) => {
  await announcementService.deleteAnnouncement(req.params.id);
  res.status(204).send();
};
