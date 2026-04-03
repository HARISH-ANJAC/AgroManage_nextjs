import cron from 'node-cron';
import { sendEmail, getBaseTemplate } from './emailService.js';
import { db } from '../db/index.js';
import { TBL_PURCHASE_ORDER_HDR, TBL_TAX_INVOICE_HDR } from '../db/schema/StoEntries.js';
import { sql } from 'drizzle-orm';

/**
 * Modern Scheduling System
 */
export const initScheduler = () => {
    console.log('[Scheduler] Initializing automated email jobs...');

    // 1. Daily Sales Summary (Runs at 8:00 PM every day)
    cron.schedule('0 20 * * *', async () => {
        console.log('[Scheduler] Running Daily Sales Summary job...');
        try {
            // Fetch total sales for today
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
                to: process.env.ADMIN_EMAIL || 'admin@agromanage.com',
                subject: `Daily Sales Summary - ${today}`,
                html: getBaseTemplate('Daily Report', content)
            });

            console.log('[Scheduler] Daily Sales Summary sent successfully.');
        } catch (error) {
            console.error('[Scheduler Error] Daily Sales Summary:', error);
        }
    });

    // 2. Weekly Inventory Check (Runs every Monday at 9:00 AM)
    cron.schedule('0 9 * * 1', async () => {
        console.log('[Scheduler] Running Weekly System Health job...');
        // Logic for weekly reports can be added here
    });
};
