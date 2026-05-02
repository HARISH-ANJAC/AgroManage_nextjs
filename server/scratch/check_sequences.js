import pkg from 'pg';
const { Client } = pkg;
import dotenv from 'dotenv';
dotenv.config();

async function checkSequences() {
    const client = new Client({
        connectionString: process.env.DATABASE_URL,
    });
    await client.connect();
    try {
        const res = await client.query(`
            SELECT relname 
            FROM pg_class 
            WHERE relkind = 'S' 
            AND relname LIKE '%_seq%';
        `);
        console.log("Existing sequences:");
        res.rows.forEach(row => console.log(row.relname));
    } catch (err) {
        console.error(err);
    } finally {
        await client.end();
    }
}

checkSequences();
