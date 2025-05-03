require('dotenv').config();
import cors from "cors";
import express from "express";
import { router } from "./router";
import { errorHandlerMiddleware } from "./middlewares/error-handler";
import cron from 'node-cron';
import { cleanupUnverifiedUsers } from './jobs/cleanupJobs';

const app = express()

app.use(cors())
app.use(express.json())
app.use("/api", router)
app.use(errorHandlerMiddleware)

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server started successfuly at port ${PORT}`)

    console.log('Configurando tarefa agendada para limpeza diária de usuários não verificados...');

    const CRON_SCHEDULE_CLEANUP = '0 0 * * *';
    cron.schedule(CRON_SCHEDULE_CLEANUP, () => {
        console.log(`Executando tarefa agendada de limpeza (${CRON_SCHEDULE_CLEANUP})...`);
        cleanupUnverifiedUsers().catch(error => {
            console.error('Erro na execução da tarefa agendada de limpeza:', error);
        });
    }, {
        scheduled: true,
        timezone: 'America/Sao_Paulo'
    });
    console.log(`Tarefa de limpeza agendada com sucesso para "${CRON_SCHEDULE_CLEANUP}"${process.env.NODE_ENV !== 'production' ? ' (Lembre-se de ajustar para produção!)' : ''}.`);
});
