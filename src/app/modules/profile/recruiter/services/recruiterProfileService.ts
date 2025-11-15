import { RecruiterProfile } from "../models/RecruiterProfile";

// dto/index.ts does not export a module; use simple local types until the dto barrel file is fixed
type CreateRecruiterProfileDTO = any;
type UpdateRecruiterProfileDTO = any;

export const createRecruiterProfile = async (data: CreateRecruiterProfileDTO) => {
  return await RecruiterProfile.create(data);
};

export const getRecruiterProfile = async (userId: string) => {
  return await RecruiterProfile.findOne({ user: userId }).populate("agency");
};

export const updateRecruiterProfile = async (userId: string, data: UpdateRecruiterProfileDTO) => {
  return await RecruiterProfile.findOneAndUpdate({ user: userId }, data, { new: true });
};
