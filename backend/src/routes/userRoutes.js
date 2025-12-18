import express from 'express';
import {
  getAllUsers,
  getUserById,
  updateUserRole,
  verifyUser,
  deactivateUser,
} from '../controllers/userController.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

router.get('/', authenticate, getAllUsers);
router.get('/:id', authenticate, getUserById);
router.put('/:id/role', authenticate, updateUserRole);
router.put('/:id/verify', authenticate, verifyUser);
router.put('/:id/deactivate', authenticate, deactivateUser);

export default router;
