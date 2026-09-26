import express from 'express';
import {
  getActiveSchemes,
  getSchemeById,
  createScheme,
  updateScheme,
  toggleSchemeStatus
} from '../controllers/scheme.controller.js';
import { protect, authorize } from '../middlewares/auth.middleware.js';

const router = express.Router();

// Public / Student Routes
router.get('/', getActiveSchemes);
router.get('/:id', getSchemeById);

// Super Admin Management Routes
router.post('/', protect, authorize('SUPER_ADMIN'), createScheme);
router.put('/:id', protect, authorize('SUPER_ADMIN'), updateScheme);
router.patch('/:id/toggle', protect, authorize('SUPER_ADMIN'), toggleSchemeStatus);

export default router;