import userService from "../services/user.service.js";

async function createController(req, res) {
    const { name, username, email, password, avatar } = req.body;

    try {
        if (!req.body.cpf) {
            return res.status(400).json({ error: "O campo CPF é obrigatório" });
        }

        const token = await userService.createUserService(req.body);
        return res.status(201).json(token); // Apenas um res.json()

    } catch (e) {
        return res.status(400).send(e.message);
    }
}

async function findAllController(req, res) {
    try {
        const users = await userService.findAllService();
        return res.send(users);
    } catch (e) {
        return res.status(404).send(e.message);
    }
}

async function findByIdController(req, res) {
    try {
        const user = await userService.findByIdService(
            req.params.id,
            req.userId
        );
        return res.send(user);
    } catch (e) {
        return res.status(400).send(e.message);
    }
}

async function updateController(req, res) {
    try {
        const { name, username, email, password, avatar } = req.body;
        const { id: userId } = req.params;
        const { id: userIdLogged, role } = req.user; // 👈 pega role também

        const response = await userService.updateService(
            { name, username, email, password, avatar },
            userId,
            userIdLogged,
            role // 👈 passa role
        );

        return res.send(response);
    } catch (e) {
        res.status(400).send({ message: e.message });
    }
}


async function deleteController(req, res) {
    try {
        const { id: userId } = req.params;
        const { password } = req.body; // Solicita a senha

        const { id: userIdLogged, role } = req.user;

        // Verifica se a senha foi enviada
        if (!password) {
            return res.status(400).json({ message: "Password is required to delete account" });
        }

        const response = await userService.deleteService(userId, userIdLogged, role, password);

        return res.send(response);
    } catch (e) {
        res.status(400).send({ message: e.message });
    }
}


//verificar o que a função faz
async function profileController(req, res) {
    try {
        const user = await userService.profileService(req.userId);
        return res.send(user);
    } catch (e) {
        return res.status(400).send(e.message);
    }
}

export default {
    createController,
    findAllController,
    findByIdController,
    updateController,
    deleteController,
    profileController
};