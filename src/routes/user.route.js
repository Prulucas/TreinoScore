import { Router } from 'express';
import userController from '../controllers/user.controller.js';
import authMiddleware from '../middlewares/auth.middleware.js';
import { validId } from '../middlewares/global.middleware.js';

const router = Router();

// Rotas públicas
router.post('/create', userController.createController);

// Rotas protegidas (requerem autenticação)
router.use(authMiddleware);

router.get('/', userController.findAllController);
router.get('/profile', userController.profileController);
router.get('/findById/:id?', validId, userController.findByIdController);
router.patch('/update/:id', validId, userController.updateController);
router.delete('/delete/:id', validId, userController.deleteController);

export default router;