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
            const workout = await this.service.getWorkoutById(
                req.params.id,
                req.userId,
                req.userRole
            );
            res.json(workout);
        } catch (error) {
            res.status(error.message.includes('não encontrado') ? 404 : 403)
                .json({ message: error.message });
        }
    };

    getByUser = async (req, res) => {
        try {
            const userIdToFind = parseInt(req.params.userId);  // Pega o 29 da URL
            const requesterId = req.user.id;  // Quem está logado (27)
            const requesterRole = req.user.role;

            // Se não for admin ou professor, só pode buscar o próprio treino
            if (requesterRole !== 'admin' && requesterRole !== 'professor' && requesterId !== userIdToFind) {
                return res.status(403).json({ message: 'Acesso não autorizado' });
            }

            const workouts = await this.service.getUserWorkouts(userIdToFind);
            res.json(workouts);

        } catch (error) {
            res.status(500).json({ message: error.message || 'Erro ao buscar treinos' });
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
            res.status(204).end();
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
