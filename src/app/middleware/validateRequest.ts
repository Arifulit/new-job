import { Request, Response, NextFunction } from "express";
import { ZodSchema } from "zod";

export const validateRequest = (schema: ZodSchema<any>) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse({
        body: req.body,
        params: req.params,
        query: req.query,
      });
      next();
    } catch (err: any) {
      return res.status(400).json({
        success: false,
        message: err.errors ? err.errors.map((e: any) => e.message).join(", ") : err.message,
      });
    }
  };
};
