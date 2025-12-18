import express from 'express';
import { signup, login, getCurrentUser, updateProfile, deleteAccount } from '../controllers/authController.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

router.post('/signup', signup);
router.post('/login', login);
router.get('/me', authenticate, getCurrentUser);
router.put('/profile', authenticate, updateProfile);
router.delete('/account', authenticate, deleteAccount);

export default router;
