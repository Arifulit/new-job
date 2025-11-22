// src/app/modules/job/controllers/jobController.ts
import { Response, NextFunction } from "express";
import * as jobService from "../services/jobService";
import { AuthenticatedRequest } from "../../../../types/express";
import { IJobUpdateData, Job } from "../models/Job";
import { Types } from "mongoose";

type SearchOptions = {
  filters?: any;
  sort?: any;
  page?: number;
  limit?: number;
};

export type AuthenticatedHandler = (req: AuthenticatedRequest, res: Response, next: NextFunction) => Promise<Response | void>;

// Get job by ID
// In jobController.ts
// In jobController.ts
export const getJobById = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    
    if (!Types.ObjectId.isValid(id)) {
      return res.status(400).json({ 
        success: false, 
        message: 'Invalid job ID' 
      });
    }

    const job = await jobService.getJobById(id);
    
    if (!job) {
      return res.status(404).json({ 
        success: false,
        message: 'Job not found' 
      });
    }

    // Allow all authenticated users to view job details
    return res.status(200).json({
      success: true,
      data: job
    });
  } catch (error) {
    console.error('Error in getJobById:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: {
        code: 'INTERNAL_SERVER_ERROR',
        description: error instanceof Error ? error.message : 'An unknown error occurred'
      }
    });
  }
};


// Input validation middleware for job creation
const validateJobInput = (data: any): { isValid: boolean; message?: string } => {
  if (!data.title || typeof data.title !== 'string' || data.title.trim().length < 5) {
    return { isValid: false, message: 'Title is required and must be at least 5 characters long' };
  }
  if (!data.description || typeof data.description !== 'string' || data.description.trim().length < 20) {
    return { isValid: false, message: 'Description is required and must be at least 20 characters long' };
  }
  if (!data.location || typeof data.location !== 'string') {
    return { isValid: false, message: 'Location is required' };
  }
  return { isValid: true };
};

export const createJob: AuthenticatedHandler = async (req, res, next) => {
  try {
    // Type guard to ensure user is defined
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
    }

    // Only admin and recruiter can create jobs
    if (req.user.role !== 'admin' && req.user.role !== 'recruiter') {
      return res.status(403).json({ 
        success: false, 
        message: 'Only admin and recruiters can create job postings' 
      });
    }

    // Validate input
    const validation = validateJobInput(req.body);
    if (!validation.isValid) {
      return res.status(400).json({
        success: false,
        message: validation.message || 'Invalid job data'
      });
    }

    const jobData = {
      ...req.body,
      createdBy: new Types.ObjectId(req.user.id) // Ensure proper ObjectId type
    };
    
    const job = await jobService.createJob(jobData);
    return res.status(201).json({ 
      success: true, 
      data: job 
    });
  } catch (error: any) {
    next(error);
  }
};

// Update job - only admin or the recruiter who created it can update
export const updateJob: AuthenticatedHandler = async (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
    }

    const jobId = req.params.id;
    
    // Basic validation of job ID
    if (!jobId || !Types.ObjectId.isValid(jobId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid job ID format'
      });
    }

    // Get the job to check permissions
    const job = await jobService.getJobById(jobId);
    
    // Check permissions
    const isAdmin = req.user.role === 'admin';
    const isOwner = job.createdBy.toString() === req.user.id;
    
    if (!isAdmin && !isOwner) {
      return res.status(403).json({ 
        success: false, 
        message: 'You are not authorized to update this job' 
      });
    }

    // Prepare update data
    const updateData: IJobUpdateData = {
      ...req.body,
      // Prevent updating createdBy and timestamps through the API
      createdBy: undefined,
      createdAt: undefined,
      updatedAt: undefined
    };

    // Validate the update data if needed
    if (updateData.title && (typeof updateData.title !== 'string' || updateData.title.trim().length < 5)) {
      return res.status(400).json({
        success: false,
        message: 'Title must be at least 5 characters long'
      });
    }

    const updatedJob = await jobService.updateJob(jobId, updateData);
    
    return res.status(200).json({ 
      success: true, 
      data: updatedJob 
    });
  } catch (error: any) {
    // Log the detailed error for debugging
    console.error('Error in updateJob:', {
      message: error.message,
      name: error.name,
      stack: error.stack,
      ...(error.errors && { errors: error.errors }),
      ...(error.code && { code: error.code })
    });

    // Handle specific error types
    if (error.message === 'Job not found' || error.message.includes('not found')) {
      return res.status(404).json({
        success: false,
        message: 'Job not found'
      });
    }
    
    // Handle validation errors
    if (error.name === 'ValidationError' || error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: error.message || 'Validation failed',
        ...(error.errors && { errors: error.errors })
      });
    }
    
    // Handle duplicate key errors
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'Duplicate key error. A job with this identifier already exists.'
      });
    }
    
    // Return the actual error message in development for debugging
    const errorMessage = process.env.NODE_ENV === 'development' 
      ? error.message 
      : 'An error occurred while updating the job';
    
    res.status(500).json({
      success: false,
      message: errorMessage
    });
  }
};

