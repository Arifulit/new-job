import { Request, Response } from "express";
import * as recruiterProfileService from "../services/recruiterProfileService";

export const createRecruiterProfileController = async (req: Request, res: Response) => {
  const profile = await recruiterProfileService.createRecruiterProfile(req.body);
  res.status(201).json({ success: true, data: profile });
};

export const getRecruiterProfileController = async (req: Request, res: Response) => {
  const profile = await recruiterProfileService.getRecruiterProfile(req.params.userId);
  res.status(200).json({ success: true, data: profile });
};

export const updateRecruiterProfileController = async (req: Request, res: Response) => {
  const profile = await recruiterProfileService.updateRecruiterProfile(req.params.userId, req.body);
  res.status(200).json({ success: true, data: profile });
};
