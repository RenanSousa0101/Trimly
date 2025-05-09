import { prisma } from "../database";

export async function cleanupUnverifiedUsers() {
  console.log('Starting cleanup task for unverified users and expired tokens...');

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

    console.log(`  - Deleting unverified users created before: ${cutoffDate.toISOString()}`);
    console.log(`  - Retention period: ${UNVERIFIED_USER_RETENTION_DAYS} dias, ${UNVERIFIED_USER_RETENTION_HOURS} horas, ${UNVERIFIED_USER_RETENTION_MINUTES} minutos.`);

    const expiredTokensDeleted = await prisma.verificationToken.deleteMany({
      where: {
        expiresAt: {
          lt: new Date() 
        }
      }
    });
    console.log(`  - Deleted ${expiredTokensDeleted.count} expired tokens.`);

    const oldUnverifiedUsersDeleted = await prisma.user.deleteMany({
      where: {
        isEmailVerified: false, 
        created_at: {
          lt: cutoffDate 
        }
      }
    });
    console.log(`  - Deleted ${oldUnverifiedUsersDeleted.count} old unverified users.`);
    console.log('Cleaning task completed.');

  } catch (error) {
    console.error('Error during cleanup task: ', error);
  }
}

