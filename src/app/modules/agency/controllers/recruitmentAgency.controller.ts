// src/controllers/recruitmentAgency.controller.ts
import { Request, Response } from "express";
import { createAgencyDto } from "../dto/createAgency.dto";
import {
  createAgencyService,
  getAgenciesService,
} from "../services/recruitmentAgency.service";

export const createAgency = async (req: Request, res: Response) => {
  try {
    const parsed = createAgencyDto.parse(req.body);
    const agency = await createAgencyService(parsed);

    res.status(201).json({
      success: true,
      message: "Recruitment agency created successfully",
      data: agency,
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const getAgencies = async (req: Request, res: Response) => {
  try {
    const agencies = await getAgenciesService();
    res.json({
      success: true,
      data: agencies,
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};
