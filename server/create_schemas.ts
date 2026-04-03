import pg from 'pg';
import 'dotenv/config';

async function createSchemas() {
  const connectionString = process.env.DATABASE_URL!;
  const client = new pg.Client({ connectionString });
  
  try {
    await client.connect();
    
    console.log("Creating schemas...");
    await client.query(`CREATE SCHEMA IF NOT EXISTS stomaster`);
    await client.query(`CREATE SCHEMA IF NOT EXISTS stoentries`);
    console.log("Schemas stomaster and stoentries created successfully!");
    
    process.exit(0);
  } catch (err) {
    console.error('Error creating schemas:', err);
    process.exit(1);
  } finally {
    await client.end();
  }
}

createSchemas();
