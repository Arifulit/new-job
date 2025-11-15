// import { Router } from "express";
// import candidateProfileRoutes from "./candidateProfileRoutes";
// import resumeRoutes from "./resumeRoutes";

// const router = Router();

// console.log("✅ Candidate Routes initialized");

// router.use("/profile", candidateProfileRoutes);
// router.use("/resume", resumeRoutes);

// export default router;
import { Router } from "express";
import candidateProfileRoutes from "./candidateProfileRoutes";
import resumeRoutes from "./resumeRoutes";

const router = Router();

console.log("✅ Candidate Routes initialized");

// 🔍 Middleware to log all requests
router.use((req, res, next) => {
  console.log("🟢 Candidate route hit:", req.method, req.originalUrl, req.path);
  next();
});

// ✅ "/" দিন (profile আর লাগবে না কারণ main router এ আছে)
router.use("/", (req, res, next) => {
  console.log("🟡 Profile route hit:", req.method, req.url);
  next();
}, candidateProfileRoutes);

router.use("/resume", resumeRoutes);

// Test route
router.get("/test", (req, res) => {
  res.json({ message: "Candidate routes working!" });
});

export default router;