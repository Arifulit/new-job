import { Router } from "express";
import { createPaymentController, getPaymentsController } from "../controllers/paymentController";
import { authMiddleware } from "../../../middleware/auth";

const router = Router();

router.post("/", authMiddleware(), createPaymentController);
router.get("/", authMiddleware(), getPaymentsController);

export default router;
