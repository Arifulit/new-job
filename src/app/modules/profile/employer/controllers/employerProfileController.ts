import { Request, Response } from "express";
import * as employerProfileService from "../services/employerProfileService";

export const createEmployerProfileController = async (req: Request, res: Response) => {
  const profile = await employerProfileService.createEmployerProfile(req.body);
  res.status(201).json({ success: true, data: profile });
};

export const getEmployerProfileController = async (req: Request, res: Response) => {
  const profile = await employerProfileService.getEmployerProfile(req.params.userId);
  res.status(200).json({ success: true, data: profile });
};

export const updateEmployerProfileController = async (req: Request, res: Response) => {
  const profile = await employerProfileService.updateEmployerProfile(req.params.userId, req.body);
  res.status(200).json({ success: true, data: profile });
};
