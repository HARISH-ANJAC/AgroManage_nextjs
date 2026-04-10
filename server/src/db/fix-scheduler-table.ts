
import { db } from "./index.js";
import { sql } from "drizzle-orm";

async function createTable() {
    console.log("Creating TBL_SCHEDULER_SETTINGS...");
    try {
        await db.execute(sql`
            CREATE TABLE IF NOT EXISTS "stomaster"."TBL_SCHEDULER_SETTINGS" (
                "SNO" serial PRIMARY KEY NOT NULL,
                "JOB_NAME" varchar(100),
                "CRON_EXPRESSION" varchar(50),
                "IS_ENABLED" varchar(20) DEFAULT 'True',
                "LAST_RUN" timestamp,
                "REMARKS" varchar(1000),
                "MODIFIED_BY" varchar(50),
                "MODIFIED_DATE" timestamp,
                CONSTRAINT "TBL_SCHEDULER_SETTINGS_JOB_NAME_unique" UNIQUE("JOB_NAME")
            );
        `);
        
        // Seed some initial jobs if needed
        await db.execute(sql`
            INSERT INTO "stomaster"."TBL_SCHEDULER_SETTINGS" 
            ("JOB_NAME", "CRON_EXPRESSION", "IS_ENABLED", "REMARKS")
            VALUES 
            ('Daily Sales Summary', '0 20 * * *', 'True', 'Sends sales report every day at 8 PM')
            ON CONFLICT ("JOB_NAME") DO NOTHING;
        `);

        console.log("Table created and seeded successfully!");
        process.exit(0);
    } catch (error) {
        console.error("Failed to create table:", error);
        process.exit(1);
    }
}

createTable();
