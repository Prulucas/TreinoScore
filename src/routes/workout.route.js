import { Router } from 'express';
import { WorkoutController } from '../controllers/workout.controller.js';
import authMiddleware from '../middlewares/auth.middleware.js';
import { checkRole } from '../middlewares/role.middleware.js';
import { verifyOwnerByUserId } from '../middlewares/global.middleware.js';

const router = Router();
const controller = new WorkoutController();

// Aplica o middleware de autenticação JWT em todas as rotas abaixo
router.use(authMiddleware);

// ROTAS DE CRIAÇÃO

// Cria um treino "padrão" para um usuário específico (somente admin ou professor podem usar)
router.post('/default/:userId', checkRole(['admin', 'professor']), controller.createDefault); //testado

// Cria um novo treino personalizado para um usuário específico (também restrito a admin e professor)
router.post('/create/:userId', checkRole(['admin', 'professor']), controller.create); //testado

// ROTAS DE CONSULTA

// Retorna treinos de um usuário específico (se não passar userId, pode listar do usuário logado)
// Ex: GET /byuser/6 vai retornar treinos do userId 6
router.get('/workoutbyuser/:userId', checkRole(['admin', 'professor']), verifyOwnerByUserId, controller.getByUser);

// Retorna os detalhes de um treino específico pelo seu ID
// Ex: GET /getworkout/10 vai retornar o treino com id 10
router.get('/getworkout/:id', controller.getById);

// ROTAS DE ATUALIZAÇÃO E REMOÇÃO

// Atualiza um treino específico pelo ID (somente admin e professor podem atualizar)
// Ex: PATCH /update/6 atualiza o treino com id 6
router.patch('/update/:id', checkRole(['admin', 'professor']), controller.update); //testado

// Deleta (ou marca como deletado) um treino específico pelo ID (somente admin e professor podem deletar)
router.delete('/delete/:id', checkRole(['admin', 'professor']), controller.delete);

// ROTA ESPECIAL (ADMIN)

// Reseta o status de **todos os treinos** no banco para "pending" (apenas administradores podem usar)
// Ex: PUT /reset-status
router.put(
    '/reset-status',
    authMiddleware, // redundante aqui, pois já está no router.use acima, mas mantém segurança extra
    checkRole(['admin']),
    async (req, res) => {
        try {
            await Workout.update({ status: 'pending' }, { where: {} }); // Atualiza todos os treinos
            res.status(200).json({ message: 'Status dos treinos resetado com sucesso!' });
        } catch (error) {
            res.status(500).json({ error: 'Erro ao resetar status dos treinos' });
        }
    }
);

export default router;
