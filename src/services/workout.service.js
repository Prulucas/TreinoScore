/**
 * ================================================================
 * Arquivo: workout.service.js
 * Autor: Pedro Lucas
 * Ano: 2025
 * GitHub: https://github.com/Prulucas
 * ================================================================
 *
 * Descrição:
 * Este arquivo contém a lógica de serviços relacionados aos treinos.
 * A classe WorkoutService gerencia a criação, leitura, atualização e exclusão de treinos (CRUD).
 * Ele também faz validações dos dados de entrada e interage com o repositório para gerenciar os dados no banco.
 * Este serviço é utilizado pela camada de controle para processar e manipular os dados dos treinos.
 */

import WorkoutRepository from '../repositories/workout.repositories.js';
import sequelizeInstance from '../database/db.js';
import db from '../models/Index.js'; // importa tudo do seu arquivo acima

export class WorkoutService {
    constructor() {
        this.repository = WorkoutRepository;
        this.WorkoutModel = db.Workout; // ✅ agora pega o modelo certo aqui e evita conflito
    }

    /**
     * Função para criar um treino
     * Valida os dados de entrada e cria o treino no banco de dados.
     * 
     * @param {Object} workoutData - Dados do treino a ser criado.
     * @returns {Object} - Objeto com os dados do treino criado.
     * @throws {Error} - Lança erros caso os dados não sejam válidos.
     */
    async createWorkout(workoutData) {
        try {
            // Verifica se o ID do usuário foi fornecido
            if (!workoutData.userId) {
                throw new Error('ID do usuário é obrigatório');
            }

            // Verifica se o dia do treino é válido (entre 1 e 7)
            if (!Number.isInteger(workoutData.day) || workoutData.day < 1 || workoutData.day > 7) {
                throw new Error('Dia inválido. Deve ser entre 1 (segunda) e 7 (domingo)');
            }

            // Verifica se os exercícios foram fornecidos corretamente (deve ser um array com pelo menos um exercício)
            if (!Array.isArray(workoutData.exercises) || workoutData.exercises.length === 0) {
                throw new Error('Deve ser fornecido um array com pelo menos um exercício');
            }

            // Verifica se já existe um treino para o mesmo dia
            const existing = await this.repository.findOneByDay(workoutData.userId, workoutData.day);
            if (existing) {
                throw new Error('Já existe um treino cadastrado para este dia');
            }

            // Valida os exercícios fornecidos
            workoutData.exercises.forEach((ex, index) => {
                // Verifica se o nome do exercício é válido
                if (!ex.name || typeof ex.name !== 'string' || !ex.name.trim()) {
                    throw new Error(`Exercício ${index + 1}: Nome inválido`);
                }
                // Verifica se o número de séries do exercício está entre 1 e 10
                if (!Number.isInteger(ex.sets) || ex.sets < 0 || ex.sets > 10) {
                    throw new Error(`Exercício ${index + 1}: Número de séries inválido (1-10)`);
                }
                // Verifica se as repetições do exercício estão corretas
                if (!ex.reps || typeof ex.reps !== 'string' || !ex.reps.trim()) {
                    throw new Error(`Exercício ${index + 1}: Repetições inválidas`);
                }
                // Verifica se o tempo de descanso está entre 30 e 180 segundos
                if (ex.rest && (!Number.isInteger(ex.rest) || ex.rest < 0 || ex.rest > 180)) {
                    throw new Error(`Exercício ${index + 1}: Tempo de descanso inválido (30-180s)`);
                }
            });

            // Cria o treino no repositório
            return await this.repository.create(workoutData);

        } catch (error) {
            // Em caso de erro, exibe a mensagem no console e relança o erro
            console.error('[WorkoutService] Erro ao criar treino:', error.message);
            throw error;
        }
    }

    /**
     * Função para buscar um treino pelo ID
     * 
     * @param {number} workoutId - ID do treino a ser buscado.
     * @returns {Object|null} - Retorna o treino encontrado ou null caso não exista.
     * @throws {Error} - Lança erro se ocorrer algum problema ao buscar o treino.
     */
    getWorkoutById = async (workoutId) => {
        try {
            // Busca o treino no banco de dados
            const workout = await this.WorkoutModel.findOne({
                where: { id: workoutId }
            });

            // Retorna o treino encontrado ou null caso não exista
            return workout ? workout : null;
        } catch (error) {
            // Em caso de erro, lança uma mensagem
            throw new Error('Erro ao buscar treino');
        }
    };

