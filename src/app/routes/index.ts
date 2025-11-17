
import { Router } from "express";
import authRoutes from "../modules/auth";
import candidateRoutes from "../modules/profile/candidate/routes";
import employerRouter from "../modules/profile/employer/routes";
import jobRoutes from "../modules/job/routes/jobRoutes";
import applicationRoutes from "../modules/application/routes/applicationRoutes";
import paymentRoutes from "../modules/payment/routes/paymentRoutes";
import auditRoutes from "../modules/audit/routes/auditRoutes";
import companyRoutes from "../modules/company/routes/companyRoutes";
import recruitmentAgencyRoutes from "../modules/agency/routes/recruitmentAgency.routes";

const router = Router();

router.use("/auth", authRoutes);
router.use("/candidate", candidateRoutes);
router.use("/employer", employerRouter);
router.use("/jobs", jobRoutes);
router.use("/applications", applicationRoutes);
router.use("/payments", paymentRoutes);
router.use("/audit", auditRoutes);
router.use("/company", companyRoutes);
router.use("/agency", recruitmentAgencyRoutes);

export default router;
