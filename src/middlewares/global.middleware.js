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
