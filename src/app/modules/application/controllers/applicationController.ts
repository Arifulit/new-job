import { Request, Response, RequestHandler } from "express";
import * as applicationService from "../services/applicationService";
import { Job } from "../../job/models/Job";
import { Application } from "../models/Application";
import { Types } from "mongoose";

// Define authenticated request interface
export type UserRole = 'admin' | 'recruiter' | 'candidate';

export interface AuthenticatedRequest extends Request {
  user: {
    id: string;
    role: UserRole;
    email: string;
  };
}

export const applyJob = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { job, jobId, resume, resumeUrl, coverLetter } = req.body;
    
    // Use jobId if provided, otherwise use job (for backward compatibility)
    const jobToApply = jobId || job;
    
    if (!jobToApply) {
      return res.status(400).json({ 
        success: false, 
        message: "Job ID is required" 
      });
    }

    // Prepare application data
    const applicationData: any = {
      job: jobToApply,
      candidate: req.user.id,
      status: 'Applied' // Default status
    };

    // Add optional fields if they exist
    if (resume || resumeUrl) {
      applicationData.resume = resume || resumeUrl;
    }
    
    if (coverLetter) {
      applicationData.coverLetter = coverLetter;
    }
    
    // Submit the application
    const application = await applicationService.applyJob(applicationData);
    
    // Return success response
    res.status(201).json({ 
      success: true, 
      message: 'Application submitted successfully',
      data: application 
    });
    
  } catch (err: any) {
    console.error('Error submitting application:', err);
    const statusCode = err.name === 'ValidationError' ? 400 : 500;
    
    res.status(statusCode).json({ 
      success: false, 
      message: err.message || 'An error occurred while submitting the application',
      error: process.env.NODE_ENV === 'development' ? err : undefined
    });
  }
};

export const updateApplication = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const application = await applicationService.updateApplication(req.params.id, req.body);
    res.status(200).json({ success: true, data: application });
  } catch (err: any) {
    res.status(404).json({ success: false, message: err.message });
  }
};

export const getCandidateApplications = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const applications = await applicationService.getApplicationsByCandidate(req.user.id);
    res.status(200).json({ success: true, data: applications });
  } catch (err: any) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// In applicationController.ts


// Get job applications with proper authorization
export const getJobApplications = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { jobId } = req.params;
    const { status } = req.query as { status?: string };
    const userId = req.user.id;
    const userRole = req.user.role;

    if (!userId || !userRole) {
      return res.status(401).json({ 
        success: false, 
        message: 'Authentication required' 
      });
    }

    // Get job with createdBy field
    const job = await Job.findById(jobId).select('createdBy').lean();
    if (!job) {
      return res.status(404).json({ 
        success: false, 
        message: 'Job not found' 
      });
    }

    // Admin can view all applications
    if (userRole === 'admin') {
      const applications = await Application.find({ job: jobId })
        .populate('candidate', 'name email')
        .sort({ appliedAt: -1 });
      
      return res.status(200).json({ 
        success: true, 
        data: applications 
      });
    }

    // Recruiter can only view applications for their own jobs
    if (userRole === 'recruiter') {
      // Convert both IDs to string for comparison
      const jobCreatorId = job.createdBy.toString();
      const currentUserId = userId.toString();
      
      console.log(`Job created by: ${jobCreatorId}, Current user: ${currentUserId}`);
      
      if (jobCreatorId !== currentUserId) {
        console.log('Access denied - User is not the creator of this job');
        return res.status(403).json({ 
          success: false, 
          message: 'Not authorized to view these applications' 
        });
      }

      const query: any = { job: new Types.ObjectId(jobId) };
      if (status) {
        query.status = status;
      }

      const applications = await Application.find(query)
        .populate('candidate', 'name email')
        .sort({ appliedAt: -1 });

      return res.status(200).json({ 
        success: true, 
        data: applications 
      });
    }

    // If none of the above, deny access
    return res.status(403).json({ 
      success: false, 
      message: 'Not authorized' 
    });

  } catch (error: any) {
    console.error('Error fetching job applications:', error);
    return res.status(500).json({ 
      success: false, 
      message: error.message || 'Failed to fetch job applications' 
    });
  }
};

export const getJobApplicationsNew = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const applications = await applicationService.getApplicationsByJob(req.params.jobId);
    res.status(200).json({ success: true, data: applications });
  } catch (err: any) {
    res.status(400).json({ success: false, message: err.message });
  }
};



// import { createNotification } from "../../notification/services/notificationService";

// // যখন এমপ্লয়ারের দ্বারা status update হবে
// await createNotification({
//   user: application.candidate, 
//   type: "Application",
//   message: `Your application status for ${application.job} has been updated to ${application.status}`,
// }, true, candidateEmail); // true মানে email পাঠাবে