import { Router } from 'express';
import authController from '../controllers/auth.controller.js';

const router = Router();

router.post('/login', authController.loginController);
router.post('/refresh', authController.refreshTokenController);
router.post('/logout', authController.logoutController);

export default router;