// Delete job - only admin or the recruiter who created it can delete
export const deleteJob: AuthenticatedHandler = async (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
    }

    const jobId = req.params.id;
    
    // Basic validation of job ID
    if (!jobId || !Types.ObjectId.isValid(jobId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid job ID format'
      });
    }

    // Get the job to check permissions
    const job = await jobService.getJobById(jobId);
    
    // Check permissions
    const isAdmin = req.user.role === 'admin';
    const isOwner = job.createdBy.toString() === req.user.id;
    
    if (!isAdmin && !isOwner) {
      return res.status(403).json({ 
        success: false, 
        message: 'You are not authorized to delete this job' 
      });
    }

    await jobService.deleteJob(jobId);
    
    return res.status(200).json({ 
      success: true, 
      message: 'Job deleted successfully' 
    });
  } catch (error: any) {
    // Handle specific error types
    if (error.message === 'Job not found') {
      return res.status(404).json({
        success: false,
        message: 'Job not found'
      });
    }
    
    // Pass other errors to the error handling middleware
    next(error);
  }
};

export const closeJob: AuthenticatedHandler = async (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
    }

    const jobId = req.params.jobId || req.params.id;
    
    if (!jobId || !Types.ObjectId.isValid(jobId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid job ID format'
      });
    }

    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Only admin can close jobs'
      });
    }

    const job = await jobService.closeJob(jobId, req.user._id);

    return res.status(200).json({
      success: true,
      data: job,
      message: 'Job closed successfully'
    });
  } catch (error) {
    next(error);
  }
};

// Reject a job (Admin only)
export const rejectJob: AuthenticatedHandler = async (req, res, next) => {
  try {
    if (req.user?.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Only admin can reject jobs'
      });
    }

    const { jobId } = req.params;
    const { reason } = req.body;

    if (!jobId) {
      return res.status(400).json({
        success: false,
        message: 'Job ID is required'
      });
    }

    if (!reason || typeof reason !== 'string' || reason.trim().length < 5) {
      return res.status(400).json({
        success: false,
        message: 'Rejection reason is required and must be at least 5 characters long'
      });
    }

    const job = await jobService.rejectJob(jobId, req.user._id, reason);

    return res.status(200).json({
      success: true,
      data: job,
      message: 'Job rejected successfully'
    });
  } catch (error) {
    next(error);
  }
};

// Get pending jobs (Admin only)
export const getPendingJobs: AuthenticatedHandler = async (req, res, next) => {
  try {
    if (req.user?.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Only admin can view pending jobs'
      });
    }

    const jobs = await jobService.getPendingJobs({
      filters: {},
      sort: { createdAt: -1 }
    });

    return res.status(200).json({
      success: true,
      data: jobs
    });
  } catch (error) {
    next(error);
  }
};


// export const getJobs = async (req: AuthenticatedRequest, res: Response) => {

//   try {
//     const { 
//       page = '1', 
//       limit = '10',
//       search,
//       location,
//       jobType,
//       experienceLevel,
//       status,
//       salaryMin,
//       salaryMax,
//       company,
//       sortBy = 'createdAt',
//       sortOrder = 'desc'
//     } = req.query as {
//       page?: string;
//       limit?: string;
//       search?: string;
//       location?: string;
//       jobType?: string | string[];
//       experienceLevel?: string | string[];
//       status?: string;
//       salaryMin?: string;
//       salaryMax?: string;
//       company?: string;
//       sortBy?: string;
//       sortOrder?: string;
//     };

//     // Build filters
//     const filters: any = {};
    
//     if (location) filters.location = new RegExp(String(location), 'i');
//     if (search) filters.title = new RegExp(String(search), 'i');
//     if (search) filters.title = new RegExp(String(search), 'i');
//     if (company) filters.company = new RegExp(String(company), 'i');
    
//     if (jobType) {
//       filters.jobType = { 
//         $in: Array.isArray(jobType) 
//           ? jobType.map(String) 
//           : [String(jobType)] 
//       };
//     }
    
//     if (experienceLevel) {
//       filters.experienceLevel = { 
//         $in: Array.isArray(experienceLevel) 
//           ? experienceLevel.map(String) 
//           : [String(experienceLevel)]
//       };
//     }
    
