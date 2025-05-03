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
/**
 * ================================================================
 * Arquivo: db.js
 * Descrição: Configura e autentica conexão com Supabase via Pooler (Sequelize + SSL)
 * ================================================================
 */
// db.js
import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config();

const sequelize = new Sequelize(process.env.DATABASE_URL, {
    dialect: 'postgres',
    protocol: 'postgres',
    dialectOptions: {
        ssl: {
            require: true,  // Exige SSL
            rejectUnauthorized: false // Permite certificados autoassinados (ideal para desenvolvimento)
        }
    },
    logging: false
});

// Teste de conexão
(async () => {
    try {
        await sequelize.authenticate();
        console.log('✅ Conexão com o Supabase via pooler foi bem-sucedida!');
    } catch (error) {
        console.error('❌ Erro ao conectar ao Supabase:', error.message);
    }
})();

export default sequelize;