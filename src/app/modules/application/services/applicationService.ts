import { Application, IApplication } from "../models/Application";

export const applyJob = async (data: IApplication) => {
  const existing = await Application.findOne({ candidate: data.candidate, job: data.job });
  if (existing) throw new Error("Already applied for this job");
  const application = await Application.create(data);
  return application;
};

export const updateApplication = async (id: string, data: Partial<IApplication>) => {
  const application = await Application.findByIdAndUpdate(id, data, { new: true });
  if (!application) throw new Error("Application not found");
  return application;
};

export const getApplicationsByCandidate = async (candidateId: string) => {
  return await Application.find({ candidate: candidateId }).populate("job");
};

export const getApplicationsByJob = async (jobId: string) => {
  return await Application.find({ job: jobId }).populate("candidate", "name email");
};
