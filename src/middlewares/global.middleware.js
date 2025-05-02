export function verifyAdminOrOwner(req, res, next) {
    const userIdLogged = req.user.id;       // Pegando id do usuário logado
    const userRole = req.user.role;          // Pegando role do usuário logado
    const idParams = req.params.id;          // ID do recurso (usuário que está tentando ser alterado)

    if (!idParams || isNaN(idParams)) {
        return res.status(400).send({ message: "ID inválido!" });
    }

    if (userRole === "admin" || Number(userIdLogged) === Number(idParams)) {
        return next(); // OK - Admin OU é o próprio dono do recurso
    }

    return res.status(403).send({ message: "Acesso negado!" });
}

export const verifyOwnerByUserId = (req, res, next) => {
    const userIdLogged = req.user.id; // ID do usuário logado
    const userIdFromParams = req.params.userId; // ID do usuário da URL

    // Verifica se o userId passado na URL é válido
    if (!userIdFromParams || isNaN(userIdFromParams)) {
        return res.status(400).send({ message: "ID inválido!" });
    }

    // Se for admin ou professor, permite o acesso a qualquer treino
    if (req.user.role === 'admin' || req.user.role === 'professor') {
        return next(); // Permite o acesso
    }

    // Caso contrário, verifica se o usuário logado é o dono do treino
    if (userIdLogged === Number(userIdFromParams)) {
        return next(); // O usuário logado é o dono do treino
    }

    return res.status(403).send({ message: "Acesso negado!" });
};
