import 'dotenv/config';
import express from 'express';
import cors from 'cors';

import userRouter from './routes/user.route.js';
import sequelize from './database/db.js'; // Agora usando import default


const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use('/user', userRouter);

// Sincronização do banco
sequelize.sync({ force: true })
    .then(() => {
        console.log('✅ Banco sincronizado!');
        const PORT = process.env.PORT || 3001;
        app.listen(PORT, () => {
            console.log(`Servidor rodando em http://localhost:${PORT}`);
        });
    })
    .catch(err => {
        console.error('❌ Erro ao sincronizar o banco:', err);
    });

export default app;