import { Request, Response } from "express";
import * as notificationService from "../services/notificationService";

export const getNotifications = async (req: Request, res: Response) => {
  try {
    const notifications = await notificationService.getUserNotifications(req.user.id);
    res.status(200).json({ success: true, data: notifications });
  } catch (err: any) {
    res.status(400).json({ success: false, message: err.message });
  }
};

export const markRead = async (req: Request, res: Response) => {
  try {
    const notification = await notificationService.markNotificationRead(req.params.id);
    res.status(200).json({ success: true, data: notification });
  } catch (err: any) {
    res.status(400).json({ success: false, message: err.message });
  }
};
