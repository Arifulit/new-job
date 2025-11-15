import { Request, Response } from "express";
import * as jobService from "../services/jobService";

export const createJob = async (req: Request, res: Response) => {
  try {
    const data = { ...req.body, employer: req.user.id };
    const job = await jobService.createJob(data);
    res.status(201).json({ success: true, data: job });
  } catch (err: any) {
    res.status(400).json({ success: false, message: err.message });
  }
};

export const updateJob = async (req: Request, res: Response) => {
  try {
    const job = await jobService.updateJob(req.params.id, req.body);
    res.status(200).json({ success: true, data: job });
  } catch (err: any) {
    res.status(404).json({ success: false, message: err.message });
  }
};

export const getJobs = async (_req: Request, res: Response) => {
  try {
    const jobs = await jobService.getJobs();
    res.status(200).json({ success: true, data: jobs });
  } catch (err: any) {
    res.status(400).json({ success: false, message: err.message });
  }
};

export const getJobById = async (req: Request, res: Response) => {
  try {
    const job = await jobService.getJobById(req.params.id);
    res.status(200).json({ success: true, data: job });
  } catch (err: any) {
    res.status(404).json({ success: false, message: err.message });
  }
};

export const deleteJob = async (req: Request, res: Response) => {
  try {
    const job = await jobService.deleteJob(req.params.id);
    res.status(200).json({ success: true, data: job });
  } catch (err: any) {
    res.status(404).json({ success: false, message: err.message });
  }
};
