// src/dto/createAgency.dto.ts
import { z } from "zod";

export const createAgencyDto = z.object({
  name: z.string().min(2, "Agency name is required"),
  website: z.string().url().optional(),
  size: z.string().optional(),
  industry: z.string().optional(),
});

export type CreateAgencyDto = z.infer<typeof createAgencyDto>;
