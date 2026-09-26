import express from 'express';
import { submitApplication, getMyApplications, getScrutinyQueue, reviewApplication } from '../controllers/application.controller.js';
import { getDashboardStats } from '../controllers/analytics.controller.js';
import { protect, authorize } from '../middlewares/auth.middleware.js';
import { upload } from '../middlewares/upload.middleware.js';

const router = express.Router();

// Student Routes
router.post(
  '/submit',
  protect,
  authorize('STUDENT'),
  upload.fields([
    { name: 'incomeDoc', maxCount: 1 },
    { name: 'casteDoc', maxCount: 1 }
  ]),
  submitApplication
);
router.get('/my-applications', protect, authorize('STUDENT'), getMyApplications);

// Scrutinizer / Admin Queue
router.get('/scrutiny-queue', protect, authorize('SCRUTINIZER', 'SUPER_ADMIN'), getScrutinyQueue);
router.patch('/:id/review', protect, authorize('SCRUTINIZER', 'SUPER_ADMIN'), reviewApplication);

// Admin Analytics Dashboard
router.get('/analytics/dashboard', protect, authorize('SUPER_ADMIN', 'SCRUTINIZER'), getDashboardStats);

export default router;