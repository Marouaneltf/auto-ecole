import sequelize from './config/database';
import { runSeedsIfEmpty } from './seeders/index';
import app from './app';

const PORT = process.env.PORT || 3000;

// Sync Database
sequelize.sync().then(async () => {
  console.log('Database synced');
  try { await runSeedsIfEmpty(); } catch (e) { console.warn('Seed error', e); }
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}).catch((err) => {
  console.error('Unable to connect to the database:', err);
});
