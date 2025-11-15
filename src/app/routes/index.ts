
// import { Router } from "express";
// import authRoutes from "../modules/auth";
// import employerRouter from "../modules/profile/employer/routes";
// import jobRoutes from "../modules/job/routes/jobRoutes";
// import applicationRoutes from "../modules/application/routes/applicationRoutes";
// import paymentRoutes from "../modules/payment/routes/paymentRoutes";
// import auditRoutes from "../modules/audit/routes/auditRoutes";
// // import analyticsRoutes from "../modules/analytics/routes/analyticsRoutes";
// // import companyRoutes from "../modules/company/routes";
// // import verificationRoutes from "../modules/verification/routes";
// // import candidateRoutes from "../modules/profile/candidate";
// import adminRoutes from "../modules/profile/admin/routes";
// import recruiterRoutes from "../modules/profile/recruiter/routes";
// // import candidateRoutes from "../modules/profile/candidate/routes";
// import candidateRoutes from "../modules/profile/candidate/routes/index";
// const router = Router();

// console.log("✅ Main Router initialized");
// console.log("✅ candidateRoutes imported:", typeof candidateRoutes);



// // Auth routes
// router.use("/auth", authRoutes);


// // router.use("/candidate", candidateRoutes);
// router.use("/candidate", (req, res, next) => {
//   console.log("🔵 Request reached /candidate:", req.method, req.url);
//   next();
// }, candidateRoutes);

// router.use("/employer", employerRouter);
// router.use("/admin", adminRoutes);
// router.use("/recruiter", recruiterRoutes);

// // Job & Application routes
// router.use("/jobs", jobRoutes);
// router.use("/applications", applicationRoutes);


// router.use("/payments", paymentRoutes);
// // router.use("/analytics", analyticsRoutes);
// router.use("/audit", auditRoutes);

// // Company & Verification routes
// // router.use("/company", companyRoutes);
// // router.use("/verification", verificationRoutes);

// export default router;

import { Router } from "express";
import authRoutes from "../modules/auth";
import employerRouter from "../modules/profile/employer/routes";
import jobRoutes from "../modules/job/routes/jobRoutes";
import applicationRoutes from "../modules/application/routes/applicationRoutes";
import paymentRoutes from "../modules/payment/routes/paymentRoutes";
import auditRoutes from "../modules/audit/routes/auditRoutes";
import adminRoutes from "../modules/profile/admin/routes";
import recruiterRoutes from "../modules/profile/recruiter/routes";
import candidateRoutes from "../modules/profile/candidate/routes/index";

const router = Router();

console.log("✅ Main Router initialized");
console.log("✅ candidateRoutes imported:", typeof candidateRoutes);

// Auth routes
router.use("/auth", authRoutes);

// ✅ Profile routes - "/profile/candidate" path দিন
router.use("/profile/candidate", (req, res, next) => {
  console.log("🔵 Request reached /profile/candidate:", req.method, req.url);
  next();
}, candidateRoutes);

router.use("/profile/employer", employerRouter);
router.use("/profile/admin", adminRoutes);
router.use("/profile/recruiter", recruiterRoutes);

// Job & Application routes
router.use("/jobs", jobRoutes);
router.use("/applications", applicationRoutes);

router.use("/payments", paymentRoutes);
router.use("/audit", auditRoutes);

export default router;