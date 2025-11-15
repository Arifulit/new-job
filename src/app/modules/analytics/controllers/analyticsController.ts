import { Request, Response } from "express";
import * as analyticsService from "../services/analyticsService";

export const getDashboardStatsController = async (req: Request, res: Response) => {
  try {
    const stats = await analyticsService.getDashboardStats();
    res.status(200).json({ success: true, data: stats });
  } catch (err: any) {
    res.status(400).json({ success: false, message: err.message });
  }
};
