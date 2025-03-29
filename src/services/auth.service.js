import jwt from "jsonwebtoken";
import "dotenv/config";
import userRepositories from "../repositories/user.repositories.js";

// Verificação inicial das variáveis de ambiente
if (!process.env.SECRET_JWT || !process.env.SECRET_JWT_REFRESH) {
    throw new Error("As chaves JWT não estão configuradas no arquivo .env");
}

// Tempos de expiração configuráveis
const TOKEN_EXPIRATION = process.env.TOKEN_EXPIRATION || '1h';
const REFRESH_TOKEN_EXPIRATION = process.env.REFRESH_TOKEN_EXPIRATION || '7d';

/**
 * Gera um token JWT para o usuário
 * @param {string} id - ID do usuário
 * @returns {string} Token JWT
 */
function generateToken(id) {
    return jwt.sign(
        { id },
        process.env.SECRET_JWT,
        { expiresIn: TOKEN_EXPIRATION }
    );
}

/**
 * Gera um refresh token JWT
 * @param {string} id - ID do usuário
 * @returns {string} Refresh Token JWT
 */
function generateRefreshToken(id) {
    return jwt.sign(
        { id },
        process.env.SECRET_JWT_REFRESH,
        { expiresIn: REFRESH_TOKEN_EXPIRATION }
    );
}

/**
 * Serviço de autenticação/login
 * @param {Object} credentials - Credenciais do usuário
 * @param {string} credentials.email - Email do usuário
 * @param {string} credentials.password - Senha do usuário
 * @returns {Object} Objeto com token e refresh token
 */
const loginService = async ({ email, password }) => {
    const user = await userRepositories.loginRepository(email);
    if (!user) throw new Error("Credenciais inválidas");

    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) throw new Error("Credenciais inválidas");

    return {
        token: generateToken(user.id),
        refreshToken: generateRefreshToken(user.id),
        userId: user.id
    };
};

/**
 * Serviço de renovação de token
 * @param {string} refreshToken - Refresh token válido
 * @returns {Object} Objeto com novo token
 */
const refreshTokenService = async (refreshToken) => {
    try {
        const decoded = jwt.verify(refreshToken, process.env.SECRET_JWT_REFRESH);
        const user = await userRepositories.findByIdRepository(decoded.id);

        if (!user) throw new Error("Usuário não encontrado");

        return {
            token: generateToken(user.id),
            userId: user.id
        };
    } catch (error) {
        throw new Error("Refresh token inválido ou expirado");
    }
};

/**
 * Serviço de logout (esqueleto para implementação futura)
 * @param {string} token - Token JWT a ser invalidado
 * @returns {Object} Mensagem de confirmação
 */
const logoutService = async (token) => {
    // Em produção, implemente lógica para invalidar o token
    return {
        message: "Logout realizado com sucesso",
        success: true
    };
};

// Exportação padrão
export default {
    generateToken,
    generateRefreshToken,
    loginService,
    refreshTokenService,
    logoutService
};