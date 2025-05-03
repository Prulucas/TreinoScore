/**
 * ================================================================
 * Arquivo: auth.repositories.js
 * Autor: Pedro Lucas
 * Ano: 2025
 * GitHub: https://github.com/Prulucas
 * ================================================================
 *
 * Descrição:
 * Repositório responsável por operações relacionadas à autenticação de usuários.
 * Inclui métodos para buscar usuários por e-mail (login) e por ID.
 */

import User from "../models/User.js";

/**
 * Busca um usuário pelo e-mail e retorna seus dados, incluindo a senha criptografada.
 * Usado no processo de autenticação.
 * 
 * @param {string} email - O e-mail do usuário a ser buscado.
 * @returns {Promise<Object|null>} Retorna o usuário encontrado ou null se não existir.
 */
const loginRepository = (email) => User.findOne({ email }).select("+password");

/**
 * Busca um usuário pelo seu ID único.
 * 
 * @param {string} id - O ID do usuário a ser buscado.
 * @returns {Promise<Object|null>} Retorna o usuário encontrado ou null se não existir.
 */
const findById = (id) => User.findById(id);

// Exporta os métodos de repositório para serem usados em outros módulos
export default { loginRepository, findById };
