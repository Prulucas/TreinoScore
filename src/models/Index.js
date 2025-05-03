/**
 * ================================================================
 * Arquivo: Index.js
 * Autor: Pedro Lucas
 * Ano: 2025
 * GitHub: https://github.com/Prulucas
 * ================================================================
 *
 * Descrição:
 * Este arquivo é responsável por configurar e inicializar a conexão 
 * com o banco de dados PostgreSQL usando Sequelize.
 * Também registra e associa os modelos do sistema.
 * Inclui uma função `initializeDatabase` para autenticar a conexão e 
 * sincronizar os modelos com o banco, útil durante o desenvolvimento.
 */

import { Sequelize } from 'sequelize'; // Importa Sequelize ORM
import workoutModel from './Workout.js'; // Importa o modelo Workout

// Configuração do Sequelize para conectar no banco PostgreSQL
const sequelize = new Sequelize({
    dialect: 'postgres',
    host: process.env.DB_HOST, // Host do banco de dados
    username: process.env.DB_USER, // Usuário do banco
    password: process.env.DB_PASSWORD, // Senha do banco
    database: process.env.DB_NAME, // Nome do banco
    port: process.env.DB_PORT, // Porta do banco
    define: {
        timestamps: true,  // Adiciona createdAt e updatedAt automaticamente
        underscored: true, // Usa snake_case no banco (ex: user_id ao invés de userId)
        paranoid: true     // Ativa soft delete com o campo deletedAt
    },
    logging: process.env.NODE_ENV === 'development' ? console.log : false // Log de SQL apenas no ambiente de desenvolvimento
});

// Registra os modelos no Sequelize
const models = {
    Workout: workoutModel(sequelize, Sequelize.DataTypes)
    // Outros modelos podem ser adicionados aqui futuramente
};

// Função para inicializar a conexão e configurar associações dos modelos
const initializeDatabase = async () => {
    try {
        // Testa a conexão com o banco
        await sequelize.authenticate();
        console.log('✅ Conexão com PostgreSQL estabelecida!');

        // Configura associações entre os modelos (se existirem)
        Object.values(models).forEach(model => {
            if (model.associate) {
                model.associate(models);
            }
        });

        // Sincroniza os modelos com o banco no modo desenvolvimento
        if (process.env.NODE_ENV === 'development') {
            await sequelize.sync({ alter: true }); // Atualiza tabelas sem perder dados
            console.log('🔁 Modelos sincronizados com o banco');
        }

    } catch (error) {
        console.error('❌ Falha na inicialização do banco:', error);
        process.exit(1); // Encerra a aplicação em caso de falha
    }
};

// Exporta a instância sequelize, os modelos e a função de inicialização
export {
    sequelize,
    models,
    initializeDatabase
};

// Exporta tudo junto por padrão
export default {
    sequelize,
    ...models,
    initializeDatabase
};
