/**
 * ================================================================
 * Arquivo: index.js
 * Autor: Pedro Lucas
 * Ano: 2025
 * GitHub: https://github.com/Prulucas
 * ================================================================
 *
 * Descrição:
 * Este arquivo centraliza e exporta a instância do Sequelize já
 * configurada em db.js. Ele existe para manter compatibilidade
 * com a estrutura esperada pelos modelos e pelo app.js.
 */

import sequelize from './db.js'; // Importa a instância única do Sequelize

const db = {};
db.sequelize = sequelize;

export default db;
