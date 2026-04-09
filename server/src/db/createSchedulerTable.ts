import { db } from "./index.js";
import { sql } from "drizzle-orm";

async function createTable() {
    console.log('[Setup] Creating TBL_SCHEDULER_SETTINGS table...');
    try {
        await db.execute(sql`
            CREATE TABLE IF NOT EXISTS stomaster."TBL_SCHEDULER_SETTINGS" (
                "SNO" SERIAL PRIMARY KEY,
                "JOB_NAME" VARCHAR(100) UNIQUE,
                "CRON_EXPRESSION" VARCHAR(50),
                "IS_ENABLED" VARCHAR(20) DEFAULT 'True',
                "LAST_RUN" TIMESTAMP,
                "REMARKS" VARCHAR(1000),
                "MODIFIED_BY" VARCHAR(50),
                "MODIFIED_DATE" TIMESTAMP
            );
        `);
        console.log('[Setup] Table created successfully.');
    } catch (error) {
        console.error('[Setup Error]', error);
    }
    process.exit(0);
}

createTable();
