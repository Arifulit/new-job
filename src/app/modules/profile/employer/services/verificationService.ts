import { EmployerVerification } from "../models/EmployerVerification";

export const createVerificationRequest = async (data: any) => {
  return await EmployerVerification.create(data);
};

export const updateVerificationStatus = async (id: string, status: "Pending" | "Approved" | "Rejected") => {
  return await EmployerVerification.findByIdAndUpdate(id, { status }, { new: true });
};

export const getVerificationByEmployer = async (employerId: string) => {
  return await EmployerVerification.findOne({ employer: employerId });
};
