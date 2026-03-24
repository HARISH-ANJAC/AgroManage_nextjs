import pg from 'pg';
import 'dotenv/config';

async function createDatabase() {
  const connectionString = process.env.DATABASE_URL!;
  const databaseName = 'agrobusiness';
  
  // Extract base connection string (to 'postgres' database)
  // Example: postgresql://postgres:root@localhost:5432/postgres
  const baseUrl = connectionString.substring(0, connectionString.lastIndexOf('/') + 1) + 'postgres';
  
  const client = new pg.Client({ connectionString: baseUrl });
  
  try {
    await client.connect();
    
    // Check if database exists
    const checkRes = await client.query(`SELECT 1 FROM pg_database WHERE datname='${databaseName}'`);
    
    if (checkRes.rowCount === 0) {
      console.log(`Creating database ${databaseName}...`);
      await client.query(`CREATE DATABASE ${databaseName}`);
      console.log(`Database ${databaseName} created successfully!`);
    } else {
      console.log(`Database ${databaseName} already exists.`);
    }
    
    process.exit(0);
  } catch (err) {
    console.error('Error creating database:', err);
    process.exit(1);
  } finally {
    await client.end();
  }
}

createDatabase();
