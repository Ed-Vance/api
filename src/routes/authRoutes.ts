import { Router } from 'express';
import * as authController from '../controllers/authController';

const router = Router();

// Login route
router.post('/login', authController.login);

// Signup route
router.post('/signup', authController.signup);

export default router;
