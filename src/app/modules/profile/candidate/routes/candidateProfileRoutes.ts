// import { Router } from "express";
// import {
//   createCandidateProfileController,
//   getCandidateProfileController,
//   updateCandidateProfileController
// } from "../controllers/candidateProfileController";
// import { authMiddleware } from "../../../../middleware/auth";

// const router = Router();

// router.post("/", authMiddleware(["Candidate"]), createCandidateProfileController);
// router.get("/:userId", authMiddleware(["Candidate", "Admin"]), getCandidateProfileController);
// router.put("/:userId", authMiddleware(["Candidate"]), updateCandidateProfileController);

// export default router;

import { Router } from "express";
import {
  createCandidateProfileController,
  getCandidateProfileController,
  updateCandidateProfileController
} from "../controllers/candidateProfileController";
import { authMiddleware } from "../../../../middleware/auth";

const router = Router();

console.log("✅ Candidate Profile Routes initialized");

// 🔍 Middleware to log
router.use((req, res, next) => {
  console.log("🔴 Profile controller route:", req.method, req.url);
  next();
});

// Test route WITHOUT auth
router.get("/test", (req, res) => {
  res.json({ message: "Profile routes working!" });
});

router.post("/", authMiddleware(["Candidate"]), createCandidateProfileController);
router.get("/:userId", authMiddleware(["Candidate", "Admin"]), getCandidateProfileController);
router.put("/:userId", authMiddleware(["Candidate"]), updateCandidateProfileController);

export default router;