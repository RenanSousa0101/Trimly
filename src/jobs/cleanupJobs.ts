import { prisma } from "../database";

export async function cleanupUnverifiedUsers() {
  console.log('Iniciando tarefa de limpeza de usuários não verificados e tokens expirados...');

  try {

    const UNVERIFIED_USER_RETENTION_DAYS = 1;
    const UNVERIFIED_USER_RETENTION_HOURS = 1;
    const UNVERIFIED_USER_RETENTION_MINUTES = 0; 

    const millisecondsPerMinute = 60 * 1000; 
    const millisecondsPerHour = 60 * millisecondsPerMinute; 
    const millisecondsPerDay = 24 * millisecondsPerHour; 

    const totalRetentionMilliseconds =
      (UNVERIFIED_USER_RETENTION_DAYS * millisecondsPerDay) +
      (UNVERIFIED_USER_RETENTION_HOURS * millisecondsPerHour) +
      (UNVERIFIED_USER_RETENTION_MINUTES * millisecondsPerMinute);

    const currentTimestamp = Date.now(); 
    const cutoffTimestamp = currentTimestamp - totalRetentionMilliseconds; 
    const cutoffDate = new Date(cutoffTimestamp); 

    console.log(`  - Deletando usuários não verificados criados antes de: ${cutoffDate.toISOString()}`);
    console.log(`  - Período de retenção: ${UNVERIFIED_USER_RETENTION_DAYS} dias, ${UNVERIFIED_USER_RETENTION_HOURS} horas, ${UNVERIFIED_USER_RETENTION_MINUTES} minutos.`);

    const expiredTokensDeleted = await prisma.verificationToken.deleteMany({
      where: {
        expiresAt: {
          lt: new Date() 
        }
      }
    });
    console.log(`  - Deletados ${expiredTokensDeleted.count} tokens expirados.`);

    const oldUnverifiedUsersDeleted = await prisma.user.deleteMany({
      where: {
        isEmailVerified: false, 
        created_at: {
          lt: cutoffDate 
        }
      }
    });
    console.log(`  - Deletados ${oldUnverifiedUsersDeleted.count} usuários não verificados antigos.`);
    console.log('Tarefa de limpeza concluída.');

  } catch (error) {
    console.error('Erro durante a tarefa de limpeza:', error);
  }
}

