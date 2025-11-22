// ...existing code...
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  UNPROCESSABLE_ENTITY: 422,
  INTERNAL_ERROR: 500,
} as const;

export const DEFAULTS = {
  PORT: 5000,
  PAGE: 1,
  LIMIT: 10,
  MAX_LIMIT: 100,
  PASSWORD_MIN_LENGTH: 8,
} as const;

export const ROLES = {
  ADMIN: "admin",
  RECRUITER: "recruiter",
  CANDIDATE: "candidate"
} as const;

export const ID_PREFIX = {
  USER: "USR",
  JOB: "JOB",
  APP: "APP",
  ORG: "ORG",
} as const;

export const REGEX = {
  EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  STRONG_PASSWORD:
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\da-zA-Z]).{8,}$/,
} as const;

export const COOKIE = {
  SESSION_NAME: "sid",
  MAX_AGE_MS: 1000 * 60 * 60 * 24 * 7, // 7 days
} as const;

export const MISC = {
  DATE_FORMAT: "YYYY-MM-DDTHH:mm:ss.SSSZ",
  LOG_DIR: "logs",
} as const;

export default {
  HTTP_STATUS,
  DEFAULTS,
  ROLES,
  ID_PREFIX,
  REGEX,
  COOKIE,
  MISC,
};