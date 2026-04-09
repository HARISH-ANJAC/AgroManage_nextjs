import cron from 'node-cron';
import { sendEmail, getBaseTemplate } from './emailService.js';
import { db } from '../db/index.js';
import { TBL_TAX_INVOICE_HDR } from '../db/schema/StoEntries.js';
import { TBL_SCHEDULER_SETTINGS } from '../db/schema/StoMaster.js';
import { sql, eq } from 'drizzle-orm';
import dotenv from 'dotenv';
dotenv.config();

const runDailySalesSummary = async () => {
    console.log('[Scheduler] Running Daily Sales Summary job...');
    try {
        const today = new Date().toISOString().split('T')[0];
        const result = await db.select({
            total: sql<number>`sum(${TBL_TAX_INVOICE_HDR.FINAL_SALES_AMOUNT})`,
            count: sql<number>`count(*)`
        }).from(TBL_TAX_INVOICE_HDR)
            .where(sql`date(${TBL_TAX_INVOICE_HDR.CREATED_DATE}) = ${today}`);

        const total = Number(result[0]?.total || 0).toLocaleString();
        const count = result[0]?.count || 0;

        const content = `
            <div style="padding: 20px; background-color: #f8fafc; border-radius: 12px; margin: 20px 0; border: 1px solid #e2e8f0;">
                <h3 style="margin-top: 0; color: #1e293b;">Daily Sales Overview - <span class="highlight">${today}</span></h3>
                <div style="font-size: 24px; font-weight: 800; color: #0f172a; margin-bottom: 5px;">$ ${total}</div>
                <p style="margin: 0; font-size: 14px; opacity: 0.6;">Total Transactions: <strong>${count}</strong></p>
            </div>
            <p>This automated report provides a summary of today's sales activity across the enterprise.</p>
            <a href="${process.env.CORS_ORIGIN}/dashboard/sales" class="button">View Dashboard</a>
        `;

        await sendEmail({
            to: process.env.ADMIN_EMAIL || '23pca121@anjaconline.org',
            subject: `Daily Sales Summary - ${today}`,
            html: getBaseTemplate('Daily Report', content)
        });

        // Update last run
        await db.update(TBL_SCHEDULER_SETTINGS)
            .set({ LAST_RUN: new Date() })
            .where(eq(TBL_SCHEDULER_SETTINGS.JOB_NAME, 'Daily Sales Summary'));

        console.log('[Scheduler] Daily Sales Summary sent successfully.');
    } catch (error) {
        console.error('[Scheduler Error] Daily Sales Summary:', error);
    }
}

let scheduledTasks: cron.ScheduledTask[] = [];

/**
 * Modern Dynamic Scheduling System
 */
export const initScheduler = async () => {
    console.log('[Scheduler] Initializing automated email jobs from database...');
    
    // Stop all previously scheduled tasks to avoid duplicates on reload
    scheduledTasks.forEach(task => task.stop());
    scheduledTasks = [];

    try {
        const settings = await db.select().from(TBL_SCHEDULER_SETTINGS);
        
        settings.forEach(job => {
            if (job.IS_ENABLED === 'True' && job.CRON_EXPRESSION) {
                console.log(`[Scheduler] Scheduling ${job.JOB_NAME} with expression: ${job.CRON_EXPRESSION}`);
                
                const task = cron.schedule(job.CRON_EXPRESSION, async () => {
                    if (job.JOB_NAME === 'Daily Sales Summary') {
                        await runDailySalesSummary();
                    }
                });
                scheduledTasks.push(task);
            } else {
                console.log(`[Scheduler] Skipping disabled job: ${job.JOB_NAME}`);
            }
        });
    } catch (error) {
        console.error('[Scheduler Error] Failed to initialize jobs:', error);
    }
};
