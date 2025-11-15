import { Request, Response } from "express";
import * as adminService from "../services/adminProfileService";

export const createAdminController = async (req: Request, res: Response) => {
  const admin = await adminService.createAdminProfile(req.body);
  res.status(201).json({ success: true, data: admin });
};

export const getAdminController = async (req: Request, res: Response) => {
  const admin = await adminService.getAdminProfile(req.params.id);
  res.status(200).json({ success: true, data: admin });
};

export const updateAdminController = async (req: Request, res: Response) => {
  const admin = await adminService.updateAdminProfile(req.params.id, req.body);
  res.status(200).json({ success: true, data: admin });
};

export const getAllAdminsController = async (req: Request, res: Response) => {
  const admins = await adminService.getAllAdmins();
  res.status(200).json({ success: true, data: admins });
};
