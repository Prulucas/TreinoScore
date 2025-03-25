import { Sequelize } from 'sequelize';

const sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASSWORD, // Certifique-se que está definido no .env
    {
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        dialect: 'postgres',
        dialectOptions: {
            ssl: false,
        },
        logging: console.log, // Mostra logs SQL no console
    }
);

// Teste de conexão
sequelize.authenticate()
    .then(() => console.log('✅ Conexão estabelecida com sucesso!'))
    .catch(err => console.error('❌ Falha na conexão:', err));

export { sequelize };