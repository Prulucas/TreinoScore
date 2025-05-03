/**
 * ================================================================
 * Arquivo: global.middleware.js
 * Autor: Pedro Lucas
 * Ano: 2025
 * GitHub: https://github.com/Prulucas
 * ================================================================
 *
 * Descrição:
 * Este arquivo contém middlewares de autorização que são usados para 
 * verificar permissões de acesso de usuários a recursos específicos.
 * O primeiro middleware verifica se o usuário tem permissão para acessar 
 * os dados de outro usuário, com base no papel do usuário ou na 
 * correspondência do ID. O segundo middleware verifica se o usuário 
 * tem permissão para acessar ou modificar um treino específico.
 *
 * O objetivo é garantir que apenas administradores, professores ou 
 * o próprio usuário autorizado tenham acesso aos seus dados ou aos 
 * dados de treinos.
 */

import db from '../models/Index.js'; // Importa o banco de dados e os modelos
const { Workout } = db; // Desestrutura o modelo Workout

/**
 * Middleware para verificar se o usuário tem permissão para acessar 
 * ou modificar dados de outro usuário. O acesso é permitido para 
 * administradores, professores ou para o próprio usuário dono dos dados.
 */
export function verifyAdminOrOwner(req, res, next) {
    const userIdLogged = req.user.id; // ID do usuário logado (do token)
    const userRole = req.user.role; // Papel do usuário logado
    const userIdFromParams = req.params.userId; // ID do usuário na URL

    // Log do ID vindo da URL para depuração
    console.log("ID da URL:", userIdFromParams);

    // Verifica se o ID da URL é válido
    if (!userIdFromParams || isNaN(userIdFromParams)) {
        return res.status(400).send({ message: "ID inválido!" });
    }

    // Permite acesso para admin, professor ou o próprio dono (aluno também pode acessar seus dados)
    if (userRole === "admin" || userRole === "professor" || Number(userIdLogged) === Number(userIdFromParams)) {
        console.log("Usuário autorizado. Role:", req.user.role, "ID:", req.user.id);

        return next();  // Usuário autorizado, segue para o controller
    }

    // Se não atender a nenhuma condição acima, nega o acesso
    return res.status(403).send({
        message: "Acesso negado. Permissões necessárias: admin, professor",
        yourRole: userRole
    });
}

/**
 * Middleware para verificar se o usuário tem permissão para acessar 
 * ou modificar um treino específico. O acesso é permitido para 
 * administradores, professores ou para o próprio usuário dono do treino.
 */
export async function verifyWorkoutAccess(req, res, next) {
    const userRole = req.user.role; // Papel do usuário logado
    const userIdLogged = req.user.id; // ID do usuário logado (do token)
    const workoutIdFromParams = req.params.id; // ID do treino na URL

    // Log para depuração
    console.log("ID da URL (treino):", workoutIdFromParams);
    console.log("Papel do usuário:", userRole);
    console.log("ID do usuário logado:", userIdLogged);

    // Verifica se o ID do treino na URL é válido
    if (!workoutIdFromParams || isNaN(workoutIdFromParams)) {
        return res.status(400).send({ message: "ID inválido!" });
    }

    // Caso o usuário seja admin ou professor, permite o acesso sem restrição
    if (userRole === "admin" || userRole === "professor") {
        console.log('Usuário autorizado. Role:', userRole);
        return next();
    }

    try {
        // Busca o treino no banco de dados com o ID fornecido
        const workout = await Workout.findByPk(workoutIdFromParams);

        // Se o treino não for encontrado, retorna erro 404
        if (!workout) {
            return res.status(404).json({ message: "Treino não encontrado!" });
        }

        // Log do ID do treino no banco para depuração
        console.log("ID do treino no banco:", workout.userId);

        // Verifica se o usuário logado é o dono do treino
        if (Number(workout.userId) === Number(userIdLogged)) {
            console.log('Aluno autorizado a acessar o próprio treino.');
            return next(); // Permite acesso ao treino
        }

        // Se o aluno não for o dono do treino
        return res.status(403).json({ message: "Acesso negado. Você não é dono deste treino." });
    } catch (error) {
        console.error('Erro ao verificar treino:', error);
        res.status(500).json({ message: "Erro interno ao verificar treino." });
    }
}
