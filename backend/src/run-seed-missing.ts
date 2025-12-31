import dotenv from 'dotenv';
import sequelize from './config/database';
import { runSeedsMissing } from './seeders/index';

async function main() {
  try {
    dotenv.config();
    await sequelize.sync({ alter: true });
    console.log('[seed-missing] Database synced');
    await runSeedsMissing();
    console.log('[seed-missing] Completed');
    process.exit(0);
  } catch (e) {
    console.error('[seed-missing] Error', e);
    process.exit(1);
  }
}

main();
