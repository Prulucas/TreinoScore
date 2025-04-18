import { Sequelize } from 'sequelize';
import workoutModel from './Workout.js';

// Configuração do Sequelize
const sequelize = new Sequelize({
    dialect: 'postgres',
    host: process.env.DB_HOST,
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT,
    define: {
        timestamps: true,
        underscored: true,
        paranoid: true
    },
    logging: process.env.NODE_ENV === 'development' ? console.log : false
});

// Modelos
const models = {
    Workout: workoutModel(sequelize, Sequelize.DataTypes)
    // Adicione outros modelos aqui quando necessário
};

// Conexão e associações
const initializeDatabase = async () => {
    try {
        await sequelize.authenticate();
        console.log('✅ Conexão com PostgreSQL estabelecida!');

        // Configura associações dos modelos
        Object.values(models).forEach(model => {
            if (model.associate) {
                model.associate(models);
            }
        });

        // Sincronização opcional (recomendado apenas para desenvolvimento)
        if (process.env.NODE_ENV === 'development') {
            await sequelize.sync({ alter: true });
            console.log('🔁 Modelos sincronizados com o banco');
        }

    } catch (error) {
        console.error('❌ Falha na inicialização do banco:', error);
        process.exit(1);
    }
};

// Exportações
export {
    sequelize,
    models,
    initializeDatabase
};

export default {
    sequelize,
    ...models,
    initializeDatabase
};