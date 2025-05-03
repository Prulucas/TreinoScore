import "dotenv/config"; // Carrega as variáveis de ambiente do arquivo .env
import express from "express"; // Importa o framework Express para criar o servidor
import cors from "cors"; // Importa o middleware CORS para permitir requisições entre origens diferentes
import userRouter from "./routes/user.route.js"; // Importa as rotas relacionadas aos usuários
import authRouter from "./routes/auth.route.js"; // Importa as rotas de autenticação
import router from "./routes/index.js"; // Importa as rotas principais da aplicação

import db from "./models/Index.js"; // Importa o arquivo de configuração do banco de dados
import './jobs/resetStatusJob.js'; // Importa os jobs (tarefas agendadas)

// Inicializa a aplicação Express
const app = express();

// Middlewares
app.use(cors()); // Habilita o CORS para permitir requisições de outros domínios
app.use(express.json()); // Permite que o servidor processe JSON nas requisições

// Definindo a rota principal para o aplicativo
app.use("/", router); // Rota principal que gerencia as requisições para outras rotas

// Rotas adicionais
app.use("/user", userRouter); // Rota para gerenciar usuários
app.use("/auth", authRouter); // Rota para autenticação de usuários (login, registro, etc.)

// Inicialização do servidor
const PORT = process.env.PORT || 3001; // Define a porta do servidor, priorizando a variável de ambiente

// Sincroniza o banco de dados
db.sequelize
    .sync({ force: process.env.NODE_ENV === "development" }) // Sincroniza o banco, utilizando 'force' no ambiente de desenvolvimento para reiniciar as tabelas
    .then(() => {
        console.log("✅ Banco sincronizado!"); // Mensagem de sucesso ao sincronizar o banco de dados
        app.listen(PORT, () => { // Inicia o servidor na porta definida
            console.log(`🚀 Servidor rodando em http://localhost:${PORT}`); // Mensagem indicando que o servidor está rodando
            console.log(`🌎 Ambiente: ${process.env.NODE_ENV || "development"}`); // Exibe o ambiente atual
        });
    })
    .catch((err) => {
        console.error("❌ Erro ao sincronizar o banco:", err); // Exibe erro se a sincronização do banco falhar
    });

export default app; // Exporta a instância do servidor para ser usada em testes ou outros módulos
