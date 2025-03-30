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
        const userIdLogged = req.userId;

        const response = await userService.updateService(
            { name, username, email, password, avatar },
            userId,
            userIdLogged
        );

        return res.send(response);
    } catch (e) {
        res.status(400).send(e.message);
    }
}

async function deleteController(req, res) {
    try {
        await userService.deleteService(req.params.id, req.userId);
        return res.send({ message: "User deleted successfully" });
    } catch (e) {
        return res.status(400).send(e.message);
    }
}

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