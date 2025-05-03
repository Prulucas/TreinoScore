/**
 * ================================================================
 * Arquivo: index.js
 * Autor: Pedro Lucas
 * Ano: 2025
 * GitHub: https://github.com/Prulucas
 * ================================================================
 *
 * Descrição:
 * Este arquivo configura a conexão com o banco de dados PostgreSQL
 * no Supabase utilizando a URL de conexão (com pooling e SSL).
 * Utiliza Sequelize como ORM.
 */

import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

// Carrega as variáveis de ambiente do arquivo .env
dotenv.config();

console.log('DB Config =>', {
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT
});

// Cria e exporta a instância do Sequelize usando DATABASE_URL
export const sequelize = new Sequelize(process.env.DATABASE_URL, {
    dialect: 'postgres',
    dialectOptions: {
        ssl: {
            require: true, // Força uso de SSL
            rejectUnauthorized: false // Evita erros com certificado não autorizado
        }
    },
    logging: false // Desativa logs SQL no console (opcional)
});
