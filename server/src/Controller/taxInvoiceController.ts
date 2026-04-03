import { Request, Response } from "express";
import { db } from "../db/index.js";
import { 
    TBL_TAX_INVOICE_HDR, 
    TBL_TAX_INVOICE_DTL,
    TBL_TAX_INVOICE_FILES_UPLOAD,
    TBL_PRODUCT_MASTER,
    TBL_CUSTOMER_MASTER,
    TBL_STORE_MASTER,
    TBL_COMPANY_MASTER
} from "../db/schema/index.js";
import { eq, desc, like, sql } from "drizzle-orm";
import { sendEmail, getBaseTemplate } from "../utils/emailService.js";
import { generatePdfFromHtml } from "../utils/pdfGenerator.js";

export const getTaxInvoices = async (req: Request, res: Response): Promise<Response> => {
    try {
        const data = await db.select({
            id: TBL_TAX_INVOICE_HDR.SNO,
            taxInvoiceRefNo: TBL_TAX_INVOICE_HDR.TAX_INVOICE_REF_NO,
            invoiceDate: TBL_TAX_INVOICE_HDR.INVOICE_DATE,
            companyId: TBL_TAX_INVOICE_HDR.COMPANY_ID,
            companyName: TBL_COMPANY_MASTER.Company_Name,
            fromStoreId: TBL_TAX_INVOICE_HDR.FROM_STORE_ID,
            fromStoreName: TBL_STORE_MASTER.Store_Name,
            customerId: TBL_TAX_INVOICE_HDR.CUSTOMER_ID,
            customerName: TBL_CUSTOMER_MASTER.Customer_Name,
            invoiceType: TBL_TAX_INVOICE_HDR.INVOICE_TYPE,
            deliveryNoteRefNo: TBL_TAX_INVOICE_HDR.DELIVERY_NOTE_REF_NO,
            currencyId: TBL_TAX_INVOICE_HDR.CURRENCY_ID,
            exchangeRate: TBL_TAX_INVOICE_HDR.EXCHANGE_RATE,
            totalProductAmount: TBL_TAX_INVOICE_HDR.TOTAL_PRODUCT_AMOUNT,
            vatAmount: TBL_TAX_INVOICE_HDR.VAT_AMOUNT,
            finalSalesAmount: TBL_TAX_INVOICE_HDR.FINAL_SALES_AMOUNT,
            status: TBL_TAX_INVOICE_HDR.STATUS_ENTRY,
            remarks: TBL_TAX_INVOICE_HDR.REMARKS
        })
        .from(TBL_TAX_INVOICE_HDR)
        .leftJoin(TBL_COMPANY_MASTER, eq(TBL_TAX_INVOICE_HDR.COMPANY_ID, TBL_COMPANY_MASTER.Company_Id))
        .leftJoin(TBL_STORE_MASTER, eq(TBL_TAX_INVOICE_HDR.FROM_STORE_ID, TBL_STORE_MASTER.Store_Id))
        .leftJoin(TBL_CUSTOMER_MASTER, eq(TBL_TAX_INVOICE_HDR.CUSTOMER_ID, TBL_CUSTOMER_MASTER.Customer_Id))
        .orderBy(desc(TBL_TAX_INVOICE_HDR.CREATED_DATE));

        return res.status(200).json(data);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ msg: "Internal server error" });
    }
};

