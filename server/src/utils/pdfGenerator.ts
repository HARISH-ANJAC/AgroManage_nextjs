import puppeteer from 'puppeteer';
import { PremiumInvoice, PremiumInvoiceParams } from './invoiceTemplates/premiumInvoiceTemplate.js';

export const generatePdfFromHtml = async (html: string) => {
    const browser = await puppeteer.launch({
        args: ['--no-sandbox', '--disable-setuid-sandbox'],
        headless: true
    });
    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: 'networkidle0' });
    const pdf = await page.pdf({
        format: 'A4',
        printBackground: true,
        margin: { top: '20px', right: '20px', bottom: '20px', left: '20px' }
    });
    await browser.close();
    return pdf;
};

/**
 * Generates a PDF buffer using the Premium Invoice template
 */
export const generateInvoicePdf = async (params: PremiumInvoiceParams) => {
    const html = PremiumInvoice(params);
    return await generatePdfFromHtml(html);
};

