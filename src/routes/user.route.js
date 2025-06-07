/**
 * ================================================================
 * Arquivo: user.route.js
 * Autor: Pedro Lucas
 * Ano: 2025
 * GitHub: https://github.com/Prulucas
 * ================================================================
 *
 * Descrição:
 * Este arquivo define as rotas para a manipulação de usuários na aplicação.
 * Ele inclui rotas públicas para a criação de usuários e rotas autenticadas
 * para a recuperação, atualização e exclusão de usuários, com verificação
 * de autenticação e permissões de role.
 */

import { Router } from 'express';
import userController from '../controllers/user.controller.js';
import authMiddleware from '../middlewares/auth.middleware.js';
import { verifyAdminOrOwner } from '../middlewares/global.middleware.js';
import { checkRole } from '../middlewares/role.middleware.js';

const router = Router();

// Rotas públicas
router.post('/create', userController.createController); // Rota para criar um novo usuário

// Rotas autenticadas
router.use(authMiddleware); // Middleware de autenticação para todas as rotas abaixo

// Rotas que requerem autenticação
router.get('/getall', checkRole(['admin', 'professor']), userController.findAllController); // Rota para buscar todos os usuários, acessível para admin ou professor
router.get('/findById/:id', checkRole(['admin', 'professor']), userController.findByIdController); // Rota para buscar um usuário por ID, acessível para admin ou professor

// Apenas o próprio usuário ou admin pode atualizar ou deletar um usuário
router.patch('/update/:userId', checkRole(['admin', 'professor']), userController.updateController); // Rota para atualizar o usuário, validação feita pelo middleware
router.delete('/delete/:userId', checkRole(['admin', 'professor']), userController.deleteController); // Rota para deletar o usuário, validação feita pelo middleware

export default router;
