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

// Teste de conexão (sem sincronização aqui)
try {
    await sequelize.authenticate();
    console.log('✅ Conexão com PostgreSQL estabelecida!');
} catch (error) {
    console.error('❌ Falha na conexão com o banco:', error);
    process.exit(1);
}

const db = {
    Workout: workoutModel(sequelize, Sequelize.DataTypes),
    sequelize,
    Sequelize
};

export default db;