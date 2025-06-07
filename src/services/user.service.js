/**
 * ================================================================
 * Arquivo: user.service.js
 * Autor: Pedro Lucas
 * Ano: 2025
 * GitHub: https://github.com/Prulucas
 * ================================================================
 *
 * Descrição:
 * Este arquivo contém os serviços relacionados aos usuários, incluindo
 * a criação, atualização, exclusão e consulta de usuários, além da
 * criação de treinos padrão para usuários recém-criados. As operações
 * de manipulação de dados de usuários são realizadas através do repositório
 * `userRepositories`, e o repositório `workoutRepository` é utilizado para
 * manipular os treinos relacionados ao usuário.
 *
 * Funções:
 * - createUserService: Cria um novo usuário, verificando se o email e CPF são únicos.
 * - findAllService: Retorna todos os usuários cadastrados.
 * - findByIdService: Retorna os dados de um usuário, baseado no ID fornecido ou no usuário logado.
 * - updateService: Atualiza as informações de um usuário, validando permissões de administrador.
 * - deleteService: Exclui um usuário e seus treinos, após validação da senha.
 * - profileService: Retorna as informações de perfil de um usuário.
 */

import userRepositories from "../repositories/user.repositories.js";
import { WorkoutRepository } from "../repositories/workout.repositories.js";
import authService from "../services/auth.service.js";
import bcrypt from "bcrypt";
import { WorkoutService } from './workout.service.js';

/**
 * Cria um novo usuário, verificando se o email e CPF são únicos.
 * @param {Object} body - Dados do novo usuário (name, username, email, password, cpf, avatar, role).
 * @throws {Error} - Lança erro se faltar algum campo ou se o email/CPF já existirem.
 * @returns {Object} - Objeto contendo uma mensagem de sucesso, o token de autenticação e os dados do usuário.
 */
const createUserService = async (body) => {
    const { name, username, email, password, cpf, avatar, role } = body;

    // Verifica se todos os campos obrigatórios foram preenchidos
    if (!name || !username || !email || !password || !cpf || !avatar || !role) {
        throw new Error("Submit all fields for registration");
    }

    // Verifica se o e-mail já está cadastrado
    const foundUser = await userRepositories.findByEmailUserRepository(email);
    if (foundUser) throw new Error("User with this email already exists");

    // Verifica se o CPF já está cadastrado
    const foundUserByCpf = await userRepositories.findByCpfUserRepository(cpf);
    if (foundUserByCpf) throw new Error("User with this CPF already exists");

    // Cria o usuário e a senha será hasheada automaticamente pelo hook
    const user = await userRepositories.createUserRepository(body);
    if (!user) throw new Error("Error creating User");

    // Gera o token de autenticação
    const token = authService.generateToken(user.id);

    // Se for um aluno, cria os treinos padrão
    if (user.role === 'aluno') {
        const workoutService = new WorkoutService();
        await workoutService.createDefaultWorkouts(user.id);
    }

    // Retorna a resposta com a mensagem de sucesso e o token
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

/**
 * Retorna todos os usuários cadastrados.
 * @throws {Error} - Lança erro se não houver usuários cadastrados.
 * @returns {Array} - Lista de usuários cadastrados.
 */
const findAllService = async () => {
    const users = await userRepositories.findAllRepository();
    if (users.length === 0) throw new Error("There are no registered users");
    return users;
};

/**
 * Retorna os dados de um usuário, com base no ID fornecido ou no usuário logado.
 * @param {number} userId - ID do usuário a ser consultado.
 * @param {number} userIdLogged - ID do usuário logado.
 * @throws {Error} - Lança erro se o ID não for fornecido ou se o usuário não for encontrado.
 * @returns {Object} - Dados do usuário.
 */
const findByIdService = async (userId, userIdLogged) => {
    const idParams = userId || userIdLogged;
    if (!idParams) throw new Error("Send an id in the parameters");

    const user = await userRepositories.findByIdRepository(idParams);
    if (!user) throw new Error("User not found");
    return user;
};

/**
 * Atualiza os dados de um usuário.
 * @param {Object} body - Dados do usuário a serem atualizados.
 * @param {number} userId - ID do usuário a ser atualizado.
 * @param {number} userIdLogged - ID do usuário logado.
 * @param {string} userRole - Função do usuário logado (para validar permissões de admins).
 * @throws {Error} - Lança erro se nenhum campo for fornecido ou se o usuário não for encontrado.
 * @returns {Object} - Objeto contendo a mensagem de sucesso.
 */
const updateService = async (body, userId, userIdLogged, userRole) => {
    const { name, username, email, password, avatar } = body;

    // Verifica se pelo menos um campo foi fornecido
    if (!name && !username && !email && !password && !avatar) {
        throw new Error("Submit at least one field for update");
    }

    const user = await userRepositories.findByIdRepository(userId);
    if (!user) throw new Error("User not found");

    // Verifica permissões: apenas o usuário logado ou admins podem atualizar o usuário
    if (user.id !== userIdLogged && userRole !== 'admin') {
        throw new Error("You cannot update this user");
    }

    // Se a senha for fornecida, gera um novo hash
    if (password) {
        const salt = await bcrypt.genSalt(10);
        body.password = await bcrypt.hash(password, salt);
    }

    // Atualiza o usuário no banco de dados
    await userRepositories.updateRepository(userId, body);
    return { message: "User successfully updated" };
};

/**
 * Deleta um usuário e seus treinos associados.
 * @param {number} id - ID do usuário a ser deletado.
 * @param {number} userIdLogged - ID do usuário logado.
 * @param {string} userRole - Função do usuário logado.
 * @param {string} password - Senha do usuário logado para confirmar a exclusão.
 * @throws {Error} - Lança erro se o usuário não for encontrado ou se a senha estiver incorreta.
 * @returns {Object} - Mensagem de sucesso após exclusão.
 */
const deleteService = async (id, userIdLogged, userRole, password) => {
    const user = await userRepositories.findByIdRepository(id);
    if (!user) {
        throw new Error("User not found");
    }

    // Verifica se o ID do usuário logado corresponde ao ID do usuário a ser deletado
    const userIdToDelete = String(id);
    const loggedUserId = String(userIdLogged);

    // Verifica se a senha está correta
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
        throw new Error("Incorrect password");
    }

    // Exclui os treinos do usuário
    const workoutRepository = new WorkoutRepository();
    await workoutRepository.deleteByUserId(id);

    // Exclui o usuário
    await userRepositories.deleteRepository(userIdToDelete);

    return { message: "User and associated workouts deleted successfully" };
};

/**
 * Retorna as informações de perfil de um usuário.
 * @param {number} userId - ID do usuário a ser consultado.
 * @throws {Error} - Lança erro se o usuário não for encontrado.
 * @returns {Object} - Informações do perfil do usuário.
 */
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
