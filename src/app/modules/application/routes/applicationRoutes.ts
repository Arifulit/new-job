// src/app/modules/application/routes/applicationRoutes.ts
import { Router } from "express";
import { 
  applyJob, 
  getCandidateApplications, 
  updateApplication,
  getJobApplications,
  getJobApplicationsNew as getMyJobApplications
} from "../controllers/applicationController";
import { authMiddleware } from "../../../middleware/auth";

const router = Router();

// Candidate routes
router.post(
  "/", 
  authMiddleware(["candidate"]), 
  applyJob
);

router.get(
  "/me", 
  authMiddleware(["candidate"]), 
  getCandidateApplications
);

// Recruiter routes
router.get(
  "/jobs/:jobId/applications", 
  authMiddleware(["recruiter", "admin"]), 
  (req: Request, res: Response, next: NextFunction) => {
    const authReq = req as any as AuthenticatedRequest;
    return getJobApplications(authReq, res);
  }
);

router.get(
  "/recruiter/applications", 
  authMiddleware(["recruiter"]), 
  getMyJobApplications as any
);

// Admin routes
router.put(
  "/:id", 
  authMiddleware(["admin"]), 
  updateApplication as any
);

export default router;
































// import { Router } from "express";
// import { 
//   applyJob, 
//   getCandidateApplications, 
//   updateApplication,
//   getJobApplications,
//   getMyJobApplications
// } from "../controllers/applicationController";
// import { authMiddleware } from "../../../middleware/auth";

// const router = Router();

// // Candidate routes
// router.post("/", 
//   authMiddleware(["candidate"]), 
//   applyJob as any
// );

// router.get("/me", 
//   authMiddleware(["candidate"]), 
//   getCandidateApplications as any
// );

// // Recruiter routes
// router.get("/jobs/:jobId/applications", 
//   authMiddleware(["recruiter", "admin"]), 
//   getJobApplications
// );

// router.get("/recruiter/applications", 
//   authMiddleware(["recruiter"]), 
//   getMyJobApplications as any
// );

// // Admin routes
// router.put("/:id", 
//   authMiddleware(["admin"]), 
//   updateApplication as any
// );

// export default router;