export const getTaxInvoiceById = async (req: Request, res: Response): Promise<Response> => {
    try {
        const { id } = req.params;
        const decodedId = decodeURIComponent(id as string);

        const header = await db.select({
            id: TBL_TAX_INVOICE_HDR.SNO,
            taxInvoiceRefNo: TBL_TAX_INVOICE_HDR.TAX_INVOICE_REF_NO,
            invoiceDate: TBL_TAX_INVOICE_HDR.INVOICE_DATE,
            companyId: TBL_TAX_INVOICE_HDR.COMPANY_ID,
            companyName: TBL_COMPANY_MASTER.Company_Name,
            fromStoreId: TBL_TAX_INVOICE_HDR.FROM_STORE_ID,
            fromStoreName: TBL_STORE_MASTER.Store_Name,
            customerId: TBL_TAX_INVOICE_HDR.CUSTOMER_ID,
            customerName: TBL_CUSTOMER_MASTER.Customer_Name,
            invoiceType: TBL_TAX_INVOICE_HDR.INVOICE_TYPE,
            deliveryNoteRefNo: TBL_TAX_INVOICE_HDR.DELIVERY_NOTE_REF_NO,
            currencyId: TBL_TAX_INVOICE_HDR.CURRENCY_ID,
            exchangeRate: TBL_TAX_INVOICE_HDR.EXCHANGE_RATE,
            totalProductAmount: TBL_TAX_INVOICE_HDR.TOTAL_PRODUCT_AMOUNT,
            vatAmount: TBL_TAX_INVOICE_HDR.VAT_AMOUNT,
            finalSalesAmount: TBL_TAX_INVOICE_HDR.FINAL_SALES_AMOUNT,
            status: TBL_TAX_INVOICE_HDR.STATUS_ENTRY,
            remarks: TBL_TAX_INVOICE_HDR.REMARKS
        })
        .from(TBL_TAX_INVOICE_HDR)
        .leftJoin(TBL_COMPANY_MASTER, eq(TBL_TAX_INVOICE_HDR.COMPANY_ID, TBL_COMPANY_MASTER.Company_Id))
        .leftJoin(TBL_STORE_MASTER, eq(TBL_TAX_INVOICE_HDR.FROM_STORE_ID, TBL_STORE_MASTER.Store_Id))
        .leftJoin(TBL_CUSTOMER_MASTER, eq(TBL_TAX_INVOICE_HDR.CUSTOMER_ID, TBL_CUSTOMER_MASTER.Customer_Id))
        .where(eq(TBL_TAX_INVOICE_HDR.TAX_INVOICE_REF_NO, decodedId))
        .limit(1);

        if (!header.length) return res.status(404).json({ msg: "Tax Invoice not found" });

        const items = await db.select({
            id: TBL_TAX_INVOICE_DTL.SNO,
            productId: TBL_TAX_INVOICE_DTL.PRODUCT_ID,
            productName: TBL_PRODUCT_MASTER.PRODUCT_NAME,
            deliveryQty: TBL_TAX_INVOICE_DTL.DELIVERY_QTY,
            invoiceQty: TBL_TAX_INVOICE_DTL.INVOICE_QTY,
            uom: TBL_TAX_INVOICE_DTL.UOM,
            rate: TBL_TAX_INVOICE_DTL.SALES_RATE_PER_QTY,
            amount: TBL_TAX_INVOICE_DTL.TOTAL_PRODUCT_AMOUNT,
            vatPercent: TBL_TAX_INVOICE_DTL.VAT_PERCENTAGE,
            vatAmount: TBL_TAX_INVOICE_DTL.VAT_AMOUNT,
            finalAmount: TBL_TAX_INVOICE_DTL.FINAL_SALES_AMOUNT,
            deliveryNoteDtlSno: TBL_TAX_INVOICE_DTL.DELIVERY_NOTE_DTL_SNO
        })
        .from(TBL_TAX_INVOICE_DTL)
        .leftJoin(TBL_PRODUCT_MASTER, eq(TBL_TAX_INVOICE_DTL.PRODUCT_ID, TBL_PRODUCT_MASTER.PRODUCT_ID))
        .where(eq(TBL_TAX_INVOICE_DTL.TAX_INVOICE_REF_NO, decodedId));

        const filesData = await db.select().from(TBL_TAX_INVOICE_FILES_UPLOAD).where(eq(TBL_TAX_INVOICE_FILES_UPLOAD.TAX_INVOICE_REF_NO, decodedId));
        const processedFiles = filesData.map(f => ({
            ...f,
            CONTENT_DATA: f.CONTENT_DATA ? f.CONTENT_DATA.toString('base64') : null
        }));

        return res.status(200).json({ header: header[0], items, files: processedFiles });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ msg: "Internal server error" });
    }
};

