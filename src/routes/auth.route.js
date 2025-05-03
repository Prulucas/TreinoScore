/**
 * ================================================================
 * Arquivo: auth.route.js
 * Autor: Pedro Lucas
 * Ano: 2025
 * GitHub: https://github.com/Prulucas
 * ================================================================
 *
 * Descrição:
 * Define as rotas relacionadas à autenticação de usuários.
 * Este módulo configura a rota de login, que permite aos usuários
 * autenticarem-se no sistema.
 */

import { Router } from "express";
import authController from "../controllers/auth.controller.js";

const authRouter = Router();

// Rota para autenticação de usuário (login)
authRouter.post("/login", authController.loginController);

export default authRouter;
