/**
 * ================================================================
 * Arquivo: workout.repositories.js
 * Autor: Pedro Lucas
 * Ano: 2025
 * GitHub: https://github.com/Prulucas
 * ================================================================
 *
 * Descrição:
 * Repositório responsável por operações de CRUD e funcionalidades 
 * específicas relacionadas aos treinos (workouts) no sistema.
 */

import db from '../models/Index.js';

export class WorkoutRepository {
    constructor() {
        this.Workout = db.Workout;
    }

    /**
     * Cria um novo treino.
     * @param {Object} workoutData - Dados do treino.
     * @returns {Promise<Object>} Treino criado.
     */
    async create(workoutData) {
        return await this.Workout.create(workoutData);
    }

    /**
     * Busca um treino de um usuário por dia.
     * @param {number} userId - ID do usuário.
     * @param {number} day - Dia da semana.
     * @returns {Promise<Object|null>} Treino encontrado ou null.
     */
    async findOneByDay(userId, day) {
        return await this.Workout.findOne({
            where: { userId, day }
        });
    }

    /**
     * Busca um treino pelo ID.
     * @param {number} id - ID do treino.
     * @returns {Promise<Object|null>} Treino encontrado ou null.
     */
    async findById(id) {
        try {
            return await this.Workout.findByPk(id);
        } catch (error) {
            console.error('Error finding workout by id:', error);
            throw new Error('Failed to find workout');
        }
    }

    /**
     * Busca um treino com base em critérios específicos.
     * @param {Object} criteria - Critérios da busca.
     * @returns {Promise<Object|null>} Treino encontrado ou null.
     */
    async findOne(criteria) {
        try {
            return await this.Workout.findOne({
                where: criteria
            });
        } catch (error) {
            console.error('Error finding workout by criteria:', error);
            throw new Error('Failed to find workout');
        }
    }

    /**
     * Busca todos os treinos de um usuário.
     * @param {number} userId - ID do usuário.
     * @param {Object} [options={}] - Opções adicionais da busca.
     * @returns {Promise<Array>} Lista de treinos encontrados.
     */
    async findByUserId(userId, options = {}) {
        try {
            return await this.Workout.findAll({
                where: { userId },
                ...options,
            });
        } catch (error) {
            console.error('Error finding workouts by user:', error);
            throw new Error('Failed to find user workouts');
        }
    }

    /**
     * Atualiza um treino pelo ID.
     * @param {number} id - ID do treino.
     * @param {Object} workoutData - Dados atualizados.
     * @returns {Promise<Object|null>} Treino atualizado ou null.
     */
    async update(id, workoutData) {
        const transaction = await db.sequelize.transaction();
        try {
            const workout = await this.Workout.findByPk(id);
            if (!workout) {
                await transaction.rollback();
                return null;
            }

            const updatedWorkout = await workout.update(workoutData, { transaction });
            await transaction.commit();
            return updatedWorkout;
        } catch (error) {
            await transaction.rollback();
            console.error('Error updating workout:', error);
            throw new Error('Failed to update workout');
        }
    }

    /**
     * Deleta um treino pelo ID.
     * @param {number} id - ID do treino.
     * @returns {Promise<boolean>} True se deletado com sucesso, false se não encontrado.
     */
    async delete(id) {
        const transaction = await db.sequelize.transaction();
        try {
            const workout = await this.Workout.findByPk(id);
            if (!workout) {
                await transaction.rollback();
                return false;
            }

            await workout.destroy({ transaction });
            await transaction.commit();
            return true;
        } catch (error) {
            await transaction.rollback();
            console.error('Error deleting workout:', error);
            throw new Error('Failed to delete workout');
        }
    }

    /**
     * Cria treinos padrão para um novo usuário.
     * @param {number} userId - ID do usuário.
     * @returns {Promise<Array>} Lista de treinos criados.
     */
    async createDefaultWorkouts(userId) {
        const defaultWorkouts = [
            { day: 1, title: "Treino 1", exercises: this._defaultExercises() },
            { day: 2, title: "Treino 2", exercises: this._defaultExercises() },
            { day: 3, title: "Treino 3", exercises: this._defaultExercises() },
            { day: 4, title: "Treino 4", exercises: this._defaultExercises() },
            { day: 5, title: "Treino 5", exercises: this._defaultExercises() }
        ];

        const transaction = await db.sequelize.transaction();
        try {
            const createdWorkouts = [];

            for (const workout of defaultWorkouts) {
                const created = await this.Workout.create({
                    userId,
                    title: workout.title,
                    description: `Treino padrão - ${workout.title}`,
                    day: workout.day,
                    exercises: workout.exercises,
                    status: 'active'
                }, { transaction });

                createdWorkouts.push(created);
            }

            await transaction.commit();
            return createdWorkouts;
        } catch (error) {
            await transaction.rollback();
            console.error('Error creating default workouts:', error);
            throw new Error('Failed to create default workouts');
        }
    }

    /**
     * Conta quantos treinos um usuário possui.
     * @param {number} userId - ID do usuário.
     * @returns {Promise<number>} Número de treinos.
     */
    async countUserWorkouts(userId) {
        try {
            return await this.Workout.count({ where: { userId } });
        } catch (error) {
            console.error('Error counting user workouts:', error);
            throw new Error('Failed to count workouts');
        }
    }

    /**
     * Deleta todos os treinos de um usuário.
     * @param {number} userId - ID do usuário.
     * @returns {Promise<number>} Número de treinos deletados.
     */
    async deleteByUserId(userId) {
        try {
            return await db.Workout.destroy({
                where: { userId: userId }
            });
        } catch (error) {
            console.error('Error deleting workouts by userId:', error);
            throw new Error('Failed to delete workouts');
        }
    }

    /**
     * Gera a lista padrão de exercícios.
     * @private
     * @returns {Array} Lista de exercícios padrão.
     */
    _defaultExercises() {
        return [
            { name: "Exercício 1", sets: 1, reps: "0-0", rest: 30 },
            { name: "Exercício 2", sets: 1, reps: "0-0", rest: 30 },
            { name: "Exercício 3", sets: 1, reps: "0-0", rest: 30 },
            { name: "Exercício 4", sets: 1, reps: "0-0", rest: 30 },
            { name: "Exercício 5", sets: 1, reps: "0-0", rest: 30 }
        ];
    }
}

const workoutRepository = new WorkoutRepository();
export default workoutRepository;
