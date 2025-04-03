import { Router } from 'express';
import { WorkoutController } from '../controllers/workout.controller.js';
import { authMiddleware } from '../middlewares/auth.middleware.js';
import { checkRole } from '../middlewares/role.middleware.js';

const router = Router();
const controller = new WorkoutController();

// Rotas autenticadas
router.use(authMiddleware);

// Rotas comuns
router.get('/:id', controller.getById);
router.get('/user/:userId?', controller.getByUser);

// Rotas para admin/teacher
router.post('/', checkRole(['admin', 'professor']), controller.create);
router.post('/default/:userId', checkRole(['admin', 'professor']), controller.createDefault);
router.patch('/:id', checkRole(['admin', 'professor']), controller.update);
router.delete('/:id', checkRole(['admin', 'professor']), controller.delete);

export default router;