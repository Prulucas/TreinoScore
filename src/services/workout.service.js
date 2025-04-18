import { WorkoutRepository } from '../repositories/workout.repositories.js';

export class WorkoutService {
    constructor() {
        this.repository = new WorkoutRepository();
    }

    async createWorkout(workoutData) {
        try {
            // Verificação básica de dados obrigatórios
            if (!workoutData.userId) {
                throw new Error('ID do usuário é obrigatório');
            }

            // Validação do dia
            if (!Number.isInteger(workoutData.day) || workoutData.day < 1 || workoutData.day > 7) {
                throw new Error('Dia inválido. Deve ser entre 1 (segunda) e 7 (domingo)');
            }

            // Validação dos exercícios
            if (!Array.isArray(workoutData.exercises) || workoutData.exercises.length === 0) {
                throw new Error('Deve ser fornecido um array com pelo menos um exercício');
            }

            // Verifica duplicidade de treino no mesmo dia
            const existing = await this.repository.findOneByDay(workoutData.userId, workoutData.day);
            if (existing) {
                throw new Error('Já existe um treino cadastrado para este dia');
            }

            // Validação da estrutura dos exercícios
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

            // Cria o treino no banco de dados
            return await this.repository.create(workoutData);

        } catch (error) {
            console.error('[WorkoutService] Erro ao criar treino:', error.message);
            throw error; // Propaga o erro para o controller
        }
    }

    async getWorkoutById(id, userId, userRole) {
        try {
            const workout = await this.repository.findById(id);

            if (!workout) {
                throw new Error('Treino não encontrado');
            }

            // Verificação de permissão
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
            return await this.repository.findByUserId(userId);
        } catch (error) {
            console.error('Erro ao buscar treinos do usuário:', error);
            throw new Error('Falha ao buscar treinos');
        }
    }

    async updateWorkout(id, workoutData, userId, userRole) {
        const transaction = await this.repository.getTransaction();
        try {
            const workout = await this.repository.findById(id);

            if (!workout) {
                throw new Error('Treino não encontrado');
            }

            // Verificação de permissão
            if (userRole !== 'admin' && userRole !== 'professor' && workout.userId !== userId) {
                throw new Error('Acesso não autorizado');
            }

            // Validações adicionais podem ser adicionadas aqui
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

            // Verificação de permissão
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