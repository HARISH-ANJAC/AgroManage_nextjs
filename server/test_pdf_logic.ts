import { db } from './src/db/index.js';
import { TBL_PURCHASE_INVOICE_HDR, TBL_PURCHASE_INVOICE_DTL, TBL_PURCHASE_INVOICE_ADDITIONAL_COST_DETAILS } from './src/db/schema/index.js';
import { eq } from 'drizzle-orm';
import { generatePremiumInvoiceHTML } from './src/utils/invoiceTemplates/premiumInvoiceTemplate.js';

async function testPdf() {
    try {
        const id = 'PI/2026/03/001';
        const headers = await db.select().from(TBL_PURCHASE_INVOICE_HDR).where(eq(TBL_PURCHASE_INVOICE_HDR.PURCHASE_INVOICE_REF_NO, id));
        if (!headers.length) { console.error("No header found"); return; }
        
        const h = headers[0];
        const items = await db.select().from(TBL_PURCHASE_INVOICE_DTL).where(eq(TBL_PURCHASE_INVOICE_DTL.PURCHASE_INVOICE_REF_NO, id));
        const additionalCosts = await db.select().from(TBL_PURCHASE_INVOICE_ADDITIONAL_COST_DETAILS).where(eq(TBL_PURCHASE_INVOICE_ADDITIONAL_COST_DETAILS.PURCHASE_INVOICE_NO, id));
        
        const mappedItems = items.map(item => {
            const qty = Number(item.TOTAL_QTY || 0);
            const rate = Number(item.RATE_PER_QTY || 0);
            const amount = Number(item.PRODUCT_AMOUNT || qty * rate);
            const vatPct = Number(item.VAT_PERCENTAGE || 0);
            return {
                description: `Product #${item.PRODUCT_ID || "-"}`,
                quantity: qty,
                rate: rate,
                amount: amount,
                uom: (item.UOM as string) || "KG",
                vatPercent: vatPct,
                vatAmount: Number(item.VAT_AMOUNT || amount * (vatPct / 100))
            };
        });
        
        additionalCosts.forEach(ac => {
            mappedItems.push({
                description: `Additional Cost Type #${ac.ADDITIONAL_COST_TYPE_ID}`,
                quantity: 1,
                rate: Number(ac.ADDITIONAL_COST_AMOUNT || 0),
                amount: Number(ac.ADDITIONAL_COST_AMOUNT || 0),
                uom: "-",
                vatPercent: 0,
                vatAmount: 0
            });
        });

        const invoiceData = {
            invoiceNo: h.INVOICE_NO || id,
            date: h.INVOICE_DATE ? new Date(h.INVOICE_DATE).toISOString() : new Date().toISOString(),
            companyName: "Prime Harvest",
            companyAddress: "1st Floor, HQ Complex\\nAgro Hub City",
            clientName: `Supplier ID: ${h.SUPPLIER_ID || "N/A"}`,
            clientAddress: `PO Ref: ${h.PO_REF_NO || "N/A"}\\nStore: ${h.STORE_ID || "N/A"}`,
            items: mappedItems,
            subtotal: Number(h.PRODUCT_HDR_AMOUNT || 0) + Number(h.TOTAL_ADDITIONAL_COST_AMOUNT || 0),
            taxAmount: Number(h.TOTAL_VAT_HDR_AMOUNT || 0),
            total: Number(h.FINAL_INVOICE_HDR_AMOUNT || 0),
            currency: "TZS",
            notes: h.REMARKS || ""
        };

        const html = generatePremiumInvoiceHTML(invoiceData);
        console.log("SUCCESS HTML RENDER LENGTH:", html.length);
        
        // try puppeteer
        import('puppeteer').then(async ({ default: puppeteer }) => {
            const browser = await puppeteer.launch({ headless: true, args: ["--no-sandbox", "--disable-setuid-sandbox"] });
            const page = await browser.newPage();
            await page.setContent(html, { waitUntil: "networkidle0" });
            const pdfBuffer = await page.pdf({ format: "A4", printBackground: true, margin: { top: "10mm", bottom: "10mm", left: "10mm", right: "10mm" } });
            await browser.close();
            console.log("SUCCESS PDF RENDER LENGTH:", pdfBuffer.length);
            process.exit(0);
        }).catch(e => {
            console.error("Puppeteer crashed", e);
            process.exit(1);
        });

    } catch (e) {
        console.error("CRASH", e);
        process.exit(1);
    }
}
testPdf();
