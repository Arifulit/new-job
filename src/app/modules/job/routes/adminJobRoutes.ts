import { Router } from 'express';
import authMiddleware from '../../../middleware/auth';
import * as jobAdminController from '../controllers/jobAdminController';
import { json } from 'body-parser';

const router = Router();

// Add JSON body parser with a limit
router.use(json({ limit: '10kb' }));

// Protect all routes with admin authentication
router.use(authMiddleware(['admin']));

// Middleware to ensure request body is always an object
const ensureBody = (req: any, res: any, next: any) => {
  if (!req.body) req.body = {};
  next();
};

// Admin-only job approval routes
router.get('/pending', jobAdminController.getPendingJobs);

// Apply ensureBody middleware to POST routes
router.post('/:jobId/approve', ensureBody, jobAdminController.approveJob);
router.post('/:jobId/reject', ensureBody, jobAdminController.rejectJob);

export default router;
