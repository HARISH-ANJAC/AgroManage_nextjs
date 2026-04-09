import { db } from "./index.js";
import { TBL_SCHEDULER_SETTINGS } from "./schema/index.js";
import { eq } from "drizzle-orm";

async function seed() {
    console.log('[Seed] Seeding scheduler settings...');
    try {
        const existing = await db.select().from(TBL_SCHEDULER_SETTINGS).where(eq(TBL_SCHEDULER_SETTINGS.JOB_NAME, 'Daily Sales Summary'));
        
        if (existing.length === 0) {
            await db.insert(TBL_SCHEDULER_SETTINGS).values({
                JOB_NAME: 'Daily Sales Summary',
                CRON_EXPRESSION: '0 17 * * *',
                IS_ENABLED: 'True',
                REMARKS: 'Sends a total sales summary email to administrate every day at 5:00 PM.',
                MODIFIED_BY: 'System',
                MODIFIED_DATE: new Date()
            });
            console.log('[Seed] Daily Sales Summary job seeded.');
        } else {
            console.log('[Seed] Daily Sales Summary job already exists.');
        }
    } catch (error) {
        console.error('[Seed Error]', error);
    }
    process.exit(0);
}

seed();
