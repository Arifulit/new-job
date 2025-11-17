import { Router } from "express";
import {
  createCompany,
  getCompanies,
  getCompany,
  updateCompany,
  deleteCompany
} from "../controllers/companyController";

const router = Router();

// CRUD
// router.post("/", createCompany);
// added: accept /create path too so client calling /api/v1/company/create works
router.post("/create", createCompany);

router.get("/", getCompanies);
router.get("/:id", getCompany);
router.put("/:id", updateCompany);
router.delete("/:id", deleteCompany);

export default router;