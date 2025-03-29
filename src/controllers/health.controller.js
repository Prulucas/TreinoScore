const healthCheck = (req, res) => {
    const healthcheck = {
        status: 'healthy',
        timestamp: new Date(),
        uptime: process.uptime(),
        database: 'connected' // Você pode adicionar verificação real do banco
    };
    res.status(200).json(healthcheck);
};

export default { healthCheck };