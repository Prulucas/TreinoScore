import userRepositories from "../repositories/user.repositories.js";
import authService from "../services/auth.service.js";
import bcrypt from "bcrypt";

const createUserService = async (body) => {
    const { name, username, email, password, avatar } = body;

    if (!name || !username || !email || !password || !avatar) {
        throw new Error("Submit all fields for registration");
    }

    const foundUser = await userRepositories.findByEmailUserRepository(email);
    if (foundUser) throw new Error("User already exists");

    // Hash da senha antes de criar o usuário
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await userRepositories.createUserRepository({
        ...body,
        password: hashedPassword
    });

    if (!user) throw new Error("Error creating User");

    const token = authService.generateToken(user.id);

    return {
        message: "User created successfully",
        token
    };
};

const findAllService = async () => {
    const users = await userRepositories.findAllRepository();
    if (users.length === 0) throw new Error("There are no registered users");
    return users;
};

const findByIdService = async (userId, userIdLogged) => {
    const idParams = userId || userIdLogged;
    if (!idParams) throw new Error("Send an id in the parameters");

    const user = await userRepositories.findByIdRepository(idParams);
    return user;
};

const updateService = async (body, userId) => {
    const { name, username, email, password, avatar } = body;

    if (!name && !username && !email && !password && !avatar) {
        throw new Error("Submit at least one field for update");
    }

    const user = await userRepositories.findByIdRepository(userId);
    if (user.id != userId) throw new Error("You cannot update this user");

    // Se estiver atualizando a senha, faz o hash
    if (password) {
        const salt = await bcrypt.genSalt(10);
        body.password = await bcrypt.hash(password, salt);
    }

    await userRepositories.updateRepository(userId, body);
    return { message: "User successfully updated" };
};

const deleteService = async (id, userIdLogged) => {
    if (id != userIdLogged) {
        throw new Error("You cannot delete this user");
    }

    const user = await userRepositories.findByIdRepository(id);
    if (!user) {
        throw new Error("User not found");
    }

    await userRepositories.deleteRepository(id);
    return { message: "User deleted successfully" };
};

const profileService = async (userId) => {
    const user = await userRepositories.findByIdRepository(userId);
    if (!user) {
        throw new Error("User not found");
    }

    return {
        id: user.id,
        name: user.name,
        username: user.username,
        email: user.email,
        avatar: user.avatar,
        createdAt: user.createdAt
    };
};

// Exportação padrão de todos os serviços
export default {
    createUserService,
    findAllService,
    findByIdService,
    updateService,
    deleteService,
    profileService
};