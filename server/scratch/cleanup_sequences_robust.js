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
        // Find all columns that have a nextval default
        const res = await client.query(`
            SELECT 
                n.nspname AS schema,
                t.relname AS table,
                a.attname AS column,
                pg_get_expr(d.adbin, d.adrelid) AS default_value
            FROM pg_attrdef d
            JOIN pg_attribute a ON a.attrelid = d.adrelid AND a.attnum = d.adnum
            JOIN pg_class t ON t.oid = a.attrelid
            JOIN pg_namespace n ON n.oid = t.relnamespace
            WHERE pg_get_expr(d.adbin, d.adrelid) LIKE 'nextval(%%'
            AND n.nspname NOT IN ('pg_catalog', 'information_schema');
        `);
        
        console.log(`Found ${res.rows.length} columns with nextval defaults.`);
        
        for (const row of res.rows) {
            const dropDefault = `ALTER TABLE "${row.schema}"."${row.table}" ALTER COLUMN "${row.column}" DROP DEFAULT;`;
            console.log(`Executing: ${dropDefault}`);
            await client.query(dropDefault);
        }

        // Now find all sequences (except migration one) and drop them
        const seqRes = await client.query(`
            SELECT relname, n.nspname as schema
            FROM pg_class c
            JOIN pg_namespace n ON n.oid = c.relnamespace
            WHERE relkind = 'S' 
            AND relname != '__drizzle_migrations_id_seq';
        `);

        console.log(`Found ${seqRes.rows.length} sequences to drop.`);
        for (const row of seqRes.rows) {
            const dropSeq = `DROP SEQUENCE IF EXISTS "${row.schema}"."${row.relname}" CASCADE;`;
            console.log(`Executing: ${dropSeq}`);
            await client.query(dropSeq).catch(err => console.log(`Failed to drop sequence ${row.relname}: ${err.message}`));
        }
        
        console.log("Cleanup complete.");
    } catch (err) {
        console.error("Error during cleanup:", err);
    } finally {
        await client.end();
    }
}

cleanupSequences();
