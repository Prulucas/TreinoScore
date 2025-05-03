/**
 * ================================================================
 * Arquivo: workout.controller.js
 * Autor: Pedro Lucas
 * Ano: 2025
 * GitHub: https://github.com/Prulucas
 * ================================================================
 *
 * Descrição:
 * Este arquivo contém os controladores para as operações relacionadas aos treinos.
 * Ele inclui funcionalidades para criar, buscar, atualizar, excluir treinos e criar treinos padrão.
 * Os controladores utilizam o serviço `WorkoutService` para interagir com o banco de dados ou outras lógicas de negócios.
 */

import { WorkoutService } from '../services/workout.service.js';

export class WorkoutController {
    constructor() {
        this.service = new WorkoutService(); // Instancia o serviço de treino
    }

    /**
     * Controlador para criar um treino
     * @param {Object} req - Requisição HTTP
     * @param {Object} res - Resposta HTTP
     */
    create = async (req, res) => {
        try {
            // Prepara os dados do treino com base no corpo da requisição
            const workoutData = {
                ...req.body,
                userId: req.params.userId // Adiciona o ID do usuário
            };

            // Chama o serviço para criar o treino e retorna o resultado
            const result = await this.service.createWorkout(workoutData);
            res.status(201).json(result); // Retorna o treino criado
        } catch (error) {
            // Retorna erro em caso de falha de validação
            res.status(400).json({
                message: error.message,
                error: "VALIDATION_ERROR"
            });
        }
    }

    /**
     * Controlador para buscar um treino pelo ID
     * @param {Object} req - Requisição HTTP
     * @param {Object} res - Resposta HTTP
     */
    getById = async (req, res) => {
        try {
            // Debug: Mostra o ID da URL para verificação
            console.log("ID da URL:", req.params.id);

            const workoutId = req.params.id;

            // Valida se o ID é um número válido
            if (isNaN(workoutId) || workoutId <= 0) {
                return res.status(400).json({ message: 'ID inválido!' });
            }

            // Debug: Mostra os dados do usuário logado
            console.log("Dados do usuário logado:", req.user);

            const userId = req.user.id;      // Obtém o ID do usuário logado
            const userRole = req.user.role;  // Obtém o papel do usuário logado

            // Verifica se o usuário tem permissões para acessar o treino
            if (userRole !== 'admin' && userRole !== 'professor' && workoutId !== userId) {
                return res.status(403).json({ message: 'Acesso negado. Permissões necessárias: admin, professor, ou dono do treino.' });
            }

            // Busca o treino no banco de dados
            const workout = await this.service.getWorkoutById(workoutId);

            // Caso o treino não seja encontrado
            if (!workout) {
                return res.status(404).json({ message: 'Treino não encontrado!' });
            }

            res.json(workout); // Retorna o treino encontrado
        } catch (error) {
            console.error("Erro ao buscar treino:", error);
            res.status(500).json({ message: error.message || 'Erro ao buscar treino' });
        }
    };

    /**
     * Controlador para buscar todos os treinos de um usuário
     * @param {Object} req - Requisição HTTP
     * @param {Object} res - Resposta HTTP
     */
    getByUser = async (req, res) => {
        try {
            const userIdToFind = parseInt(req.params.userId);

            // Verifica se o ID do usuário é válido
            if (isNaN(userIdToFind)) {
                return res.status(400).json({ message: 'ID inválido!' });
            }

            const requesterId = Number(req.user.id);  // Força para número
            const requesterRole = req.user.role;

            // Verifica as permissões do usuário
            if (requesterRole !== 'admin' && requesterRole !== 'professor' && requesterId !== userIdToFind) {
                return res.status(403).json({ message: 'Acesso não autorizado' });
            }

            console.log("Acessando os treinos do usuário:", userIdToFind);

            // Busca os treinos do usuário
            const workouts = await this.service.getUserWorkouts(userIdToFind);
            if (!workouts) {
                return res.status(404).json({ message: 'Treinos não encontrados' });
            }

            res.json(workouts); // Retorna os treinos encontrados

        } catch (error) {
            console.error("Erro ao buscar treinos:", error); // Adiciona log de erro
            res.status(500).json({ message: 'Erro ao buscar os treinos' });
        }
    };

    /**
     * Controlador para atualizar os dados de um treino
     * @param {Object} req - Requisição HTTP
     * @param {Object} res - Resposta HTTP
     */
    update = async (req, res) => {
        try {
            // Chama o serviço para atualizar o treino
            const workout = await this.service.updateWorkout(
                req.params.id,
                req.body,
                req.user.id,     // Acesso corrigido
                req.user.role    // Acesso corrigido
            );
            res.json(workout); // Retorna o treino atualizado
        } catch (error) {
            // Retorna erro dependendo do tipo de erro (não encontrado ou permissão)
            res.status(error.message.includes('não encontrado') ? 404 : 403)
                .json({ message: error.message });
        }
    };

    /**
     * Controlador para excluir um treino
     * @param {Object} req - Requisição HTTP
     * @param {Object} res - Resposta HTTP
     */
    delete = async (req, res) => {
        try {
            // Chama o serviço para excluir o treino
            await this.service.deleteWorkout(
                req.params.id,
                req.userId,
                req.userRole
            );
            res.status(200).json({ message: 'Treino deletado com sucesso.' }); // Retorna sucesso
        } catch (error) {
            // Retorna erro dependendo do tipo de erro (não encontrado ou permissão)
            res.status(error.message.includes('não encontrado') ? 404 : 403)
                .json({ message: error.message });
        }
    };

    /**
     * Controlador para criar treinos padrão para um usuário
     * @param {Object} req - Requisição HTTP
     * @param {Object} res - Resposta HTTP
     */
    createDefault = async (req, res) => {
        try {
            // Cria os treinos padrão para o usuário
            const workouts = await this.service.createDefaultWorkouts(req.params.userId);
            res.status(201).json(workouts); // Retorna os treinos criados
        } catch (error) {
            // Retorna erro em caso de falha ao criar os treinos
            res.status(500).json({ message: error.message });
        }
    };
}
