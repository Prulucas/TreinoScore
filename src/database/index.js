/**
 * ================================================================
 * Arquivo: index.js
 * Autor: Pedro Lucas
 * Ano: 2025
 * GitHub: https://github.com/Prulucas
 * ================================================================
 *
 * Descrição:
 * Este arquivo é responsável por configurar a conexão com o banco de 
 * dados PostgreSQL utilizando o Sequelize como ORM. Ele carrega as 
 * variáveis de ambiente de um arquivo `.env` e cria uma instância do 
 * Sequelize para ser utilizada em outras partes do projeto.
 *
 * O arquivo exporta a instância do Sequelize como `sequelize`, permitindo
 * que seja importada e utilizada em outros módulos do projeto para interagir 
 * com o banco de dados.
 */

// Importa o Sequelize e dotenv para carregar as variáveis de ambiente
import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

// Carrega as variáveis de ambiente do arquivo .env
dotenv.config();

// Cria e exporta a instância do Sequelize configurada com as variáveis de ambiente
export const sequelize = new Sequelize(
    process.env.DB_NAME,        // Nome do banco de dados
    process.env.DB_USER,        // Usuário do banco de dados
    process.env.DB_PASSWORD,    // Senha do banco de dados
    {
        host: process.env.DB_HOST,  // Host do banco de dados
        port: process.env.DB_PORT,  // Porta do banco de dados
        dialect: 'postgres'         // Tipo do banco de dados (PostgreSQL)
    }
);
