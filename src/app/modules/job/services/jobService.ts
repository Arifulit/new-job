// src/app/modules/job/services/jobService.ts
import { Job, IJob } from "../models/Job";
import { FilterQuery, Types } from "mongoose";

interface GetJobsOptions {
  filters?: FilterQuery<IJob>;
  sort?: Record<string, 1 | -1 | 'asc' | 'desc'>;
  skip?: number;
  limit?: number;
  select?: string;
  populate?: string | Record<string, string> | (string | Record<string, string>)[];
  company?: Types.ObjectId | string;
}

export interface IJobUpdateData extends Partial<Omit<IJob, 'createdBy' | 'createdAt' | 'updatedAt'>> {
  // Add any additional fields that can be updated
}

export const createJob = async (data: Omit<IJob, 'createdAt' | 'updatedAt'>) => {
  try {
    return await Job.create(data);
  } catch (error) {
    throw new Error(`Failed to create job: ${error instanceof Error ? error.message : String(error)}`);
  }
};

export const updateJob = async (id: string, data: IJobUpdateData) => {
  try {
    const job = await Job.findByIdAndUpdate(
      id,
      { 
        ...data,
        $currentDate: { updatedAt: true } // Ensure updatedAt is always updated
      },
      { new: true, runValidators: true }
    ).populate("createdBy", "name email");
    
    if (!job) {
      throw new Error("Job not found");
    }
    
    return job;
  } catch (error) {
    throw new Error(`Failed to update job: ${error instanceof Error ? error.message : String(error)}`);
  }
};

// // export const getJobs = async (options: GetJobsOptions = {}) => {
// //   const {
// //     filters = {},
// //     sort = { createdAt: -1 },
// //     skip = 0,
// //     limit = 10,
// //     select = '',
// //     populate = [
// //       { path: 'createdBy', select: 'name email' },
// //       { path: 'company', select: 'name logo' }
// //     ]
// //   } = options;

// //   try {
// //     let query = Job.find(filters)
// //       .sort(sort)
// //       .skip(skip)
// //       .limit(limit)
// //       .select(select);

// //     // Apply population
// //     if (populate) {
// //       if (Array.isArray(populate)) {
// //         populate.forEach(p => {
// //           query = query.populate(p);
// //         });
// //       } else {
// //         query = query.populate(populate);
// //       }
// //     }

// //     return await query.lean().exec();
// //   } catch (error) {
// //     console.error('Error in getJobs service:', error);
// //     throw new Error(`Failed to fetch jobs: ${error instanceof Error ? error.message : String(error)}`);
// //   }
// // };

// // export const countJobs = async (filters: any = {}) => {
// //   try {
// //     return await Job.countDocuments(filters);
// //   } catch (error) {
// //     console.error('Error in countJobs service:', error);
// //     throw new Error(`Failed to count jobs: ${error instanceof Error ? error.message : String(error)}`);
// //   }
// // };

// // export const searchJobs = async (searchTerm: string, options: any = {}) => {
// //   const {
// //     filters = {},
// //     sort = { score: { $meta: 'textScore' } },
// //     limit = 10,
// //     page = 1
// This is a clean separation from the commented code above
// The commented code has been removed to fix the syntax error

// Update the getJobs function to include company in the filters
export const getJobs = async (options: GetJobsOptions = {}) => {
  const {
    filters = {},
    sort = { createdAt: -1 },
    skip = 0,
    limit = 10,
    select = '',
    populate = [
      { path: 'createdBy', select: 'name email' },
      { path: 'company', select: 'name logo' }
    ],
    company
  } = options;

  // Add company to filters if provided
  if (company) {
    filters.company = company;
  }

  try {
    let query = Job.find(filters)
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .select(select);

    // Apply population with type assertions to avoid complex union types
    if (populate) {
      if (Array.isArray(populate)) {
        // Type assertion to any[] to avoid complex union types
        query = query.populate(populate as any[]);
      } else {
        // Type assertion for string or object populate
        query = query.populate(populate as string | Record<string, string>);
      }
    }

    return await query.lean().exec();
  } catch (error) {
    console.error('Error in getJobs service:', error);
    throw new Error(`Failed to fetch jobs: ${error instanceof Error ? error.message : String(error)}`);
  }
};

export const closeJob = async (jobId: string, userId: Types.ObjectId | string) => {
  try {
    const job = await Job.findById(jobId);
    
    if (!job) {
      throw new Error('Job not found');
    }
    
    // Convert both IDs to strings for comparison
    const userIdStr = userId.toString();
    const createdByIdStr = job.createdBy?.toString();
    
    // Check if the user is the owner or admin
    const isOwner = createdByIdStr === userIdStr;
    const isAdmin = false; // Replace with actual admin check if needed
    
    if (!isOwner && !isAdmin) {
      throw new Error('Not authorized to close this job');
    }
    
    job.status = 'closed';
    job.updatedAt = new Date();
    
    return await job.save();
  } catch (error) {
    throw new Error(`Failed to close job: ${error instanceof Error ? error.message : String(error)}`);
  }
};