export const createTaxInvoice = async (req: Request, res: Response): Promise<Response> => {
    const transaction = await db.transaction(async (tx) => {
        try {
            const { header, items, audit } = req.body;

            let finalRefNo = header.taxInvoiceRefNo;

            // Ref No Generation
            if (!finalRefNo || finalRefNo.startsWith("TEMP-")) {
                const now = new Date();
                const yearStr = now.getFullYear().toString().slice(-2);
                const mStr = (now.getMonth() + 1).toString().padStart(2, '0');
                const searchPrefix = `INV/${yearStr}/${mStr}/%`;

                const latest = await tx.select({ ref: TBL_TAX_INVOICE_HDR.TAX_INVOICE_REF_NO })
                    .from(TBL_TAX_INVOICE_HDR)
                    .where(like(TBL_TAX_INVOICE_HDR.TAX_INVOICE_REF_NO, searchPrefix))
                    .orderBy(desc(TBL_TAX_INVOICE_HDR.TAX_INVOICE_REF_NO))
                    .limit(1);

                let nextSeq = 1;
                if (latest.length > 0 && latest[0].ref) {
                    const parts = latest[0].ref.split('/');
                    const lastNum = parseInt(parts[parts.length - 1]);
                    if (!isNaN(lastNum)) nextSeq = lastNum + 1;
                }
                finalRefNo = `INV/${yearStr}/${mStr}/${nextSeq.toString().padStart(3, '0')}`;
            }

            const hValues = {
                TAX_INVOICE_REF_NO: finalRefNo,
                INVOICE_DATE: header.invoiceDate ? new Date(header.invoiceDate) : new Date(),
                COMPANY_ID: header.companyId,
                FROM_STORE_ID: header.fromStoreId,
                INVOICE_TYPE: header.invoiceType || "Standard",
                DELIVERY_NOTE_REF_NO: header.deliveryNoteRefNo,
                CUSTOMER_ID: header.customerId,
                CURRENCY_ID: header.currencyId || 1,
                EXCHANGE_RATE: header.exchangeRate || 1,
                TOTAL_PRODUCT_AMOUNT: header.totalProductAmount,
                VAT_AMOUNT: header.vatAmount,
                FINAL_SALES_AMOUNT: header.finalSalesAmount,
                STATUS_ENTRY: header.status || "Open",
                REMARKS: header.remarks,
                CREATED_BY: audit?.user || "System",
                CREATED_MAC_ADDRESS: req.ip || "127.0.0.1",
                CREATED_DATE: new Date()
            };

            const invoiceResult = { msg: "Tax Invoice created successfully", taxInvoiceRefNo: finalRefNo };

            // Send Email to Customer
            try {
                const customer = (await tx.select().from(TBL_CUSTOMER_MASTER).where(eq(TBL_CUSTOMER_MASTER.Customer_Id, header.customerId as number)).limit(1))[0];
                
                if (customer?.Email_Address) {
                    const invoiceData = `
                        <h2>Invoice Number: <span class="highlight">${finalRefNo}</span></h2>
                        <p>Thank you for your business. Your tax invoice has been generated and is attached below.</p>
                        <div style="background-color: #f8fafc; padding: 25px; border-radius: 8px; margin: 20px 0;">
                            <table style="width: 100%; border-collapse: collapse;">
                                <tr style="background-color: #e2e8f0; font-weight: bold;">
                                    <td style="padding: 10px;">Item</td>
                                    <td style="padding: 10px; text-align: center;">Qty</td>
                                    <td style="padding: 10px; text-align: right;">Amount</td>
                                </tr>
                                ${items.map((i: any) => `
                                    <tr style="border-bottom: 1px solid #f1f5f9;">
                                        <td style="padding: 10px;">${i.productName || 'Product'}</td>
                                        <td style="padding: 10px; text-align: center;">${i.invoiceQty}</td>
                                        <td style="padding: 10px; text-align: right;">$${Number(i.finalAmount).toLocaleString()}</td>
                                    </tr>
                                `).join('')}
                            </table>
                            <div style="text-align: right; margin-top: 15px; font-size: 18px; font-weight: 800;">TOTAL PAYABLE: $${Number(header.finalSalesAmount).toLocaleString()}</div>
                        </div>
                        <p>If you have any questions, please contact our accounts department.</p>
                    `;

                    const pdfBuffer = await generatePdfFromHtml(getBaseTemplate('Tax Invoice', invoiceData));

                    await sendEmail({
                        to: customer.Email_Address,
                        subject: `TAX INVOICE: ${finalRefNo} | AgroManage ERP`,
                        html: getBaseTemplate('Invoice Issued', invoiceData),
                        attachments: [{
                            filename: `Invoice_${finalRefNo.replace(/\//g, '_')}.pdf`,
                            content: pdfBuffer,
                            contentType: 'application/pdf'
                        }]
                    });
                }
            } catch (emailErr) {
                console.error("[Invoice Email Error]", emailErr);
            }

            return invoiceResult;
        } catch (error: any) {
            console.error(error);
            tx.rollback();
            throw error;
        }
    });

    return res.status(201).json(transaction);
};

