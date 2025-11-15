import { EmployerProfile } from "../models/EmployerProfile";
import { CreateEmployerProfileDTO, UpdateEmployerProfileDTO } from "../dto";

export const createEmployerProfile = async (data: CreateEmployerProfileDTO) => {
  return await EmployerProfile.create(data);
};

export const getEmployerProfile = async (userId: string) => {
  return await EmployerProfile.findOne({ user: userId }).populate("company");
};

export const updateEmployerProfile = async (userId: string, data: UpdateEmployerProfileDTO) => {
  return await EmployerProfile.findOneAndUpdate({ user: userId }, data, { new: true });
};
