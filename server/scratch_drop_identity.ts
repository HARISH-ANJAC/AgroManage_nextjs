import pg from 'pg';
import 'dotenv/config';

async function dropIdentity() {
  const client = new pg.Client({ connectionString: process.env.DATABASE_URL });
  await client.connect();
  console.log('Connected to database.');

  try {
    console.log('Dropping IDENTITY from TBL_ADDITIONAL_COST_TYPE_MASTER.ADDITIONAL_COST_TYPE_ID...');
    await client.query('ALTER TABLE stomaster."TBL_ADDITIONAL_COST_TYPE_MASTER" ALTER COLUMN "ADDITIONAL_COST_TYPE_ID" DROP IDENTITY IF EXISTS');
    console.log('✅ Identity successfully dropped.');
  } catch (err) {
    console.error('Error dropping identity:', err);
  } finally {
    await client.end();
  }
}

dropIdentity().catch(console.error);
