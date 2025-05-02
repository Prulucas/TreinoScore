import WorkoutRepository from '../repositories/workout.repositories.js';
import sequelizeInstance from '../database/db.js';
import db from '../models/Index.js'; // importa tudo do seu arquivo acima

export class WorkoutService {
    constructor() {
        this.repository = WorkoutRepository;
        this.WorkoutModel = db.Workout; // ✅ agora pega o modelo certo aqui e evita conflito
    }

    async createWorkout(workoutData) {
        try {
            if (!workoutData.userId) {
                throw new Error('ID do usuário é obrigatório');
            }

            if (!Number.isInteger(workoutData.day) || workoutData.day < 1 || workoutData.day > 7) {
                throw new Error('Dia inválido. Deve ser entre 1 (segunda) e 7 (domingo)');
            }

            if (!Array.isArray(workoutData.exercises) || workoutData.exercises.length === 0) {
                throw new Error('Deve ser fornecido um array com pelo menos um exercício');
            }

            const existing = await this.repository.findOneByDay(workoutData.userId, workoutData.day);
            if (existing) {
                throw new Error('Já existe um treino cadastrado para este dia');
            }

            workoutData.exercises.forEach((ex, index) => {
                if (!ex.name || typeof ex.name !== 'string' || !ex.name.trim()) {
                    throw new Error(`Exercício ${index + 1}: Nome inválido`);
                }
                if (!Number.isInteger(ex.sets) || ex.sets < 1 || ex.sets > 10) {
                    throw new Error(`Exercício ${index + 1}: Número de séries inválido (1-10)`);
                }
                if (!ex.reps || typeof ex.reps !== 'string' || !ex.reps.trim()) {
                    throw new Error(`Exercício ${index + 1}: Repetições inválidas`);
                }
                if (ex.rest && (!Number.isInteger(ex.rest) || ex.rest < 30 || ex.rest > 180)) {
                    throw new Error(`Exercício ${index + 1}: Tempo de descanso inválido (30-180s)`);
                }
            });

            return await this.repository.create(workoutData);

        } catch (error) {
            console.error('[WorkoutService] Erro ao criar treino:', error.message);
            throw error;
        }
    }

    async getWorkoutById(id, userId, userRole) {
        try {
            const workout = await this.repository.findById(id);

            if (!workout) {
                throw new Error('Treino não encontrado');
            }

            if (userRole !== 'admin' && userRole !== 'professor' && workout.userId !== userId) {
                throw new Error('Acesso não autorizado');
            }

            return workout;
        } catch (error) {
            console.error('Erro ao buscar treino:', error);
            throw error;
        }
    }

    async getUserWorkouts(userId) {
        try {
            // Agora usa o modelo certo da classe
            const workouts = await this.WorkoutModel.findAll({
                where: { userId: userId },
            });

            return workouts;
        } catch (error) {
            console.error('Erro ao buscar treinos:', error);
            throw new Error('Falha ao buscar treinos');
        }
    }

    async updateWorkout(id, workoutData, userId, userRole) {
        const transaction = await sequelizeInstance.transaction();
        try {
            const workout = await this.repository.findById(id);

            if (!workout) {
                throw new Error('Treino não encontrado');
            }

            if (userRole !== 'admin' && userRole !== 'professor' && workout.userId !== userId) {
                throw new Error('Acesso não autorizado');
            }

            if (workoutData.day && (workoutData.day < 1 || workoutData.day > 7)) {
                throw new Error('Dia do treino inválido');
            }

            const updatedWorkout = await this.repository.update(id, workoutData, { transaction });
            await transaction.commit();

            return updatedWorkout;
        } catch (error) {
            await transaction.rollback();
            console.error('Erro ao atualizar treino:', error);
            throw error;
        }
    }

    async deleteWorkout(id, userId, userRole) {
        const transaction = await this.repository.getTransaction();
        try {
            const workout = await this.repository.findById(id);

            if (!workout) {
                throw new Error('Treino não encontrado');
            }

            if (userRole !== 'admin' && userRole !== 'professor' && workout.userId !== userId) {
                throw new Error('Acesso não autorizado');
            }

            await this.repository.delete(id, { transaction });
            await transaction.commit();

            return true;
        } catch (error) {
            await transaction.rollback();
            console.error('Erro ao deletar treino:', error);
            throw error;
        }
    }

    async createDefaultWorkouts(userId) {
        try {
            return await this.repository.createDefaultWorkouts(userId);
        } catch (error) {
            console.error('Erro ao criar treinos padrão:', error);
            throw new Error('Falha ao criar treinos padrão');
        }
    }
}
