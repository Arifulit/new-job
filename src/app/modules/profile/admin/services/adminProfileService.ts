import { AdminProfile } from "../models/AdminProfile";

export interface CreateAdminProfileDTO {
  name?: string;
  email?: string;
  role?: string;
  // add other properties expected when creating an admin profile
  [key: string]: any;
}

export interface UpdateAdminProfileDTO {
  name?: string;
  email?: string;
  role?: string;
  // partial update shape for admin profile
  [key: string]: any;
}

export const createAdminProfile = async (data: CreateAdminProfileDTO) => {
  return await AdminProfile.create(data);
};

export const getAdminProfile = async (id: string) => {
  return await AdminProfile.findById(id);
};

export const updateAdminProfile = async (id: string, data: UpdateAdminProfileDTO) => {
  return await AdminProfile.findByIdAndUpdate(id, data, { new: true });
};

export const getAllAdmins = async () => {
  return await AdminProfile.find();
};
