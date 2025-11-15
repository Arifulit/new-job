import { Request, Response } from "express";
import * as companyService from "../services/companyService";

export const createCompanyController = async (req: Request, res: Response) => {
  const company = await companyService.createCompany(req.body);
  res.status(201).json({ success: true, data: company });
};

export const getCompanyController = async (req: Request, res: Response) => {
  const company = await companyService.getCompanyById(req.params.id);
  res.status(200).json({ success: true, data: company });
};
