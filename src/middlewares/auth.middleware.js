import "dotenv/config";
import jwt from "jsonwebtoken";
import userRepositories from "../repositories/user.repositories.js";

async function authMiddleware(req, res, next) {
    try {
        const authHeader = req.headers.authorization;

        // Verificação do header de autorização
        if (!authHeader) {
            return res.status(401).json({ message: "Token não informado!" });
        }

        const [scheme, token] = authHeader.split(" ");

        // Validação do formato do token
        if (!scheme || !token || !/^Bearer$/i.test(scheme)) {
            return res.status(401).json({ message: "Formato de token inválido! Use: Bearer <token>" });
        }

        // Verificação do token JWT
        const decoded = jwt.verify(token, process.env.SECRET_JWT);

        // Busca o usuário no banco de dados
        const user = await userRepositories.findByIdRepository(decoded.id);
        if (!user) {
            return res.status(401).json({ message: "Usuário não encontrado!" });
        }

        // Padroniza o objeto user na requisição
        req.user = {
            id: user.id,
            role: user.role.toLowerCase().trim(),
            // Adicione outros campos relevantes aqui
        };

        return next();
    } catch (error) {
        console.error("Erro na autenticação:", error);

        // Mensagens de erro mais específicas
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ message: "Token expirado!" });
        }
        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({ message: "Token inválido!" });
        }

        return res.status(500).json({ message: "Erro na autenticação" });
    }
}

export default authMiddleware;