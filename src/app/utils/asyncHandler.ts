import { Request, Response, NextFunction, RequestHandler } from "express";

/**
 * Wrap async route handlers to forward errors to Express error middleware.
 * Usage:
 *   router.get("/...", asyncHandler(async (req, res) => { ... }));
 */
export const asyncHandler = (
  fn: (req: Request, res: Response, next: NextFunction) => Promise<any>
): RequestHandler => {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

export default asyncHandler;