import dotenv from 'dotenv';
import sequelize from './config/database';
import { runSeedsIfEmpty } from './seeders/index';

async function main() {
  try {
    dotenv.config();
    await sequelize.sync();
    console.log('[seed-cli] Database synced');
    await runSeedsIfEmpty();
    console.log('[seed-cli] Done');
    process.exit(0);
  } catch (e) {
    console.error('[seed-cli] Error', e);
    process.exit(1);
  }
}

main();

