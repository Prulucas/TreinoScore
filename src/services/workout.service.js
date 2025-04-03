import { WorkoutRepository } from '../repositories/workout.repositories.js';

export class WorkoutService {
    constructor() {
        this.repository = new WorkoutRepository();
    }

    async createWorkout(workoutData, userRole) {
        if (userRole !== 'admin' && userRole !== 'professor') {
            throw new Error('Apenas administradores e professores podem criar treinos');
        }
        return await this.repository.create(workoutData);
    }

    async getWorkoutById(id, userId, userRole) {
        const workout = await this.repository.findById(id);
        if (!workout) throw new Error('Treino não encontrado');

        if (userRole !== 'admin' && userRole !== 'professor' && workout.userId !== userId) {
            throw new Error('Acesso não autorizado');
        }
        return workout;
    }

    async getUserWorkouts(userId) {
        return await this.repository.findByUserId(userId);
    }

    async updateWorkout(id, workoutData, userId, userRole) {
        const workout = await this.repository.findById(id);
        if (!workout) throw new Error('Treino não encontrado');

        if (userRole !== 'admin' && userRole !== 'professor' && workout.userId !== userId) {
            throw new Error('Acesso não autorizado');
        }
        return await this.repository.update(id, workoutData);
    }

    async deleteWorkout(id, userId, userRole) {
        const workout = await this.repository.findById(id);
        if (!workout) throw new Error('Treino não encontrado');

        if (userRole !== 'admin' && userRole !== 'professor' &&
            (workout.userId !== userId || !workout.isDefault)) {
            throw new Error('Acesso não autorizado');
        }
        return await this.repository.delete(id);
    }

    async createDefaultWorkouts(userId) {
        return await this.repository.createDefaultWorkouts(userId);
    }
}