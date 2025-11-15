import { Job, IJob } from "../models/Job";

export const createJob = async (data: IJob) => {
  const job = await Job.create(data);
  return job;
};

export const updateJob = async (jobId: string, data: Partial<IJob>) => {
  const job = await Job.findByIdAndUpdate(jobId, data, { new: true });
  if (!job) throw new Error("Job not found");
  return job;
};

export const getJobs = async () => {
  const jobs = await Job.find().populate("employer", "name email");
  return jobs;
};

export const getJobById = async (jobId: string) => {
  const job = await Job.findById(jobId).populate("employer", "name email");
  if (!job) throw new Error("Job not found");
  return job;
};

export const deleteJob = async (jobId: string) => {
  const job = await Job.findByIdAndDelete(jobId);
  if (!job) throw new Error("Job not found");
  return job;
};
