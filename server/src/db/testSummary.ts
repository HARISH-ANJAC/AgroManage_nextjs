import { sendEmail, getBaseTemplate } from '../utils/emailService.js';
import { db } from './index.js';
import { TBL_TAX_INVOICE_HDR } from './schema/StoEntries.js';
import { sql } from 'drizzle-orm';
import dotenv from 'dotenv';

dotenv.config({ path: '../.env' }); // Ensure variables are loaded

async function run() {
    console.log('[Test] Running Daily Sales Summary job manually...');
    try {
        const today = new Date().toISOString().split('T')[0];
        const result = await db.select({
            total: sql<number>`sum(${TBL_TAX_INVOICE_HDR.FINAL_SALES_AMOUNT})`,
            count: sql<number>`count(*)`
        }).from(TBL_TAX_INVOICE_HDR)
            .where(sql`date(${TBL_TAX_INVOICE_HDR.CREATED_DATE}) = ${today}`);

        const total = Number(result[0]?.total || 0).toLocaleString();
        const count = result[0]?.count || 0;

        console.log(`[Test] Total: ${total}, Count: ${count}`);

        const content = `
            <div style="padding: 20px; background-color: #f8fafc; border-radius: 12px; margin: 20px 0; border: 1px solid #e2e8f0;">
                <h3 style="margin-top: 0; color: #1e293b;">Daily Sales Overview - <span class="highlight">${today}</span></h3>
                <div style="font-size: 24px; font-weight: 800; color: #0f172a; margin-bottom: 5px;">$ ${total}</div>
                <p style="margin: 0; font-size: 14px; opacity: 0.6;">Total Transactions: <strong>${count}</strong></p>
            </div>
            <p>This automated report provides a summary of today's sales activity across the enterprise.</p>
            <a href="${process.env.CORS_ORIGIN || 'http://localhost:3000'}/dashboard/sales" class="button">View Dashboard</a>
        `;

        const targetEmail = process.env.ADMIN_EMAIL || '23pca121@anjaconline.org';
        console.log(`[Test] Sending email to: ${targetEmail}`);

        const baseHtml = getBaseTemplate('Daily Report', content);

        await sendEmail({
            to: targetEmail,
            subject: `Daily Sales Summary - ${today} (TEST)`,
            html: baseHtml
        });

        console.log('[Test] Daily Sales Summary sent successfully.');
    } catch (error) {
        console.error('[Test Error] Daily Sales Summary:', error);
    }
    process.exit(0);
}

run();
