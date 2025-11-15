export interface CreateEmployerProfileDTO {
  user: string;          // userId
  company: string;       // companyId
  designation: string;
  phone: string;
  website?: string;
  location?: string;
}
