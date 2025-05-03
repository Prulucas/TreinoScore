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
        const { userId } = req.params; // Agora usamos userId de req.params
        const user = req.user;

        if (!user) {
            return res.status(401).json({ message: "Unauthorized: missing user data" });
        }

        if (!userId) {
            return res.status(400).json({ message: "User ID param is missing" });
        }

        const response = await userService.updateService(
            { name, username, email, password, avatar },
            userId,
            user.id,
            user.role
        );

        return res.status(200).json(response);
    } catch (e) {
        console.error("Update error:", e.message);
        res.status(400).json({ message: e.message });
    }
}

async function deleteController(req, res) {
    try {
        const { userId } = req.params; // Usamos userId de req.params
        const { password } = req.body;
        const user = req.user;

        if (!user) {
            return res.status(401).json({ message: "Unauthorized: missing user data" });
        }

        if (!userId) {
            return res.status(400).json({ message: "User ID param is missing" });
        }

        if (!password) {
            return res.status(400).json({ message: "Password is required to delete account" });
        }

        const response = await userService.deleteService(
            userId,
            user.id,
            user.role,
            password
        );

        return res.status(200).json(response);
    } catch (e) {
        console.error("Delete error:", e.message);
        res.status(400).json({ message: e.message });
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