export const updateTaxInvoice = async (req: Request, res: Response): Promise<Response> => {
    const { id } = req.params;
    const decodedId = decodeURIComponent(id as string);
    const transaction = await db.transaction(async (tx) => {
        try {
            const { header, items, audit } = req.body;
            
            const hUpdates = {
                INVOICE_DATE: header.invoiceDate ? new Date(header.invoiceDate) : undefined,
                TOTAL_PRODUCT_AMOUNT: header.totalProductAmount,
                VAT_AMOUNT: header.vatAmount,
                FINAL_SALES_AMOUNT: header.finalSalesAmount,
                STATUS_ENTRY: header.status,
                REMARKS: header.remarks,
                MODIFIED_BY: audit?.user || "System",
                MODIFIED_MAC_ADDRESS: req.ip || "127.0.0.1",
                MODIFIED_DATE: new Date()
            };

            await tx.update(TBL_TAX_INVOICE_HDR).set(hUpdates as any).where(eq(TBL_TAX_INVOICE_HDR.TAX_INVOICE_REF_NO, decodedId));

            await tx.delete(TBL_TAX_INVOICE_DTL).where(eq(TBL_TAX_INVOICE_DTL.TAX_INVOICE_REF_NO, decodedId));
            if (items && items.length > 0) {
                const dValues = items.map((item: any) => ({
                    TAX_INVOICE_REF_NO: decodedId,
                    DELIVERY_NOTE_DTL_SNO: item.deliveryNoteDtlSno,
                    PRODUCT_ID: item.productId,
                    DELIVERY_QTY: item.deliveryQty,
                    INVOICE_QTY: item.invoiceQty,
                    UOM: item.uom,
                    SALES_RATE_PER_QTY: item.rate,
                    TOTAL_PRODUCT_AMOUNT: item.amount,
                    VAT_PERCENTAGE: item.vatPercent,
                    VAT_AMOUNT: item.vatAmount,
                    FINAL_SALES_AMOUNT: item.finalAmount,
                    STATUS_ENTRY: "Active",
                    CREATED_BY: audit?.user || "System",
                    CREATED_MAC_ADDRESS: req.ip || "127.0.0.1",
                    CREATED_DATE: new Date()
                }));
                await tx.insert(TBL_TAX_INVOICE_DTL).values(dValues as any);
            }

            await tx.delete(TBL_TAX_INVOICE_FILES_UPLOAD).where(eq(TBL_TAX_INVOICE_FILES_UPLOAD.TAX_INVOICE_REF_NO, decodedId));
            if (req.body.files && req.body.files.length > 0) {
                const fValues = req.body.files.map((f: any) => ({
                    TAX_INVOICE_REF_NO: decodedId,
                    DOCUMENT_TYPE: f.documentType,
                    DESCRIPTION_DETAILS: f.descriptionDetails,
                    FILE_NAME: f.fileName,
                    CONTENT_TYPE: f.contentType,
                    CONTENT_DATA: f.contentData ? Buffer.from(f.contentData, 'base64') : null,
                    REMARKS: f.remarks,
                    STATUS_MASTER: "Active",
                    CREATED_BY: audit?.user || "System",
                    CREATED_MAC_ADDRESS: req.ip || "127.0.0.1",
                    CREATED_DATE: new Date()
                }));
                await tx.insert(TBL_TAX_INVOICE_FILES_UPLOAD).values(fValues as any);
            }

            return { msg: "Tax Invoice updated successfully" };
        } catch (error) {
            console.error(error);
            tx.rollback();
            throw error;
        }
    });

    return res.status(200).json(transaction);
};

export const deleteTaxInvoice = async (req: Request, res: Response): Promise<Response> => {
    try {
        const { id } = req.params;
        const decodedId = decodeURIComponent(id as string);

        await db.transaction(async (tx) => {
            await tx.delete(TBL_TAX_INVOICE_DTL).where(eq(TBL_TAX_INVOICE_DTL.TAX_INVOICE_REF_NO, decodedId));
            await tx.delete(TBL_TAX_INVOICE_HDR).where(eq(TBL_TAX_INVOICE_HDR.TAX_INVOICE_REF_NO, decodedId));
        });

        return res.status(200).json({ msg: "Tax Invoice deleted successfully" });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ msg: "Internal server error" });
    }
};
