export interface CreateJobDTO {
  title: string;
  description: string;
  location: string;
  type: "Full-time" | "Part-time" | "Contract";
  salary?: number;
  skills?: string[];
}
