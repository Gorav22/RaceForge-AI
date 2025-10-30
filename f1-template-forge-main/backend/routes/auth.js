import express from 'express';
import { register, login, getMe } from '../controllers/authController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

/**
 * @route   POST /api/auth/register
 * @access  Public
 */
router.post('/register', register);

/**
 * @route   POST /api/auth/login
 * @access  Public
 */
router.post('/login', login);

/**
 * @route   GET /api/auth/me
 * @access  Private
 */
router.get('/me', protect, getMe);

export default router;

