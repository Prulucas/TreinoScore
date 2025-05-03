/**
 * ================================================================
 * Arquivo: auth.service.js
 * Autor: Pedro Lucas
 * Ano: 2025
 * GitHub: https://github.com/Prulucas
 * ================================================================
 *
 * Descrição:
 * Este arquivo define os serviços de autenticação, incluindo a geração
 * de tokens JWT e o processo de login. O login envolve a validação do
 * usuário por email e senha, além da criação do token para o usuário autenticado.
 * 
 * Funções:
 * - generateToken: Gera um token JWT com base no ID do usuário.
 * - loginService: Verifica as credenciais de login (email e senha) e retorna
 *   um token de autenticação se forem válidas.
 */

import jwt from "jsonwebtoken";
import "dotenv/config";
import userRepositories from "../repositories/user.repositories.js";

/**
 * Gera um token JWT com o ID do usuário.
 * @param {number} id - ID do usuário para inclusão no payload do token.
 * @returns {string} - Token JWT gerado.
 */
function generateToken(id) {
    return jwt.sign({ id }, process.env.SECRET_JWT, { expiresIn: 86400 });
}

/**
 * Serviço de login que valida as credenciais de email e senha.
 * Retorna um token JWT e as informações do usuário se o login for bem-sucedido.
 * @param {string} email - Email do usuário.
 * @param {string} password - Senha do usuário.
 * @throws {Error} - Lança erro se o email ou senha forem inválidos.
 * @returns {Object} - Objeto com mensagem de sucesso, token JWT e dados do usuário.
 */
const loginService = async (email, password) => {
    // Verifica se o email e a senha foram fornecidos
    if (!email || !password) {
        throw new Error("Email and password are required");
    }

    // Busca o usuário pelo email
    const user = await userRepositories.findByEmailUserRepository(email);
    if (!user) {
        throw new Error("User not found");
    }

    // Verifica se o usuário possui senha definida
    if (!user.password) {
        throw new Error("No password set for this user");
    }

    // Compara a senha fornecida com a armazenada
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
        throw new Error("Invalid password");
    }

    // Gera o token JWT após login bem-sucedido
    const token = generateToken(user.id);

    // Exibe logs de depuração (remover em produção)
    console.log("Senha digitada:", password);
    console.log("Senha armazenada:", user.password);
    console.log("A senha é válida?", isPasswordValid);

    // Retorna os dados do usuário e o token gerado
    return {
        message: "Login successful",
        token,
        user: {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role
        }
    };
};

export default { generateToken, loginService };
