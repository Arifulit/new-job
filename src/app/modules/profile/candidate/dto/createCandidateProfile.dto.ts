export interface CreateCandidateProfileDTO {
  user: string;
  firstName: string;
  lastName: string;
  phone: string;
  address?: string;
  skills?: string[];
}
