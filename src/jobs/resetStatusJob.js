/**
 * ================================================================
 * Arquivo: resetStatusJob.js
 * Autor: Pedro Lucas
 * Ano: 2025
 * GitHub: https://github.com/Prulucas
 * ================================================================
 *
 * Descrição:
 * Este arquivo configura e agenda uma tarefa automatizada utilizando o 
 * pacote `node-cron` para resetar o status dos treinos na tabela `Workout`.
 * A tarefa é executada toda segunda-feira à meia-noite (00:00), e altera 
 * o status de todos os treinos para "pending".
 *
 * A tarefa é útil para redefinir o status dos treinos de maneira periódica,
 * sem a necessidade de intervenção manual.
 */

// Importa o pacote cron para agendamento de tarefas
import cron from 'node-cron';
// Importa o modelo Workout para interação com a tabela de treinos
import Workout from '../models/Workout.js'; // Ajuste se seu arquivo for diferente

// Agendamento da tarefa para toda segunda-feira às 00:00
cron.schedule('0 0 * * 1', async () => {
    try {
        // Atualiza o status dos treinos para 'pending'
        await Workout.update({ status: 'pending' }, { where: {} });
        console.log('Status dos treinos resetado com sucesso!');
    } catch (error) {
        // Em caso de erro, exibe mensagem no console
        console.error('Erro ao resetar status dos treinos:', error);
    }
});
