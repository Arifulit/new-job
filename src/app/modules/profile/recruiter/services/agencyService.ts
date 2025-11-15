import { RecruitmentAgency } from "../models/RecruitmentAgency";

export const createAgency = async (data: any) => {
  return await RecruitmentAgency.create(data);
};

export const getAgencyById = async (id: string) => {
  return await RecruitmentAgency.findById(id);
};
