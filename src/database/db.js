import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config();

// 1. Crie a instância do Sequelize
const sequelizeInstance = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASSWORD,
    {
        host: process.env.DB_HOST,  // Aqui será o URL do Supabase
        port: process.env.DB_PORT,
        dialect: 'postgres',
        logging: console.log  // Para ver os logs SQL
    }
);

// 2. Verifique a conexão
const testConnection = async () => {
    try {
        await sequelizeInstance.authenticate();
        console.log('Conexão com o Supabase foi bem-sucedida!');
    } catch (error) {
        console.error('Não foi possível conectar ao Supabase:', error);
    }
};

// Chama a função de teste de conexão
testConnection();

// 3. Exporte explicitamente como padrão
export default sequelizeInstance;
