import { Router } from 'express';
import { WorkoutController } from '../controllers/workout.controller.js';
import { authMiddleware } from '../middlewares/auth.middleware.js';
import { checkRole } from '../middlewares/role.middleware.js';

const router = Router();
const controller = new WorkoutController();

// Rotas autenticadas
//router.use(authMiddleware);

// Primeiro, rotas POST específicas
router.post('/default/:userId', checkRole(['admin', 'professor']), controller.createDefault);
router.post('/:userId', controller.create);
// create treino (verificar depois checkRole) // create treino, add depois do teste: checkRole(['admin', 'professor']),

// Depois, rotas GET para evitar conflito com parâmetros dinâmicos
router.get('/user/:userId?', controller.getByUser);
router.get('/:id', controller.getById); //buscar treino por id

// Rotas de atualização e remoção
router.patch('/:id', checkRole(['admin', 'professor']), controller.update);
router.delete('/:id', checkRole(['admin', 'professor']), controller.delete);


export default router;