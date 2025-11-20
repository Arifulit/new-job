import { Request, Response } from "express";
import * as candidateProfileService from "../services/candidateProfileService";

export const createCandidateProfileController = async (req: Request, res: Response) => {
  try {
    console.log("🟦 Controller: Creating profile");
    console.log("🟦 Request body:", req.body);
    
    const profile = await candidateProfileService.createCandidateProfile(req.body);
    
    console.log("✅ Controller: Profile created successfully");
    res.status(201).json({ success: true, data: profile });
  } catch (error: any) {
    console.error("❌ Controller Error (create):", error.message);
    
    // Handle duplicate key error
    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: "Profile already exists for this user"
      });
    }
    
    // Handle validation errors
    if (error.name === "ValidationError") {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: error.errors
      });
    }
    
    res.status(500).json({ 
      success: false, 
      message: error.message || "Error creating profile" 
    });
  }
};

export const getCurrentCandidateProfileController = async (req: Request, res: Response) => {
  try {
    console.log("🟦 Controller: Getting current candidate profile");
    
    // If user is not authenticated
    if (!req.user?.id) {
      console.log("⚠️ Controller: No user authenticated");
      return res.status(401).json({ 
        success: false, 
        message: "Authentication required. Please log in to view your profile.",
        error: {
          code: "AUTH_REQUIRED",
          description: "No valid authentication token provided"
        }
      });
    }

    console.log("🟦 User authenticated, userId:", req.user.id);
    const profile = await candidateProfileService.getCandidateProfile(req.user.id);
    
    if (!profile) {
      console.log("⚠️ Controller: Profile not found for userId:", req.user.id);
      return res.status(404).json({ 
        success: false, 
        message: "Profile not found",
        error: {
          code: "PROFILE_NOT_FOUND",
          description: "No candidate profile exists for this user. Please create a profile first.",
          solution: "Make a POST request to create a new profile"
        }
      });
    }

    console.log("✅ Controller: Profile retrieved successfully");
    return res.status(200).json({ 
      success: true, 
      message: "Candidate profile retrieved successfully",
      data: profile 
    });
    
  } catch (error: any) {
    console.error("❌ Controller Error (getCurrentCandidateProfile):", error.message);
    
    // Handle specific error types
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: "Invalid user ID format",
        error: {
          code: "INVALID_ID_FORMAT",
          description: "The provided user ID is not in the correct format"
        }
      });
    }
    
    return res.status(500).json({ 
      success: false, 
      message: "An unexpected error occurred while retrieving the profile",
      error: {
        code: "SERVER_ERROR",
        description: error.message || "Internal server error"
      }
    });
  }
};

export const getCandidateProfileController = async (req: Request, res: Response) => {
  try {
    console.log("🟦 Controller: Getting profile");
    console.log("🟦 UserId param:", req.params.userId);
    
    const profile = await candidateProfileService.getCandidateProfile(req.params.userId);
    
    if (!profile) {
      console.log("⚠️ Controller: Profile not found");
      return res.status(404).json({ 
        success: false, 
        message: "Profile not found" 
      });
    }
    
    console.log("✅ Controller: Profile retrieved successfully");
    res.status(200).json({ success: true, data: profile });
  } catch (error: any) {
    console.error("❌ Controller Error (get):", error.message);
    res.status(500).json({ 
      success: false, 
      message: error.message || "Error getting profile" 
    });
  }
};

export const updateCurrentCandidateProfileController = async (req: Request, res: Response) => {
  try {
    console.log("🟦 Controller: Updating current candidate profile");
    console.log("🟦 User from request:", req.user);
    console.log("🟦 Update data:", req.body);
    
    // If user is authenticated, update their profile
    if (req.user?.id) {
      console.log("🟦 User authenticated, userId:", req.user.id);
      await candidateProfileService.updateCandidateProfile(
        req.user.id,
        req.body
      );
      
      const profile = await candidateProfileService.getCandidateProfile(req.user.id);
      
      if (!profile) {
        console.log("⚠️ Controller: Profile not found after update");
        return res.status(404).json({
          success: false,
          message: "Profile not found"
        });
      }
      
      console.log("✅ Controller: Profile updated successfully");
      return res.status(200).json({ 
        success: true, 
        message: "Profile successfully updated",
        data: profile 
      });
    }
    
    // If not authenticated, return error
    console.log("⚠️ Controller: No user authenticated");
    return res.status(401).json({ 
      success: false, 
      message: "Please authenticate with a valid token to update your profile" 
    });
  } catch (error: any) {
    console.error("❌ Controller Error (updateCurrentCandidateProfile):", error.message);
    
    // Handle validation errors
    if (error.name === "ValidationError") {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: error.errors
      });
    }
    
    return res.status(500).json({ 
      success: false, 
      message: error.message || "Error updating profile" 
    });
  }
};

export const updateCandidateProfileController = async (req: Request, res: Response) => {
  try {
    console.log("🟦 Controller: Updating profile");
    console.log("🟦 UserId param:", req.params.userId);
    console.log("🟦 Update data:", req.body);
    
    await candidateProfileService.updateCandidateProfile(
      req.params.userId,
      req.body
    );
    
    const profile = (await candidateProfileService.getCandidateProfile(req.params.userId)) as any;
    
    if (!profile) {
      console.log("⚠️ Controller: Profile not found for update");
      return res.status(404).json({
        success: false,
        message: "Profile not found"
      });
    }
    
    console.log("✅ Controller: Profile updated successfully");
    res.status(200).json({ success: true, data: profile });
  } catch (error: any) {
    console.error("❌ Controller Error (update):", error.message);
    
    // Handle validation errors
    if (error.name === "ValidationError") {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: error.errors
      });
    }
    
    res.status(500).json({ 
      success: false, 
      message: error.message || "Error updating profile" 
    });
  }
};