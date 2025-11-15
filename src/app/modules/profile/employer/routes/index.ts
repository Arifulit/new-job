import { Router, Request, Response } from "express";
import asyncHandler from "../../../../utils/asyncHandler";

const router = Router();

router.get(
  "/",
  asyncHandler(async (req: Request, res: Response) => {
    res.status(200).json({ message: "List employers" });
  })
);

router.get(
  "/:id",
  asyncHandler(async (req: Request, res: Response) => {
    res.status(200).json({ message: "Get employer profile", id: req.params.id });
  })
);

router.post(
  "/",
  asyncHandler(async (req: Request, res: Response) => {
    res.status(201).json({ message: "Create employer profile", body: req.body });
  })
);

router.put(
  "/:id",
  asyncHandler(async (req: Request, res: Response) => {
    res.status(200).json({ message: "Update employer profile", id: req.params.id, body: req.body });
  })
);

router.delete(
  "/:id",
  asyncHandler(async (req: Request, res: Response) => {
    res.status(204).send();
  })
);

export default router;