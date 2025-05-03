/**
 * ================================================================
 * Arquivo: user.controller.js
 * Autor: Pedro Lucas
 * Ano: 2025
 * GitHub: https://github.com/Prulucas
 * ================================================================
 *
 * Descrição:
 * Este arquivo contém os controladores para as operações relacionadas aos usuários.
 * Ele inclui funcionalidades para criar, listar, buscar, atualizar, excluir e exibir o perfil de um usuário.
 * Os controladores utilizam o serviço `userService` para interagir com o banco de dados ou outras lógicas de negócio.
 */

import userService from "../services/user.service.js";

// Controlador para criar um novo usuário
async function createController(req, res) {
    const { name, username, email, password, avatar } = req.body;

    try {
        // Verifica se o CPF foi fornecido no corpo da requisição
        if (!req.body.cpf) {
            return res.status(400).json({ error: "O campo CPF é obrigatório" });
        }

        // Chama o serviço para criar o usuário e gera o token de autenticação
        const token = await userService.createUserService(req.body);
        return res.status(201).json(token); // Retorna o token gerado

    } catch (e) {
        // Em caso de erro, retorna o erro com status 400
        return res.status(400).send(e.message);
    }
}

// Controlador para buscar todos os usuários
async function findAllController(req, res) {
    try {
        // Chama o serviço para obter todos os usuários
        const users = await userService.findAllService();
        return res.send(users); // Retorna a lista de usuários
    } catch (e) {
        // Em caso de erro, retorna o erro com status 404
        return res.status(404).send(e.message);
    }
}

// Controlador para buscar um usuário por ID
async function findByIdController(req, res) {
    try {
        // Chama o serviço para buscar o usuário pelo ID
        const user = await userService.findByIdService(
            req.params.id,
            req.userId
        );
        return res.send(user); // Retorna o usuário encontrado
    } catch (e) {
        // Em caso de erro, retorna o erro com status 400
        return res.status(400).send(e.message);
    }
}

// Controlador para atualizar os dados de um usuário
async function updateController(req, res) {
    try {
        const { name, username, email, password, avatar } = req.body;
        const { userId } = req.params; // Agora usamos userId de req.params
        const user = req.user;

        // Verifica se o usuário está autenticado
        if (!user) {
            return res.status(401).json({ message: "Unauthorized: missing user data" });
        }

        // Verifica se o ID do usuário foi fornecido na URL
        if (!userId) {
            return res.status(400).json({ message: "User ID param is missing" });
        }

        // Chama o serviço para atualizar o usuário com os dados fornecidos
        const response = await userService.updateService(
            { name, username, email, password, avatar },
            userId,
            user.id,
            user.role
        );

        return res.status(200).json(response); // Retorna a resposta de sucesso
    } catch (e) {
        // Em caso de erro, retorna o erro com status 400
        console.error("Update error:", e.message);
        res.status(400).json({ message: e.message });
    }
}

// Controlador para excluir um usuário
async function deleteController(req, res) {
    try {
        const { userId } = req.params; // Usamos userId de req.params
        const { password } = req.body;
        const user = req.user;

        // Verifica se o usuário está autenticado
        if (!user) {
            return res.status(401).json({ message: "Unauthorized: missing user data" });
        }

        // Verifica se o ID do usuário foi fornecido na URL
        if (!userId) {
            return res.status(400).json({ message: "User ID param is missing" });
        }

        // Verifica se a senha foi fornecida no corpo da requisição
        if (!password) {
            return res.status(400).json({ message: "Password is required to delete account" });
        }

        // Chama o serviço para excluir o usuário
        const response = await userService.deleteService(
            userId,
            user.id,
            user.role,
            password
        );

        return res.status(200).json(response); // Retorna a resposta de sucesso
    } catch (e) {
        // Em caso de erro, retorna o erro com status 400
        console.error("Delete error:", e.message);
        res.status(400).json({ message: e.message });
    }
}

// Controlador para exibir o perfil do usuário autenticado
async function profileController(req, res) {
    try {
        // Chama o serviço para obter o perfil do usuário
        const user = await userService.profileService(req.userId);
        return res.send(user); // Retorna as informações do perfil
    } catch (e) {
        // Em caso de erro, retorna o erro com status 400
        return res.status(400).send(e.message);
    }
}

// Exporta os controladores para uso em outras partes do sistema
export default {
    createController,
    findAllController,
    findByIdController,
    updateController,
    deleteController,
    profileController
};
