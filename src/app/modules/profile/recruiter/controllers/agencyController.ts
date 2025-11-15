import { Request, Response } from "express";
import * as agencyService from "../services/agencyService";

export const createAgencyController = async (req: Request, res: Response) => {
  const agency = await agencyService.createAgency(req.body);
  res.status(201).json({ success: true, data: agency });
};

export const getAgencyController = async (req: Request, res: Response) => {
  const agency = await agencyService.getAgencyById(req.params.id);
  res.status(200).json({ success: true, data: agency });
};
