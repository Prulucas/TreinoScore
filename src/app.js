import "dotenv/config";
import express from "express";
import cors from "cors";
import userRouter from "./routes/user.route.js";
import authRouter from "./routes/auth.route.js"; // Certifique-se de que esse arquivo existe!
import db from "./models/Index.js"; // Corrigindo para letra minúscula "index.js"

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Rotas
app.use("/user", userRouter);
app.use("/auth", authRouter); // Certifique-se de que o arquivo auth.routes.js está correto

// Inicialização do servidor
const PORT = process.env.PORT || 3001;

db.sequelize
    .sync({ force: process.env.NODE_ENV === "development" }) // Em produção, use { alter: true } para evitar perda de dados
    .then(() => {
        console.log("✅ Banco sincronizado!");
        app.listen(PORT, () => {
            console.log(`🚀 Servidor rodando em http://localhost:${PORT}`);
            console.log(`🌎 Ambiente: ${process.env.NODE_ENV || "development"}`);
        });
    })
    .catch((err) => {
        console.error("❌ Erro ao sincronizar o banco:", err);
    });

export default app;
