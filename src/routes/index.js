/**
 * ================================================================
 * Arquivo: index.js
 * Autor: Pedro Lucas
 * Ano: 2025
 * GitHub: https://github.com/Prulucas
 * ================================================================
 *
 * Descrição:
 * Este arquivo centraliza a definição das rotas da aplicação.
 * Ele importa as rotas específicas de usuários, autenticação e treinos,
 * e as registra no roteador principal do Express.
 */

import { Router } from 'express';
import userRouter from './user.route.js';
import authRouter from './auth.route.js';
import workoutRouter from './workout.route.js';

const router = Router();

// Definição de rotas
router.use('/user', userRouter);       // Rota para manipulação de usuários
router.use('/auth', authRouter);       // Rota para autenticação de usuários (login)
router.use('/workout', workoutRouter); // Rota para manipulação de treinos

export default router;
