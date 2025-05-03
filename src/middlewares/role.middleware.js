/**
 * ================================================================
 * Arquivo: role.middleware.js
 * Autor: Pedro Lucas
 * Ano: 2025
 * GitHub: https://github.com/Prulucas
 * ================================================================
 *
 * Descrição:
 * Este arquivo contém middlewares relacionados à verificação de permissões 
 * de usuários com base no seu papel (role) no sistema.
 * O primeiro middleware, `checkRole`, é genérico e verifica se o usuário 
 * possui uma das permissões permitidas para acessar um recurso.
 * O segundo middleware, `workoutPermissions.update`, verifica se o usuário 
 * tem permissão para editar um treino, permitindo acesso para administradores 
 * ou professores responsáveis pelo treino.
 * O terceiro middleware, `isTeacherOrAdmin`, é uma versão simplificada 
 * do `checkRole`, restringindo o acesso a professores e administradores.
 */

import Workout from '../models/Workout.js'; // Importa o modelo Workout

/**
 * Middleware genérico para verificação de roles.
 * Verifica se o usuário está autenticado e se o seu papel (role) 
 * está na lista de roles permitidas.
 */
export const checkRole = (allowedRoles = []) => {
    return async (req, res, next) => {
        try {
            // Verifica se o usuário está autenticado
            if (!req.user) {
                return res.status(401).json({ message: "Usuário não autenticado" });
            }

            // Verifica se o usuário tem uma das roles permitidas
            if (!allowedRoles.includes(req.user.role)) {
                return res.status(403).json({
                    message: `Acesso negado. Permissões necessárias: ${allowedRoles.join(', ')}`,
                    yourRole: req.user.role
                });
            }

            return next(); // Usuário autorizado, segue para o controller
        } catch (error) {
            console.error('Erro no middleware de verificação de role:', error);
            return res.status(500).json({ message: "Erro interno no servidor" });
        }
    };
};

/**
 * Middleware específico para verificar permissões em treinos.
 * Permite que o administrador edite qualquer treino e que o professor 
 * edite apenas seus próprios treinos.
 */
export const workoutPermissions = {
    update: async (req, res, next) => {
        try {
            const workoutId = req.params.id; // ID do treino na URL
            const userId = req.user.id; // ID do usuário logado
            const userRole = req.user.role; // Papel do usuário logado

            // Busca o treino no banco de dados
            const workout = await Workout.findByPk(workoutId);
            if (!workout) {
                return res.status(404).json({ message: 'Treino não encontrado' });
            }

            // Permissões para editar o treino:
            // - Admin pode editar qualquer treino
            // - Professor só pode editar seus próprios treinos
            if (userRole === 'admin' ||
                (userRole === 'professor' && workout.userId === userId)) {
                return next(); // Usuário autorizado a editar o treino
            }

            return res.status(403).json({
                message: 'Acesso negado - você não tem permissão para editar este treino',
                required: 'Ser admin ou o professor responsável pelo treino'
            });

        } catch (error) {
            console.error('Erro no middleware de permissão de treino:', error);
            return res.status(500).json({ message: 'Erro interno no servidor' });
        }
    }
};

/**
 * Middleware simplificado para verificar se o usuário é professor ou admin.
 * Permite acesso apenas para usuários com um dos dois papéis: 'professor' ou 'admin'.
 */
export const isTeacherOrAdmin = checkRole(['professor', 'admin']);
