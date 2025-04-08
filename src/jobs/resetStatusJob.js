// src/jobs/resetStatusJob.js
import cron from 'node-cron';
import Workout from '../models/Workout.js'; // Ajuste se seu arquivo for diferente

// Agendado para toda segunda-feira às 00:00
cron.schedule('0 0 * * 1', async () => {
    try {
        await Workout.update({ status: 'pending' }, { where: {} });
        console.log('Status dos treinos resetado com sucesso!');
    } catch (error) {
        console.error('Erro ao resetar status dos treinos:', error);
    }
});
