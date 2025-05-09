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

    console.log('Setting up scheduled task for daily cleanup of unverified users...');

    const CRON_SCHEDULE_CLEANUP = '0 0 * * *';
    cron.schedule(CRON_SCHEDULE_CLEANUP, () => {
        console.log(`Running scheduled cleanup task (${CRON_SCHEDULE_CLEANUP})...`);
        cleanupUnverifiedUsers().catch(error => {
            console.error('Error executing scheduled cleaning task:', error);
        });
    }, {
        scheduled: true,
        timezone: 'America/Sao_Paulo'
    });
    console.log(`Cleaning task successfully scheduled for "${CRON_SCHEDULE_CLEANUP}"${process.env.NODE_ENV !== 'production' ? ' (Remember to adjust for production!)' : ''}.`);
});
