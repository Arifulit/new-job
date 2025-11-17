// src/services/recruitmentAgency.service.ts
import { RecruitmentAgency } from "../models/recruitmentAgency.model";
import { CreateAgencyDto } from "../dto/createAgency.dto";

export const createAgencyService = async (data: CreateAgencyDto) => {
  const agency = await RecruitmentAgency.create(data);
  return agency;
};

export const getAgenciesService = async () => {
  return await RecruitmentAgency.find().sort({ createdAt: -1 });
};
