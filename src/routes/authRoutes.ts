import { Router } from 'express';
import * as authController from '../controllers/authController';

const router = Router();

// Making the request to login
router.post('/login', authController.login);

export default router;
