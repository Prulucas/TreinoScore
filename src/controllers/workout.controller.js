import { WorkoutService } from '../services/workout.service.js';

export class WorkoutController {
    constructor() {
        this.service = new WorkoutService();
    }

    // workout.controller.js
    create = async (req, res) => {
        try {
            const userId = req.params.userId || req.body.userId || req.userId;

            if (!userId) {
                return res.status(400).json({ message: "User ID é obrigatório" });
            }

            const workout = await this.service.createWorkout(
                { ...req.body, userId },
                req.userRole
            );
            res.status(201).json(workout);
        } catch (error) {
            console.error("Erro ao criar treino:", error);
            res.status(400).json({ message: error.message });
        }
    };




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
            const workouts = await this.service.getUserWorkouts(
                req.params.userId || req.userId
            );
            res.json(workouts);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    };

    update = async (req, res) => {
        try {
            const workout = await this.service.updateWorkout(
                req.params.id,
                req.body,
                req.userId,
                req.userRole
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
