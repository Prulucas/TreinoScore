import { Router } from 'express';
import { WorkoutController } from '../controllers/workout.controller.js';
import authMiddleware from '../middlewares/auth.middleware.js';
import { checkRole } from '../middlewares/role.middleware.js';

const router = Router();
const controller = new WorkoutController();

// Rotas autenticadas
router.use(authMiddleware);

// Primeiro, rotas POST específicas
router.post('/default/:userId', checkRole(['admin', 'professor']), controller.createDefault);
router.post('/create/:userId', checkRole(['admin', 'professor']), controller.create);


// create treino (verificar depois checkRole) // create treino, add depois do teste: checkRole(['admin', 'professor']),

// Depois, rotas GET para evitar conflito com parâmetros dinâmicos
router.get('/byuser/:userId?', controller.getByUser);
router.get('getworkout/:id', controller.getById); //buscar treino por id

// Rotas de atualização e remoção
router.patch('/update/:id', checkRole(['admin', 'professor']), controller.update);
router.delete('/delete/:id', checkRole(['admin', 'professor']), controller.delete);

router.put(
    '/reset-status',
    authMiddleware,
    checkRole(['admin']),
    async (req, res) => {
        try {
            await Workout.update({ status: 'pending' }, { where: {} });
            res.status(200).json({ message: 'Status dos treinos resetado com sucesso!' });
        } catch (error) {
            res.status(500).json({ error: 'Erro ao resetar status dos treinos' });
        }
    }
);



export default router;