import { Router } from 'express';
import userRouter from './user.route.js';
import authRouter from './auth.route.js';
import workoutRouter from './workout.route.js'

const router = Router();

// Definição de rotas
router.use('/user', userRouter);
router.use('/auth', authRouter);
router.use('/workout', workoutRouter);

export default router;
