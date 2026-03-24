import pg from 'pg';
import 'dotenv/config';

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });

const SCHEMAS = ['stomaster', 'stoentries'];

async function dropTables() {
    const client = await pool.connect();
    try {
        console.log("🗑️  Dropping all tables...");

        // Get all tables in both schemas
        const result = await client.query(`
            SELECT table_schema, table_name
            FROM information_schema.tables
            WHERE table_schema = ANY($1::text[])
            AND table_type = 'BASE TABLE'
            ORDER BY table_schema, table_name;
        `, [SCHEMAS]);

        if (result.rows.length === 0) {
            console.log("   No tables found. Schemas may not exist yet.");
        } else {
            const tableList = result.rows
                .map(r => `"${r.table_schema}"."${r.table_name}"`)
                .join(', ');

            await client.query(`DROP TABLE IF EXISTS ${tableList} CASCADE;`);
            console.log(`✅ Dropped ${result.rows.length} tables successfully.`);
        }

        // Drop schemas if they exist
        for (const schema of SCHEMAS) {
            await client.query(`DROP SCHEMA IF EXISTS "${schema}" CASCADE;`);
            console.log(`   Dropped schema: ${schema}`);
        }

        console.log("✅ Drop completed.");
    } finally {
        client.release();
        await pool.end();
    }
}

dropTables().catch(err => {
    console.error("❌ Drop failed:", err.message);
    process.exit(1);
});
