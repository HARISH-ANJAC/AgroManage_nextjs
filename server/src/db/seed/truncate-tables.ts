import pg from 'pg';
import 'dotenv/config';

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });

const SCHEMAS = ['stomaster', 'stoentries'];

async function truncateTables() {
    const client = await pool.connect();
    try {
        console.log("🗑️  Truncating all tables...");

        // Get all tables in both schemas
        const result = await client.query(`
            SELECT table_schema, table_name
            FROM information_schema.tables
            WHERE table_schema = ANY($1::text[])
            AND table_type = 'BASE TABLE'
            ORDER BY table_schema, table_name;
        `, [SCHEMAS]);

        if (result.rows.length === 0) {
            console.log("   No tables found to truncate.");
            return;
        }

        // Build truncate command with CASCADE to handle FK constraints
        const tableList = result.rows
            .map(r => `"${r.table_schema}"."${r.table_name}"`)
            .join(', ');

        await client.query(`TRUNCATE TABLE ${tableList} RESTART IDENTITY CASCADE;`);
        console.log(`✅ Truncated ${result.rows.length} tables successfully.`);
    } finally {
        client.release();
        await pool.end();
    }
}

truncateTables().catch(err => {
    console.error("❌ Truncation failed:", err.message);
    process.exit(1);
});
