import { Router } from 'express';
import userController from '../controllers/user.controller.js';
import authMiddleware from '../middlewares/auth.middleware.js';
import { verifyAdminOrOwner } from '../middlewares/global.middleware.js';
import { checkRole } from '../middlewares/role.middleware.js';

const router = Router();

// Rotas públicas
router.post('/create', userController.createController);

// Rotas autenticadas
router.use(authMiddleware); // ← Middleware de autenticação para todas as rotas abaixo

// Rotas que requerem autenticação
router.get('/getall', checkRole(['admin', 'professor']), userController.findAllController);


router.get('/findById/:id', checkRole(['admin', 'professor']), userController.findByIdController); // tem validId, dps do teste adicionar
// tem validId, dps do teste adicionar


// somente o proprio usuário pode se deletar.
router.patch('/update/:userId', verifyAdminOrOwner, userController.updateController); // arrumar controller baseado no middleware
router.delete('/delete/:userId', verifyAdminOrOwner, userController.deleteController);   //  arrumar controller baseado no middleware

export default router;