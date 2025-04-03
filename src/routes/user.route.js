import { Router } from 'express';
import userController from '../controllers/user.controller.js';
import authMiddleware from '../middlewares/auth.middleware.js';
import { validId } from '../middlewares/global.middleware.js';

const router = Router();

// Rotas públicas
router.post('/create', userController.createController);

// Rotas autenticadas
router.use(authMiddleware); // ← Middleware de autenticação para todas as rotas abaixo

// Rotas que requerem autenticação
router.get('/', userController.findAllController);
router.get('/findById/:id?', userController.findByIdController); // tem validId, dps do teste adicionar
router.patch('/update/:id', userController.updateController);    // tem validId, dps do teste adicionar

// somente o proprio usuário pode se deletar.
// router.delete('/delete/:id', userController.deleteController);   // tem validId, dps do teste adicionar

export default router;