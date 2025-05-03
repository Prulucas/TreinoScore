/**
 * ================================================================
 * Arquivo: auth.controller.js
 * Autor: Pedro Lucas
 * Ano: 2025
 * GitHub: https://github.com/Prulucas
 * ================================================================
 *
 * Descrição:
 * Controller responsável pelo login do usuário.
 * Recebe as credenciais do front-end e utiliza o serviço de autenticação.
 */

import authService from "../services/auth.service.js";

/**
 * Controller: loginController
 * 
 * Função responsável por autenticar o usuário.
 * Espera receber no corpo da requisição um email e uma senha.
 */
const loginController = async (req, res) => {
    console.log("Request Body:", req.body); // Loga o corpo da requisição para debug

    const { email, password } = req.body;

    // Validação simples: verifica se email e senha foram enviados
    if (!email || !password) {
        return res.status(400).json({ error: "Email and password are required" });
    }

    try {
        // Chama o serviço de autenticação passando email e senha
        const result = await authService.loginService(email, password);
        return res.json(result); // Retorna o resultado (normalmente o token)
    } catch (error) {
        // Caso ocorra algum erro, retorna status 400 e a mensagem do erro
        return res.status(400).json({ error: error.message });
    }
};

// Exporta o controller (usado nas rotas)
export default { loginController };
