import userRepositories from "../repositories/user.repositories.js";
import { WorkoutRepository } from "../repositories/workout.repositories.js"
import authService from "../services/auth.service.js";
import bcrypt from "bcrypt";
import { WorkoutService } from './workout.service.js';

const createUserService = async (body) => {
    const { name, username, email, password, cpf, avatar, role } = body;

    if (!name || !username || !email || !password || !cpf || !avatar || !role) {
        throw new Error("Submit all fields for registration");
    }

    // Verifica se o e-mail já está cadastrado
    const foundUser = await userRepositories.findByEmailUserRepository(email);
    if (foundUser) throw new Error("User with this email already exists");

    // Verifica se o CPF já está cadastrado
    const foundUserByCpf = await userRepositories.findByCpfUserRepository(cpf);
    if (foundUserByCpf) throw new Error("User with this CPF already exists");

    // Apenas cria o usuário, a senha será hasheada pelo hook
    const user = await userRepositories.createUserRepository(body);

    if (!user) throw new Error("Error creating User");

    const token = authService.generateToken(user.id);

    if (user.role === 'aluno') {
        const workoutService = new WorkoutService();
        await workoutService.createDefaultWorkouts(user.id);
    }

    return {
        message: "User created successfully",
        token,
        user: {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role
        }
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
    if (!user) throw new Error("User not found");
    return user;
};

const updateService = async (body, userId, userIdLogged, userRole) => {
    const { name, username, email, password, avatar } = body;

    if (!name && !username && !email && !password && !avatar) {
        throw new Error("Submit at least one field for update");
    }

    const user = await userRepositories.findByIdRepository(userId);
    if (!user) throw new Error("User not found");

    // Agora deixa admins atualizarem qualquer usuário
    if (user.id !== userIdLogged && userRole !== 'admin') {
        throw new Error("You cannot update this user");
    }

    if (password) {
        const salt = await bcrypt.genSalt(10);
        body.password = await bcrypt.hash(password, salt);
    }

    await userRepositories.updateRepository(userId, body);
    return { message: "User successfully updated" };
};

const deleteService = async (id, userIdLogged, userRole, password) => {
    const user = await userRepositories.findByIdRepository(id);
    if (!user) {
        throw new Error("User not found");
    }

    // Verifica se o ID do usuário logado corresponde ao ID do usuário a ser deletado
    const userIdToDelete = String(id);
    const loggedUserId = String(userIdLogged);

    if (userIdToDelete !== loggedUserId) {
        throw new Error("You cannot delete this user");
    }

    // Verifica se a senha está correta
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
        throw new Error("Incorrect password");
    }

    // ⚠️ Crie a instância corretamente
    const workoutRepository = new WorkoutRepository();

    // ⚠️ Delete os treinos do usuário
    await workoutRepository.deleteByUserId(id); // id deve estar como número, se for esse o tipo no banco

    // Deletar o usuário
    await userRepositories.deleteRepository(userIdToDelete);

    return { message: "User and associated workouts deleted successfully" };
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
        role: user.role,
        createdAt: user.createdAt
    };
};

export default {
    createUserService,
    findAllService,
    findByIdService,
    updateService,
    deleteService,
    profileService
};