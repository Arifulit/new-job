import { Request, Response } from "express";
import * as resumeService from "../services/resumeService";

export const uploadResumeController = async (req: Request, res: Response) => {
  try {
    console.log("🟦 Controller: Uploading resume");
    console.log("🟦 Request body:", req.body);
    
    const resume = await resumeService.uploadResume(req.body);
    
    console.log("✅ Controller: Resume uploaded successfully");
    res.status(201).json({ success: true, data: resume });
  } catch (error: any) {
    console.error("❌ Controller Error (upload):", error.message);
    
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
      message: error.message || "Error uploading resume" 
    });
  }
};

export const getResumeController = async (req: Request, res: Response) => {
  try {
    console.log("🟦 Controller: Getting resume");
    console.log("🟦 CandidateId param:", req.params.candidateId);
    
    const resume = await resumeService.getResumeByCandidate(req.params.candidateId);
    
    if (!resume) {
      console.log("⚠️ Controller: Resume not found");
      return res.status(404).json({ 
        success: false, 
        message: "Resume not found" 
      });
    }
    
    console.log("✅ Controller: Resume retrieved successfully");
    res.status(200).json({ success: true, data: resume });
  } catch (error: any) {
    console.error("❌ Controller Error (get resume):", error.message);
    res.status(500).json({ 
      success: false, 
      message: error.message || "Error getting resume" 
    });
  }
};