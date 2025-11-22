
import { Router, Request, Response, NextFunction } from "express";
import { authMiddleware } from "../../../../middleware/auth";
import { updateUserRole } from "../services/userService";
import { AuthenticatedRequest } from "../../../../types/express";
import {
  getAllUsersController,
  getAllCandidatesController,
  getAllRecruitersController,
  getAllUsersFromDBController,
  suspendUserController,
  impersonateUserController
} from "../controllers/userController";

const router = Router();

// Get all users (both candidates and recruiters)
router.get("/", authMiddleware(["admin"]), getAllUsersController);

// Get all users from database (all roles)
router.get("/all", authMiddleware(["admin"]), getAllUsersFromDBController);

// Get all candidates
router.get("/candidates", authMiddleware(["admin"]), getAllCandidatesController);

// Get all recruiters
router.get("/recruiters", authMiddleware(["admin"]), getAllRecruitersController);

// Suspend/Unsuspend a user
router.put("/:userId/suspend", authMiddleware(["admin"]), suspendUserController);

// Impersonate a user
router.post("/:userId/impersonate", authMiddleware(["admin"]), impersonateUserController);

// Update user role - This allows admin to change a user's role
router.put(
  "/:userId/role",
  // Debug middleware
  (req: Request, res: Response, next: NextFunction) => {
    console.log('Role update route hit', {
      params: req.params,
      body: req.body,
      method: req.method,
      url: req.originalUrl,
      headers: req.headers
    });
    next();
  },
  // Authentication and authorization - only admin can change roles
  authMiddleware(["admin"]),
  // Role update controller
  async (req: AuthenticatedRequest, res: Response) => {
    try {
      const { userId } = req.params;
      const { role } = req.body;

      if (!role) {
        return res.status(400).json({
          success: false,
          message: "Role is required",
          error: {
            code: "MISSING_ROLE",
            description: "The 'role' field is required in the request body"
          }
        });
      }

      const result = await updateUserRole(userId, role);
      
      return res.status(200).json({
        success: true,
        message: result.message,
        data: result.data
      });
    } catch (error: any) {
      console.error("Error in updateUserRoleController:", error);
      
      let statusCode = 500;
      let errorCode = "ROLE_UPDATE_ERROR";
      let errorMessage = error.message || "Error updating user role";
      
      if (error.message.includes("User not found")) {
        statusCode = 404;
        errorCode = "USER_NOT_FOUND";
      } else if (error.message.includes("Cannot change role of a suspended user")) {
        statusCode = 400;
        errorCode = "USER_SUSPENDED";
      } else if (error.message.includes("Invalid role")) {
        statusCode = 400;
        errorCode = "INVALID_ROLE";
      }
      
      return res.status(statusCode).json({
        success: false,
        message: errorMessage,
        error: {
          code: errorCode,
          description: errorMessage
        }
      });
    }
  }
);

export default router;