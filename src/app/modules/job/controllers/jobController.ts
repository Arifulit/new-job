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

    // Get the job to check permissions
    const job = await jobService.getJobById(jobId);
    
    // Check permissions - only admin or job creator can close the job
    const isAdmin = req.user.role === 'admin';
    const isOwner = job.createdBy.toString() === req.user.id;
    
    if (!isAdmin && !isOwner) {
      return res.status(403).json({ 
        success: false, 
        message: 'You are not authorized to close this job' 
      });
    }

    const updatedJob = await jobService.closeJob(jobId, req.user.id);
    
    return res.status(200).json({
      success: true,
      message: 'Job closed successfully',
      data: updatedJob
    });
  } catch (error: any) {
    console.error('Error in closeJob controller:', error);
    
    if (error.message === 'Job not found') {
      return res.status(404).json({
        success: false,
        message: 'Job not found'
      });
    }
    
    if (error.message === 'Not authorized to close this job') {
      return res.status(403).json({
        success: false,
        message: error.message
      });
    }
    
    return res.status(500).json({
      success: false,
      message: process.env.NODE_ENV === 'development' 
        ? error.message 
        : 'Failed to close job'
    });
  }
};

// Get job by ID - accessible by all authenticated users
export const getJobById: AuthenticatedHandler = async (req, res, next) => {
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
    
    const job = await jobService.getJobById(jobId);
    
    return res.status(200).json({ 
      success: true, 
      data: job 
    });
  } catch (error: any) {
    // Handle specific error types
    if (error.message.includes('not found')) {
      return res.status(404).json({
        success: false,
        message: 'Job not found'
      });
    }
    
    // Handle invalid ID format
    if (error.message.includes('Invalid job ID')) {
      return res.status(400).json({
        success: false,
        message: 'Invalid job ID format'
      });
    }
    
    // Pass other errors to the error handling middleware
    console.error('Error in getJobById:', error);
    
    // Handle specific error types
    if (error.message.includes('not found')) {
      return res.status(404).json({
        success: false,
        message: 'Job not found'
      });
    }
    
    // Default error response
    return res.status(500).json({
      success: false,
      message: 'An error occurred while fetching the job'
    });
  }
};

// Get all jobs - with optional filters
// In jobController.ts
export const getJobs: AuthenticatedHandler = async (req, res) => {
  try {
    const { 
      q, 
      location, 
      jobType, 
      experienceLevel,
      salaryMin,
      salaryMax,
      company,
      sortBy = 'createdAt',
      sortOrder = 'desc',
      page = 1,
      limit = 10
    } = req.query;

    // Build filters
    const filters: any = {};
    
    if (location) filters.location = new RegExp(location, 'i');
    if (jobType) filters.jobType = { $in: Array.isArray(jobType) ? jobType : [jobType] };
    if (experienceLevel) {
      filters.experienceLevel = { 
        $in: Array.isArray(experienceLevel) ? experienceLevel : [experienceLevel] 
      };
    }
    if (salaryMin || salaryMax) {
      filters.salary = {};
      if (salaryMin) filters.salary.$gte = Number(salaryMin);
      if (salaryMax) filters.salary.$lte = Number(salaryMax);
    }
    if (company) filters.company = company;

    // If there's a search query, use text search
    if (q) {
      filters.$text = { $search: q as string };
    }

    // If no search query, use regular filtering
    const pageNum = parseInt(page as string) || 1;
    const limitNum = Math.min(parseInt(limit as string) || 10, 50);
    const skip = (pageNum - 1) * limitNum;

    const [jobs, total] = await Promise.all([
      jobService.getJobs({
        filters,
        sort: { [sortBy as string]: sortOrder === 'asc' ? 1 : -1 },
        skip,
        limit: limitNum,
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
        page: pageNum,
        limit: limitNum,
        totalPages: Math.ceil(total / limitNum)
      }
    });

  } catch (error) {
    console.error('Error in getJobs controller:', error);
    return res.status(500).json({
      success: false,
      message: 'An error occurred while fetching jobs'
    });
  }
};