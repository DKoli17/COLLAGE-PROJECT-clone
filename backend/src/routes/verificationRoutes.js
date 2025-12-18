import express from 'express';
import multer from 'multer';
import path from 'path';
import {
  sendVerificationCode,
  verifyEmailCode,
  uploadStudentId,
  initiateSheerIdVerification,
  getVerificationStatus,
  approveStudentVerification,
  rejectStudentVerification,
} from '../controllers/verificationController.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/student-ids');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|pdf/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Only image and PDF files are allowed'));
    }
  },
});

// Public routes
router.post('/send-code', sendVerificationCode);
router.post('/verify-code', verifyEmailCode);
router.post('/sheerid', initiateSheerIdVerification);

// Protected routes
router.post('/upload-student-id', authenticate, upload.single('studentId'), uploadStudentId);
router.get('/status', authenticate, getVerificationStatus);
router.get('/:userId/status', getVerificationStatus);

// Admin routes
router.put('/:userId/approve', authenticate, approveStudentVerification);
router.put('/:userId/reject', authenticate, rejectStudentVerification);

export default router;
