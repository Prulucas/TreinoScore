/**
 * ================================================================
 * Arquivo: user.repositories.js
 * Autor: Pedro Lucas
 * Ano: 2025
 * GitHub: https://github.com/Prulucas
 * ================================================================
 *
 * Descrição:
 * Repositório responsável por operações de CRUD e buscas específicas 
 * relacionadas aos usuários no sistema.
 */

import User from "../models/User.js";

/**
 * Busca um usuário pelo e-mail.
 * 
 * @param {string} email - O e-mail do usuário a ser buscado.
 * @returns {Promise<Object|null>} Retorna o usuário encontrado ou null.
 */
const findByEmailUserRepository = async (email) => {
    return await User.findOne({
        where: { email }
    });
};

/**
 * Cria um novo usuário no banco de dados.
 * 
 * @param {Object} body - Os dados do novo usuário.
 * @returns {Promise<Object>} Retorna o usuário criado.
 */
const createUserRepository = (body) => User.create(body);

/**
 * Busca todos os usuários cadastrados.
 * 
 * @returns {Promise<Array>} Retorna uma lista de usuários.
 */
const findAllRepository = () => User.findAll();

/**
 * Busca um usuário pelo ID.
 * 
 * @param {number} id - O ID do usuário a ser buscado.
 * @returns {Promise<Object|null>} Retorna o usuário encontrado ou null.
 */
const findByIdRepository = (id) => User.findByPk(id);

/**
 * Atualiza os dados de um usuário pelo ID.
 * 
 * @param {number} id - O ID do usuário.
 * @param {Object} body - Os novos dados a serem atualizados.
 * @returns {Promise<number>} Retorna o número de registros atualizados.
 */
const updateRepository = (id, body) =>
    User.update(body, { where: { id } });

/**
 * Deleta um usuário pelo ID.
 * 
 * @param {number} id - O ID do usuário a ser deletado.
 * @returns {Promise<number>} Retorna o número de registros deletados.
 */
const deleteRepository = (id) => User.destroy({ where: { id } });

/**
 * Busca um usuário pelo CPF.
 * 
 * @param {string} cpf - O CPF do usuário a ser buscado.
 * @returns {Promise<Object|null>} Retorna o usuário encontrado ou null.
 */
const findByCpfUserRepository = async (cpf) => {
    const user = await User.findOne({ where: { cpf } });
    return user || null; // Retorna null se não encontrar o usuário
};

// Exporta todos os métodos do repositório
export default {
    findByEmailUserRepository,
    createUserRepository,
    findAllRepository,
    findByIdRepository,
    updateRepository,
    deleteRepository,
    findByCpfUserRepository
};
