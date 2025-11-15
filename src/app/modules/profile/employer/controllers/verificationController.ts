import { Request, Response } from "express";
import * as verificationService from "../services/verificationService";

export const createVerificationController = async (req: Request, res: Response) => {
  const verification = await verificationService.createVerificationRequest(req.body);
  res.status(201).json({ success: true, data: verification });
};

export const updateVerificationController = async (req: Request, res: Response) => {
  const verification = await verificationService.updateVerificationStatus(req.params.id, req.body.status);
  res.status(200).json({ success: true, data: verification });
};
