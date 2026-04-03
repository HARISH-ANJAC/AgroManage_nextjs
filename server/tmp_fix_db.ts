
import pg from 'pg';
import dotenv from 'dotenv';
dotenv.config();

const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
});

async function run() {
  try {
    console.log('Attempting to drop table with CASCADE to resolve sequence dependency...');
    // Drop the table with CASCADE to ensure all dependent sequences are also handled
    await pool.query('DROP TABLE IF EXISTS stomaster."CUSTOMER_CREDIT_LIMIT_FILE_UPLOAD" CASCADE;');
    console.log('Successfully dropped table stomaster."CUSTOMER_CREDIT_LIMIT_FILE_UPLOAD"');
  } catch (err) {
    console.error('Error executing SQL:', err);
  } finally {
    await pool.end();
  }
}

run();
