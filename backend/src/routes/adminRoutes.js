import express from 'express';
import {
  getPendingVendors,
  verifyVendor,
  rejectVendor,
  getAnalytics,
  getVendorAnalytics,
} from '../controllers/adminController.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

// Admin routes
router.get('/vendors/pending', authenticate, getPendingVendors);
router.post('/vendors/:id/verify', authenticate, verifyVendor);
router.delete('/vendors/:id/reject', authenticate, rejectVendor);
router.get('/analytics', authenticate, getAnalytics);

// Vendor analytics
router.get('/vendor-analytics', authenticate, getVendorAnalytics);

export default router;
