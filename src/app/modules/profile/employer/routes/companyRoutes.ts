import { Router } from "express";
import { createCompanyController, getCompanyController } from "../controllers/companyController";
import { authMiddleware } from "../../../../middleware/auth";

const router = Router();

router.post("/", authMiddleware(["Employer"]), createCompanyController);
router.get("/:id", authMiddleware(["Employer", "Admin"]), getCompanyController);

export default router;
