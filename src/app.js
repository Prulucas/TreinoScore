import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import userRouter from './routes/user.route.js';
import db from './models/Index.js'; // Importe do models/index.js

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use('/user', userRouter);

// Inicialização do servidor
const PORT = process.env.PORT || 3001;
db.sequelize.sync({ force: process.env.NODE_ENV === 'development' })
    .then(() => {
        console.log('✅ Banco sincronizado!');
        app.listen(PORT, () => {
            console.log(`Servidor rodando em http://localhost:${PORT}`);
            console.log(`Ambiente: ${process.env.NODE_ENV || 'development'}`);
        });
    })
    .catch(err => {
        console.error('❌ Erro ao sincronizar o banco:', err);
    });

export default app;