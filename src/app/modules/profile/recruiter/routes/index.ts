import recruiterProfileRoutes from "./recruiterProfileRoutes";
import agencyRoutes from "./agencyRoutes";
import { Router } from "express";

const router = Router();

router.use("/", recruiterProfileRoutes);
router.use("/agency", agencyRoutes);

export default router;
