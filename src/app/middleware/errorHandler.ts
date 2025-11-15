import { Request, Response, NextFunction } from "express";
import ApiError from "../core/errors/ApiError";
import { ApiResponse } from "../core/response/ApiResponse";

export const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  console.error(err);

  if (err instanceof ApiError) {
    return res.status(err.statusCode).json(ApiResponse.fail(err.message, err.errors));
  }

  res.status(500).json(ApiResponse.fail("Internal Server Error"));
};
