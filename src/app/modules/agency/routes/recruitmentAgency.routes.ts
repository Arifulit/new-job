// src/routes/recruitmentAgency.routes.ts
import { Router } from "express";
import { createAgency, getAgencies } from "../controllers/recruitmentAgency.controller";

const router = Router();

router.post("/", createAgency);   // Create Agency
router.get("/", getAgencies);     // Get All Agencies

export default router;
