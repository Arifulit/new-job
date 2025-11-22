import { JwtPayload } from 'jsonwebtoken';

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        role: 'admin' | 'candidate' | 'recruiter';
        [key: string]: any;
      } & JwtPayload;
    }
  }
}

import { Request } from 'express';

export interface AuthenticatedRequest extends Request {
  user: {
    id: string;
    role: 'admin' | 'candidate' | 'recruiter';
    email?: string;  // Made email optional with '?'
    [key: string]: any;
  };
}

export {};