    /**
     * Função para buscar todos os treinos de um usuário
     * 
     * @param {number} userId - ID do usuário cujos treinos serão buscados.
     * @returns {Array} - Retorna um array com os dados dos treinos encontrados.
     * @throws {Error} - Lança erro se ocorrer algum problema ao buscar os treinos.
     */
    async getUserWorkouts(userId) {
        try {
            // Busca todos os treinos do usuário
            const workouts = await this.WorkoutModel.findAll({
                where: { userId: userId },
            });

            // Se não houver treinos, exibe uma mensagem no console
            if (workouts.length === 0) {
                console.log("Nenhum treino encontrado para o usuário:", userId);
            }

            // Converte os treinos para JSON e retorna
            const workoutData = workouts.map(workout => workout.toJSON());
            return workoutData;
        } catch (error) {
            // Em caso de erro, exibe a mensagem no console e lança o erro
            console.error('Erro ao buscar treinos:', error);
            throw new Error(`Falha ao buscar treinos: ${error.message}`);
        }
    }

    /**
     * Função para atualizar um treino
     * 
     * @param {number} id - ID do treino a ser atualizado.
     * @param {Object} workoutData - Dados atualizados do treino.
     * @param {number} userId - ID do usuário que está fazendo a requisição.
     * @param {string} userRole - Função do usuário (admin, professor, etc.).
     * @returns {Object} - Retorna o treino atualizado.
     * @throws {Error} - Lança erro se não for possível atualizar o treino.
     */
    async updateWorkout(id, workoutData, userId, userRole) {
        // Inicia uma transação para garantir que todas as operações sejam atômicas
        const transaction = await sequelizeInstance.transaction();
        try {
            // Verifica se o treino existe
            const workout = await this.repository.findById(id);
            if (!workout) {
                throw new Error('Treino não encontrado');
            }

            // Verifica as permissões de acesso ao treino
            if (userRole !== 'admin' && userRole !== 'professor' && workout.userId !== userId) {
                throw new Error('Acesso não autorizado');
            }

            // Verifica se o dia do treino está entre 1 e 7
            if (workoutData.day && (workoutData.day < 1 || workoutData.day > 7)) {
                throw new Error('Dia do treino inválido');
            }

            // Atualiza o treino no repositório dentro da transação
            const updatedWorkout = await this.repository.update(id, workoutData, { transaction });
            await transaction.commit(); // Confirma a transação

            return updatedWorkout;
        } catch (error) {
            // Caso ocorra um erro, desfaz a transação
            await transaction.rollback();
            console.error('Erro ao atualizar treino:', error);
            throw error;
        }
    }

    /**
     * Função para deletar um treino
     * 
     * @param {number} id - ID do treino a ser deletado.
     * @param {number} userId - ID do usuário que está fazendo a requisição.
     * @param {string} userRole - Função do usuário (admin, professor, etc.).
     * @returns {Object} - Retorna uma mensagem de sucesso após deletar o treino.
     * @throws {Error} - Lança erro se não for possível deletar o treino.
     */
    async deleteWorkout(id, userId, userRole) {
        // Inicia uma transação para garantir que todas as operações sejam atômicas
        const transaction = await sequelizeInstance.transaction();
        try {
            // Busca o treino no repositório
            const workout = await this.repository.findById(id);

            if (!workout) {
                throw new Error('Treino não encontrado');
            }

            // Logs para depuração
            console.log('ID do treino:', id);
            console.log('User ID do login:', userId);
            console.log('User Role do login:', userRole);
            console.log('ID do treino no banco:', workout.userId);

            // Verificação de permissões
            if (userRole !== 'admin' && userRole !== 'professor' && workout.userId !== userId) {
                if (userRole === 'professor' && workout.userId !== userId) {
                    throw new Error('Acesso não autorizado');
                }
            }

            // Deleta o treino do repositório
            await this.repository.delete(id, { transaction });

            // Confirma a transação
            await transaction.commit();

            // Retorna a resposta após sucesso
            return { message: 'Treino deletado com sucesso.' };

        } catch (error) {
            // Caso ocorra um erro, desfaz a transação
            await transaction.rollback();
            console.error('Erro ao deletar treino:', error);
            throw error;
        }
    }

    /**
     * Função para criar treinos padrão para um usuário
     * 
     * @param {number} userId - ID do usuário para quem os treinos padrão serão criados.
     * @returns {Object} - Retorna os treinos padrão criados.
     * @throws {Error} - Lança erro se não for possível criar os treinos padrão.
     */
    async createDefaultWorkouts(userId) {
        try {
            // Cria os treinos padrão para o usuário
            return await this.repository.createDefaultWorkouts(userId);
        } catch (error) {
            console.error('Erro ao criar treinos padrão:', error);
            throw new Error('Falha ao criar treinos padrão');
        }
    }
}
