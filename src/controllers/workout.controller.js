import { WorkoutService } from '../services/workout.service.js';
import User from '../models/User.js';
import Workout from '../models/Workout.js';

export class WorkoutController {
    constructor() {
        this.service = new WorkoutService;
    }

    create = async (req, res) => { // Use arrow function para manter o 'this'
        try {
            const workoutData = {
                ...req.body,
                userId: req.params.userId
            };

            const result = await this.service.createWorkout(workoutData);
            res.status(201).json(result);
        } catch (error) {
            res.status(400).json({
                message: error.message,
                error: "VALIDATION_ERROR"
            });
        }
    }

    getById = async (req, res) => {
        try {
            // Debug para verificar o valor do ID da URL
            console.log("ID da URL:", req.params.id);

            const workoutId = req.params.id;

            // Validando se o ID é um número válido
            if (isNaN(workoutId) || workoutId <= 0) {
                return res.status(400).json({ message: 'ID inválido!' });
            }

            // Debug para verificar os dados do usuário logado
            console.log("Dados do usuário logado:", req.user);

            const userId = req.user.id;      // Pega o ID do usuário logado
            const userRole = req.user.role;  // Pega o papel do usuário logado

            // Verifica permissões: admin, professor ou o dono do treino
            if (userRole !== 'admin' && userRole !== 'professor' && workoutId !== userId) {
                return res.status(403).json({ message: 'Acesso negado. Permissões necessárias: admin, professor, ou dono do treino.' });
            }

            // Busca o treino no banco de dados
            const workout = await this.service.getWorkoutById(workoutId);

            // Se o treino não for encontrado
            if (!workout) {
                return res.status(404).json({ message: 'Treino não encontrado!' });
            }

            // Retorna o treino
            res.json(workout);
        } catch (error) {
            console.error("Erro ao buscar treino:", error);
            res.status(500).json({ message: error.message || 'Erro ao buscar treino' });
        }
    };

    getByUser = async (req, res) => {
        try {
            const userIdToFind = parseInt(req.params.userId);

            if (isNaN(userIdToFind)) {
                return res.status(400).json({ message: 'ID inválido!' });
            }

            const requesterId = Number(req.user.id);  // Força para número também
            const requesterRole = req.user.role;

            // Se não for admin ou professor, só pode buscar o próprio treino
            if (requesterRole !== 'admin' && requesterRole !== 'professor' && requesterId !== userIdToFind) {
                return res.status(403).json({ message: 'Acesso não autorizado' });
            }

            console.log("Acessando os treinos do usuário:", userIdToFind);

            const workouts = await this.service.getUserWorkouts(userIdToFind);
            if (!workouts) {
                return res.status(404).json({ message: 'Treinos não encontrados' });
            }

            res.json(workouts);

        } catch (error) {
            console.error("Erro ao buscar treinos:", error);  // Adicione esse log de erro
            res.status(500).json({ message: 'Erro ao buscar os treinos' });
        }
    };

    update = async (req, res) => {
        try {
            const workout = await this.service.updateWorkout(
                req.params.id,
                req.body,
                req.user.id,     // Acesso corrigido
                req.user.role    // Acesso corrigido
            );
            res.json(workout);
        } catch (error) {
            res.status(error.message.includes('não encontrado') ? 404 : 403)
                .json({ message: error.message });
        }
    };


    delete = async (req, res) => {
        try {
            await this.service.deleteWorkout(
                req.params.id,
                req.userId,
                req.userRole
            );
            // Agora usamos o código 200 e retornamos a mensagem de sucesso
            res.status(200).json({ message: 'Treino deletado com sucesso.' });
        } catch (error) {
            res.status(error.message.includes('não encontrado') ? 404 : 403)
                .json({ message: error.message });
        }
    };

    createDefault = async (req, res) => {
        try {
            const workouts = await this.service.createDefaultWorkouts(req.params.userId);
            res.status(201).json(workouts);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    };
}
