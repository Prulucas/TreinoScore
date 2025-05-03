/**
 * ================================================================
 * Arquivo: auth.middleware.js
 * Autor: Pedro Lucas
 * Ano: 2025
 * GitHub: https://github.com/Prulucas
 * ================================================================
 *
 * Descrição:
 * Este arquivo define um middleware de autenticação para verificar a 
 * validade do token JWT em cada requisição. Ele verifica o header de 
 * autorização, valida o formato do token, e garante que o usuário 
 * esteja presente no banco de dados antes de permitir o acesso aos 
 * recursos protegidos.
 *
 * Se o token for válido e o usuário for encontrado, ele adiciona as 
 * informações do usuário na requisição para ser utilizado em outras 
 * partes do sistema. Caso contrário, retorna uma resposta com o erro 
 * apropriado.
 */

// Importa as variáveis de ambiente e o pacote jwt para verificação do token
import "dotenv/config";
import jwt from "jsonwebtoken";
// Importa o repositório de usuários para buscar informações do usuário
import userRepositories from "../repositories/user.repositories.js";

// Função middleware de autenticação
async function authMiddleware(req, res, next) {
    try {
        // Obtém o header de autorização da requisição
        const authHeader = req.headers.authorization;

        // Verificação do header de autorização
        if (!authHeader) {
            return res.status(401).json({ message: "Token não informado!" });
        }

        // Desestruturação do valor do header de autorização
        const [scheme, token] = authHeader.split(" ");

        // Validação do formato do token
        if (!scheme || !token || !/^Bearer$/i.test(scheme)) {
            return res.status(401).json({ message: "Formato de token inválido! Use: Bearer <token>" });
        }

        // Verificação do token JWT usando a chave secreta
        const decoded = jwt.verify(token, process.env.SECRET_JWT);

        // Busca o usuário no banco de dados com o ID decodificado
        const user = await userRepositories.findByIdRepository(decoded.id);
        if (!user) {
            return res.status(401).json({ message: "Usuário não encontrado!" });
        }

        // Adiciona o objeto 'user' na requisição para uso posterior
        req.user = {
            id: user.id,
            role: user.role.toLowerCase().trim(),
            // Adicione outros campos relevantes aqui
        };

        // Chama a próxima função no ciclo de requisição
        return next();
    } catch (error) {
        console.error("Erro na autenticação:", error);

        // Mensagens de erro mais específicas para tipos de erro específicos
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ message: "Token expirado!" });
        }
        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({ message: "Token inválido!" });
        }

        // Erro genérico de autenticação
        return res.status(500).json({ message: "Erro na autenticação" });
    }
}

// Exporta o middleware de autenticação
export default authMiddleware;
