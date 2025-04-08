import Workout from '../models/Workout.js';
import User from '../models/User.js';

// Middleware para verificar se é professor ou admin
export const isTeacherOrAdmin = async (req, res, next) => {
    try {
        const user = await User.findByPk(req.userId);

        if (!user) {
            return res.status(404).json({ message: 'Usuário não encontrado' });
        }

        if (user.role === 'teacher' || user.role === 'admin') {
            req.userRole = user.role; // Armazena a role para uso posterior
            return next();
        }

        return res.status(403).json({
            message: 'Acesso negado - requer permissão de professor ou administrador',
            requiredRoles: ['teacher', 'admin'],
            yourRole: user.role
        });

    } catch (error) {
        console.error('Erro no middleware isTeacherOrAdmin:', error);
        return res.status(500).json({ message: 'Erro interno no servidor' });
    }
};

// Middleware específico para atualização de treinos
export const canUpdateWorkout = async (req, res, next) => {
    try {
        const workoutId = req.params.id;
        const userId = req.userId;

        // 1. Busca o treino no banco
        const workout = await Workout.findByPk(workoutId);
        if (!workout) {
            return res.status(404).json({ message: 'Treino não encontrado' });
        }

        // 2. Busca o usuário que fez a requisição
        const user = await User.findByPk(userId);
        if (!user) {
            return res.status(404).json({ message: 'Usuário não encontrado' });
        }

        // 3. Verifica permissões:
        // - Admin pode editar qualquer treino
        // - Professor só pode editar treinos que ele criou
        // - Aluno não pode editar treinos (só visualizar)
        if (user.role === 'admin' ||
            (user.role === 'teacher' && workout.teacherId === userId)) {
            return next();
        }

        return res.status(403).json({
            message: 'Acesso negado - você não tem permissão para editar este treino',
            required: 'Ser admin ou o professor responsável pelo treino',
            yourRole: user.role
        });

    } catch (error) {
        console.error('Erro no middleware canUpdateWorkout:', error);
        return res.status(500).json({ message: 'Erro interno no servidor' });
    }
};

// Versão genérica para reutilização
export const checkRole = (allowedRoles) => {
    return async (req, res, next) => {
        try {
            const user = await User.findByPk(req.userId);

            if (!user || !allowedRoles.includes(user.role)) {
                return res.status(403).json({
                    message: `Acesso negado - requer uma das seguintes roles: ${allowedRoles.join(', ')}`,
                    yourRole: user?.role || 'none'
                });
            }
            next();

        } catch (error) {
            console.error('Erro no middleware checkRole:', error);
            return res.status(500).json({ message: 'Erro interno no servidor' });
        }
    };
};