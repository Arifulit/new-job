export interface UpdateJobDTO {
  title?: string;
  description?: string;
  location?: string;
  type?: "Full-time" | "Part-time" | "Contract";
  salary?: number;
  skills?: string[];
  status?: "Open" | "Closed";
}