//     if (salaryMin || salaryMax) {
//       filters.salary = {};
//       if (salaryMin) filters.salary.$gte = Number(salaryMin);
//       if (salaryMax) filters.salary.$lte = Number(salaryMax);
//     }

//     // If there's a search query, use text search
//     // Removed this block as 'q' is not defined in the query parameters

//     // If no search query, use regular filtering
//     const pageNum = Math.max(1, parseInt(String(page), 10) || 1);
//     const limitNum = Math.min(100, Math.max(1, parseInt(String(limit), 10) || 10));
//     const skip = (pageNum - 1) * limitNum;

//     // Build sort object
//     const sort: { [key: string]: 1 | -1 } = {};
//     const sortDirection = sortOrder === 'asc' ? 1 : -1;
//     sort[sortBy] = sortDirection;

//     // Execute query with pagination
//     const [jobs, total] = await Promise.all([
//       jobService.getJobs({
//         filters,
//         sort,
//         skip,
//         limit: limitNum,
//         populate: [
//           { path: 'createdBy', select: 'name email' },
//           { path: 'company', select: 'name logo' }
//         ]
//       }),
//       Job.countDocuments(filters)
//     ]);

//     return res.status(200).json({
//       success: true,
//       data: jobs,
//       pagination: {
//         total,
//         page: pageNum,
//         limit: limitNum,
//         totalPages: Math.ceil(total / limitNum)
//       }
//     });

//   } catch (error) {
//     console.error('Error in getJobs controller:', error);
//     return res.status(500).json({
//       success: false,
//       message: 'An error occurred while fetching jobs'
//     });
//   }
// };


export const getJobs = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { 
      page = '1', 
      limit = '10',
      search,
      location,
      skills,
      minSalary,
      maxSalary,
      company,
      jobType,
      experienceLevel,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query as {
      page?: string;
      limit?: string;
      search?: string;
      location?: string;
      skills?: string;
      minSalary?: string;
      maxSalary?: string;
      company?: string;
      jobType?: string | string[];
      experienceLevel?: string | string[];
      sortBy?: string;
      sortOrder?: 'asc' | 'desc';
    };

    // Build filters
    const filters: any = { status: 'active' }; // Only show active jobs by default
    
    // Text search (title, description, or company name)
    if (search) {
      filters.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    // Location filter (city or country)
    if (location) {
      filters.$or = filters.$or || [];
      filters.$or.push(
        { 'location.city': { $regex: location, $options: 'i' } },
        { 'location.country': { $regex: location, $options: 'i' } }
      );
    }

    // Skills filter (comma-separated list)
    if (skills) {
      const skillsArray = skills.split(',').map(skill => skill.trim());
      filters.requiredSkills = { $in: skillsArray.map(skill => new RegExp(`^${skill}$`, 'i')) };
    }

    // Salary range filter
    if (minSalary || maxSalary) {
      filters.salary = {};
      if (minSalary) {
        filters.salary.$gte = Number(minSalary);
      }
      if (maxSalary) {
        filters.salary.$lte = Number(maxSalary);
      }
    }

    // Company filter
    if (company) {
      filters['company.name'] = { $regex: company, $options: 'i' };
    }

    // Job Type filter
    if (jobType) {
      filters.jobType = {
        $in: Array.isArray(jobType) ? jobType : [jobType]
      };
    }

    // Experience Level filter
    if (experienceLevel) {
      filters.experienceLevel = {
        $in: Array.isArray(experienceLevel) ? experienceLevel : [experienceLevel]
      };
    }

    // Sorting
    const sort: any = {};
    if (sortBy) {
      sort[sortBy] = sortOrder === 'asc' ? 1 : -1;
    } else {
      sort.createdAt = -1; // Default sort by newest first
    }

    // Pagination
    const pageNumber = Math.max(1, parseInt(page, 10) || 1);
    const limitNumber = Math.min(100, Math.max(1, parseInt(limit, 10) || 10));
    const skip = (pageNumber - 1) * limitNumber;

    // Get jobs with filters
    const [jobs, total] = await Promise.all([
      jobService.getJobs({
        filters,
        sort,
        skip,
        limit: limitNumber,
        populate: [
          { path: 'createdBy', select: 'name email' },
          { path: 'company', select: 'name logo' }
        ]
      }),
      Job.countDocuments(filters)
    ]);

    return res.status(200).json({
      success: true,
      data: jobs,
      pagination: {
        total,
        page: pageNumber,
        limit: limitNumber,
        totalPages: Math.ceil(total / limitNumber)
      }
    });
  } catch (error) {
    console.error('Error in getJobs:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: {
        code: 'INTERNAL_SERVER_ERROR',
        description: error instanceof Error ? error.message : 'An unknown error occurred'
      }
    });
  }
};