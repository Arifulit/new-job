export interface UpdateApplicationDTO {
  status?: "Applied" | "Reviewed" | "Accepted" | "Rejected";
  resume?: string;
  coverLetter?: string;
}
