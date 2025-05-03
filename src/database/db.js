/**
 * ================================================================
 * Arquivo: db.js
 * Autor: Pedro Lucas
 * Ano: 2025
 * GitHub: https://github.com/Prulucas
 * ================================================================
 *
 * Descrição:
 * Este arquivo é responsável pela configuração e autenticação da conexão
 * com o banco de dados PostgreSQL, utilizando o Sequelize como ORM. Ele 
 * carrega as variáveis de ambiente de um arquivo `.env` e testa a conexão 
 * com o banco de dados (Supabase, neste caso).
 * 
 * O arquivo exporta a instância do Sequelize para ser utilizada em outros 
 * arquivos para interagir com o banco de dados.
 */

// Importa o Sequelize e dotenv para carregar as variáveis de ambiente
import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

// Carrega as variáveis de ambiente do arquivo .env
dotenv.config();

// 1. Crie a instância do Sequelize
const sequelizeInstance = new Sequelize(
    process.env.DB_NAME,        // Nome do banco de dados
    process.env.DB_USER,        // Usuário do banco de dados
    process.env.DB_PASSWORD,    // Senha do banco de dados
    {
        host: process.env.DB_HOST,  // URL do Supabase ou outro serviço de banco de dados
        port: process.env.DB_PORT,  // Porta de conexão com o banco de dados
        dialect: 'postgres',        // Tipo do banco de dados (PostgreSQL)
        logging: console.log        // Habilita o log SQL para depuração
    }
);

// 2. Verifique a conexão
const testConnection = async () => {
    try {
        await sequelizeInstance.authenticate();  // Testa a conexão com o banco de dados
        console.log('Conexão com o Supabase foi bem-sucedida!');
    } catch (error) {
        console.error('Não foi possível conectar ao Supabase:', error);
    }
};

// Chama a função de teste de conexão
testConnection();

// 3. Exporte explicitamente como padrão a instância do Sequelize
export default sequelizeInstance;
