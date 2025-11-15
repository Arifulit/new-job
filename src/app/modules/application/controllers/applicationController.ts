import { Request, Response } from "express";
import * as applicationService from "../services/applicationService";

export const applyJob = async (req: Request, res: Response) => {
  try {
    const data = { ...req.body, candidate: req.user.id };
    const application = await applicationService.applyJob(data);
    res.status(201).json({ success: true, data: application });
  } catch (err: any) {
    res.status(400).json({ success: false, message: err.message });
  }
};

export const updateApplication = async (req: Request, res: Response) => {
  try {
    const application = await applicationService.updateApplication(req.params.id, req.body);
    res.status(200).json({ success: true, data: application });
  } catch (err: any) {
    res.status(404).json({ success: false, message: err.message });
  }
};

export const getCandidateApplications = async (req: Request, res: Response) => {
  try {
    const applications = await applicationService.getApplicationsByCandidate(req.user.id);
    res.status(200).json({ success: true, data: applications });
  } catch (err: any) {
    res.status(400).json({ success: false, message: err.message });
  }
};

export const getJobApplications = async (req: Request, res: Response) => {
  try {
    const applications = await applicationService.getApplicationsByJob(req.params.jobId);
    res.status(200).json({ success: true, data: applications });
  } catch (err: any) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// import { createNotification } from "../../notification/services/notificationService";

// // যখন এমপ্লয়ারের দ্বারা status update হবে
// await createNotification({
//   user: application.candidate, 
//   type: "Application",
//   message: `Your application status for ${application.job} has been updated to ${application.status}`,
// }, true, candidateEmail); // true মানে email পাঠাবে