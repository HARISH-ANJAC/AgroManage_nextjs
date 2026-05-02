import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

async function run() {
    const client = new pg.Client({
        connectionString: process.env.DATABASE_URL,
    });

    await client.connect();
    
    const res = await client.query(`
        SELECT table_schema, table_name 
        FROM information_schema.tables 
        WHERE table_schema IN ('stomaster', 'stoentries')
        ORDER BY table_schema, table_name;
    `);
    
    console.log(JSON.stringify(res.rows, null, 2));
    await client.end();
}

run();
