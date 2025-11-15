export type ID = string;

export type Role = "super_admin" | "admin" | "user" | "recruiter";

export interface PaginationOptions {
  page?: number;
  limit?: number;
  sort?: string;
  filter?: Record<string, any>;
}

export interface ApiResponse<T = any> {
  status: number;
  data?: T;
  message?: string;
  error?: any;
}

export type AppUser = {
  id: ID;
  email?: string;
  role?: Role;
  [key: string]: any;
};

export type AppRequest<
  Body = any,
  Params = any,
  Query = any
> = import("express").Request<Params, any, Body, Query> & {
  user?: AppUser;
};

export type AppNext = import("express").NextFunction;
export type AppResponse<T = any> = import("express").Response<T>;