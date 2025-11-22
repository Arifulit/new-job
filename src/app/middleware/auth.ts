
// // import { Request, Response, NextFunction, RequestHandler } from "express";

import { Request, Response, NextFunction, RequestHandler } from "express";
import jwt from "jsonwebtoken";
import { AuthenticatedRequest } from "../../types/express";

type AuthenticatedHandler = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => Promise<void> | void;

function extractToken(req: Request): string | undefined {
  // 1. Check Authorization header first
  const authHeader = (req.headers.authorization || "").toString();
  if (authHeader.startsWith("Bearer ")) {
    return authHeader.slice(7);
  }
  
  // 2. Check cookies
  if ((req as any).cookies?.accessToken) {
    return (req as any).cookies.accessToken;
  }
  if ((req as any).cookies?.refreshToken) {
    return (req as any).cookies.refreshToken;
  }
  
  return undefined;
}

export const authMiddleware = (allowedRoles?: string[]): RequestHandler => {
  return async (req: Request | AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      console.log("🔐 authMiddleware: Starting authentication check");
      console.log("🔐 Request method:", req.method);
      console.log("🔐 Request path:", req.path);
      console.log("🔐 Allowed roles:", allowedRoles || "Any authenticated user");
      
      // Extract token from request
      const token = extractToken(req);
      if (!token) {
        console.log("⚠️ authMiddleware: No authentication token found");
        return res.status(401).json({ 
          success: false, 
          message: "Authentication required" 
        });
      }

      // Get JWT secret
      const secret = process.env.JWT_SECRET;
      if (!secret) {
        console.error("❌ authMiddleware: JWT_SECRET is not configured");
        return res.status(500).json({ 
          success: false, 
          message: "Server configuration error" 
        });
      }

      try {
        // Verify and decode the token
        const decoded = jwt.verify(token, secret) as any;
        console.log("✅ authMiddleware: Token verified successfully");
        
        // Ensure required fields exist in the token
        if (!decoded.id) {
          throw new Error("Token missing required fields");
        }

        // Set user in request object with proper role handling
        // Default to 'candidate' role if not specified
        let userRole = (decoded.role || 'candidate').toString().toLowerCase().trim();
        
        // Map legacy roles to new role structure if needed
        if (userRole === 'user') userRole = 'candidate';
        if (userRole === 'super_admin') userRole = 'admin';
        
        req.user = {
          id: decoded.id,
          email: decoded.email || '',
          role: userRole as 'admin' | 'recruiter' | 'candidate',
          ...decoded
        };

        // Ensure user exists before accessing properties
        if (!req.user) {
          return next(new Error('User not found in request after authentication'));
        }
        
        const user = req.user;
        console.log("🔐 Authenticated user:", {
          id: user.id,
          role: user.role,
          email: user.email
        });

        // Check role-based access if required
        if (allowedRoles && allowedRoles.length > 0) {
          const allowed = allowedRoles.map(r => r.toString().toLowerCase().trim());
          
          console.log("🔐 Checking access - User role:", `'${userRole}'`, "| Allowed roles:", allowed);
          
          // If user has 'admin' role, always allow access
          if (userRole === 'admin') {
            console.log("✅ Admin access granted");
            next();
            return;
          }
          // If user is a recruiter, allow access to admin routes
          if (userRole === 'recruiter' && allowed.includes('admin')) {
            console.log("✅ Recruiter has admin access");
            next();
            return;
          }
          // Check if user has any of the allowed roles
          else if (userRole && allowed.includes(userRole)) {
            console.log(`✅ Access granted for role: ${userRole}`);
            next();
            return;
          }
          
          // If we get here, access is denied
          console.log(`⚠️ authMiddleware: Access denied - Role '${userRole}' not in`, allowed);
          return res.status(403).json({ 
            success: false, 
            message: `Forbidden - You don't have permission to access this resource` 
          });
        }

        console.log("✅ authMiddleware: Authentication successful, proceeding to route handler");
        next();
      } catch (verifyError: any) {
        console.error("❌ authMiddleware: Token verification failed:", verifyError.message);
        return res.status(401).json({ 
          success: false, 
          message: "Invalid or expired authentication token" 
        });
      }
    } catch (error: any) {
      console.error("❌ authMiddleware: Unexpected error:", error.message);
      return res.status(500).json({ 
        success: false, 
        message: "An error occurred during authentication" 
      });
    }
  };
};

export const optionalAuth: RequestHandler = (req, res, next) => {
  const token = extractToken(req);
  if (!token) return next();

  const secret = process.env.JWT_SECRET;
  if (!secret) return next();

  try {
    const decoded = jwt.verify(token, secret) as any;
    req.user = {
      id: decoded.id,
      email: decoded.email || '',
      role: (decoded.role || 'user').toLowerCase().trim(),
      ...decoded
    };
    console.log("🔐 Optional auth - Authenticated user:", req.user?.id);
  } catch (error) {
    console.log("ℹ️ Optional auth - Invalid token, continuing as guest");
  }
  
  next();
};

// Middleware to ensure user is authenticated and has the required role
export const requireAuth = (req: Request, res: Response, next: NextFunction) => {
  if (!req.user) {
    console.log("⚠️ requireAuth: User not authenticated");
    return res.status(401).json({ 
      success: false, 
      message: "Authentication required" 
    });
  }
  next();
};

export default authMiddleware;