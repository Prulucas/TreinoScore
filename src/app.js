import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { sequelize } from './database/db.js'; // Importe o sequelize

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Sincronização do banco
sequelize.sync({ force: true })
    .then(() => {
        console.log('✅ Banco sincronizado!');
        const PORT = process.env.PORT || 3000;
        app.listen(PORT, () => {
            console.log(`Servidor rodando em http://localhost:${PORT}`);
        });
    })
    .catch(err => {
        console.error('❌ Erro ao sincronizar o banco:', err);
    });

export default app;