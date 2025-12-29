import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

async function createDatabase() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
  });

  await connection.query(`CREATE DATABASE IF NOT EXISTS \`${process.env.DB_NAME || 'auto_ecole_db'}\`;`);
  console.log(`Database ${process.env.DB_NAME || 'auto_ecole_db'} created or already exists.`);
  await connection.end();
}

createDatabase().catch((err) => {
  console.error('Error creating database:', err);
  process.exit(1);
});
