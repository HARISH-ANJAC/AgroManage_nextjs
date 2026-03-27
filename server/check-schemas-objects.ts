import { db } from './src/db/index.js';
import { sql } from 'drizzle-orm';

async function checkSchemas() {
    try {
        const res = await db.execute(sql`
            SELECT nspname, count(relname) 
            FROM pg_namespace 
            LEFT JOIN pg_class ON pg_namespace.oid = pg_class.relnamespace 
            WHERE nspname IN ('Stomaster','StoEntries','stomaster','stoentries')
            GROUP BY nspname
        `);
        console.table(res.rows);
    } catch (err) {
        console.error(err);
    } finally {
        process.exit();
    }
}

checkSchemas();
