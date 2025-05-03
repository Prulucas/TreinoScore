/**
 * ================================================================
 * Arquivo: health.controller.js
 * Autor: Pedro Lucas
 * Ano: 2025
 * GitHub: https://github.com/Prulucas
 * ================================================================
 *
 * Descrição:
 * Este arquivo contém a função de verificação de saúde (health check) do sistema.
 * A função `healthCheck` é responsável por retornar informações sobre o status
 * do sistema, incluindo o status da aplicação, tempo de atividade (uptime),
 * e o status de conexão com o banco de dados.
 */

const healthCheck = (req, res) => {
    // Criação de um objeto contendo o status de saúde do sistema
    const healthcheck = {
        status: 'healthy', // Indica que o sistema está saudável
        timestamp: new Date(), // Data e hora atual
        uptime: process.uptime(), // Tempo de atividade da aplicação em segundos
        database: 'connected' // Indica que o banco de dados está conectado. 
        // (Nota: Aqui você pode adicionar uma verificação real da conexão com o banco de dados)
    };

    // Responde com o status HTTP 200 e o objeto de saúde em formato JSON
    res.status(200).json(healthcheck);
};

export default { healthCheck };
