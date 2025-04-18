import Workout from '../models/Workout.js';

// Middleware genérico para verificação de roles
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

            return next();
        } catch (error) {
            console.error('Erro no middleware de verificação de role:', error);
            return res.status(500).json({ message: "Erro interno no servidor" });
        }
    };
};

// Middleware específico para verificação de permissões em treinos
export const workoutPermissions = {
    update: async (req, res, next) => {
        try {
            const workoutId = req.params.id;
            const userId = req.user.id;
            const userRole = req.user.role;

            // Busca o treino no banco
            const workout = await Workout.findByPk(workoutId);
            if (!workout) {
                return res.status(404).json({ message: 'Treino não encontrado' });
            }

            // Permissões:
            // - Admin pode editar qualquer treino
            // - Professor só pode editar seus próprios treinos
            if (userRole === 'admin' ||
                (userRole === 'professor' && workout.userId === userId)) {
                return next();
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

// Middleware para verificar se é professor ou admin (versão simplificada)
export const isTeacherOrAdmin = checkRole(['professor', 'admin']);