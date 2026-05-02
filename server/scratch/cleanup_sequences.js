import pkg from 'pg';
const { Client } = pkg;
import dotenv from 'dotenv';
dotenv.config();

async function cleanupSequences() {
    const client = new Client({
        connectionString: process.env.DATABASE_URL,
    });
    await client.connect();
    try {
        const res = await client.query(`
            SELECT relname, n.nspname as schema
            FROM pg_class c
            JOIN pg_namespace n ON n.oid = c.relnamespace
            WHERE relkind = 'S' 
            AND relname != '__drizzle_migrations_id_seq';
        `);
        
        console.log(`Found ${res.rows.length} sequences to drop.`);
        
        for (const row of res.rows) {
            const dropQuery = `DROP SEQUENCE IF EXISTS "${row.schema}"."${row.relname}" CASCADE;`;
            console.log(`Executing: ${dropQuery}`);
            await client.query(dropQuery);
        }
        
        console.log("Cleanup complete.");
    } catch (err) {
        console.error("Error during cleanup:", err);
    } finally {
        await client.end();
    }
}

cleanupSequences();
