import { Request, Response } from "express";
import { db } from "../db/index.js";
import {
    TBL_TAX_INVOICE_HDR,
    TBL_TAX_INVOICE_DTL,
    TBL_TAX_INVOICE_FILES_UPLOAD,
    TBL_PRODUCT_MASTER,
    TBL_CUSTOMER_MASTER,
    TBL_STORE_MASTER,
    TBL_COMPANY_MASTER,
    TBL_CUSTOMER_RECEIPT_INVOICE_DTL,
    TBL_JOURNAL_HDR,
    TBL_JOURNAL_DTL,
    TBL_PROFIT_CENTER_ALLOCATION,
    TBL_PROFIT_CENTER_TARGET,
    TBL_PROFIT_CENTER_MASTER
} from "../db/schema/index.js";
import * as multiCurrencyController from "./multiCurrencyController.js";
import { eq, desc, like, sql, inArray, and, lte, gte } from "drizzle-orm";
import { createJournalEntry, getSystemLedger, getLedgerForCustomer } from "../utils/accountingUtils.js";
import { sendEmail, getBaseTemplate } from "../utils/emailService.js";
import { generatePdfFromHtml } from "../utils/pdfGenerator.js";
import { LandscapeInvoice } from "../utils/invoiceTemplates/LandscapeInvoiceTemplate.js";
import { TBL_COMPANY_BANK_ACCOUNT_MASTER, TBL_BANK_MASTER } from "../db/schema/StoMaster.js";

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
            if (!finalRefNo || finalRefNo.startsWith("TEMP-") || finalRefNo === "NEW") {
                const now = header.invoiceDate ? new Date(header.invoiceDate) : new Date();
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
                COMPANY_ID: Number(header.companyId),
                FROM_STORE_ID: Number(header.fromStoreId),
                INVOICE_TYPE: header.invoiceType || "Standard",
                DELIVERY_NOTE_REF_NO: header.deliveryNoteRefNo,
                CUSTOMER_ID: Number(header.customerId),
                CURRENCY_ID: Number(header.currencyId) || 1,
                EXCHANGE_RATE: Number(header.exchangeRate) || 1,
                TOTAL_PRODUCT_AMOUNT: String(header.totalProductAmount || 0),
                VAT_AMOUNT: String(header.vatAmount || 0),
                FINAL_SALES_AMOUNT: String(header.finalSalesAmount || 0),
                TOTAL_PRODUCT_AMOUNT_LC: String(Number(header.totalProductAmount || 0) * (Number(header.exchangeRate) || 1)),
                FINAL_SALES_AMOUNT_LC: String(Number(header.finalSalesAmount || 0) * (Number(header.exchangeRate) || 1)),
                STATUS_ENTRY: header.status || "Open",
                REMARKS: header.remarks,
                PROFIT_CENTER_ID: header.profitCenterId || null,
                CREATED_BY: audit?.user || "System",
                CREATED_MAC_ADDRESS: req.ip || "127.0.0.1",
                CREATED_DATE: new Date()
            };

            await tx.insert(TBL_TAX_INVOICE_HDR).values(hValues as any);

            // Step 3: Record in Multi-Currency Transaction Table
            if (header.currencyId && header.currencyId !== 1) { // Assuming 1 is Base
                await multiCurrencyController.recordMCTransaction({
                    companyId: header.companyId,
                    docType: 'TAX_INVOICE',
                    docNumber: finalRefNo,
                    docDate: hValues.INVOICE_DATE,
                    currencyId: header.currencyId,
                    amount: header.finalSalesAmount || 0,
                    exchangeRate: header.exchangeRate || 1,
                    baseAmount: (header.finalSalesAmount || 0) * (header.exchangeRate || 1),
                    createdBy: audit?.user || "System"
                });
            }

            if (items && items.length > 0) {
                const dValues = items.map((item: any) => ({
                    TAX_INVOICE_REF_NO: finalRefNo,
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

            if (req.body.files && req.body.files.length > 0) {
                const fValues = req.body.files.map((f: any) => ({
                    TAX_INVOICE_REF_NO: finalRefNo,
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

            // 5. Generate Accounting Journal Entry
            const salesLedgerId = await getSystemLedger(tx, hValues.COMPANY_ID, "Sales Account", "Revenue");
            const customerLedgerId = await getLedgerForCustomer(tx, hValues.CUSTOMER_ID, hValues.COMPANY_ID);
            const vatOutputLedgerId = await getSystemLedger(tx, hValues.COMPANY_ID, "VAT Output Account", "Liability");

            const journalDetails = [
                {
                    ledgerId: salesLedgerId,
                    debit: 0,
                    credit: Number(hValues.TOTAL_PRODUCT_AMOUNT),
                    remarks: `Sales - ${finalRefNo}`
                },
                {
                    ledgerId: customerLedgerId,
                    debit: Number(hValues.FINAL_SALES_AMOUNT),
                    credit: 0,
                    remarks: `Invoice - ${finalRefNo}`
                }
            ];

            if (Number(hValues.VAT_AMOUNT) > 0) {
                journalDetails.push({
                    ledgerId: vatOutputLedgerId,
                    debit: 0,
                    credit: Number(hValues.VAT_AMOUNT),
                    remarks: `VAT Output - ${finalRefNo}`
                });
            }

            await createJournalEntry(tx, {
                journalDate: hValues.INVOICE_DATE,
                companyId: hValues.COMPANY_ID!,
                moduleName: "TAX_INVOICE",
                moduleRefNo: finalRefNo,
                narration: `Sales Invoice ${finalRefNo} to Customer ID: ${header.customerId}`,
                createdBy: audit?.user || "System",
                ipAddress: req.ip
            }, journalDetails);

            // 6. Profit Center Allocation
            if (header.profitCenterId) {
                await tx.insert(TBL_PROFIT_CENTER_ALLOCATION).values({
                    Company_ID: header.companyId,
                    PROFIT_CENTER_ID: header.profitCenterId,
                    SOURCE_TABLE: 'TBL_TAX_INVOICE_HDR',
                    SOURCE_REF_NO: finalRefNo,
                    REVENUE_DATE: hValues.INVOICE_DATE,
                    REVENUE_CATEGORY: header.revenueCategory || 'SALES',
                    CURRENCY_ID: header.currencyId || 1,
                    REVENUE_AMOUNT: String(header.finalSalesAmount),
                    LC_AMOUNT: String(Number(header.finalSalesAmount) * (header.exchangeRate || 1)),
                    ALLOCATION_PERCENTAGE: '100',
                    ALLOCATED_AMOUNT: String(Number(header.finalSalesAmount) * (header.exchangeRate || 1)),
                    STATUS_ENTRY: 'Active',
                    CREATED_BY: audit?.user || "System",
                    CREATED_DATE: new Date(),
                });

                // Update Revenue Targets
                await tx.update(TBL_PROFIT_CENTER_TARGET)
                    .set({
                        ACTUAL_REVENUE: sql`CAST(${TBL_PROFIT_CENTER_TARGET.ACTUAL_REVENUE} AS NUMERIC) + ${Number(header.finalSalesAmount) * (header.exchangeRate || 1)}`
                    })
                    .where(and(
                        eq(TBL_PROFIT_CENTER_TARGET.PROFIT_CENTER_ID, header.profitCenterId),
                        lte(TBL_PROFIT_CENTER_TARGET.PERIOD_START_DATE, hValues.INVOICE_DATE.toISOString().split('T')[0]),
                        gte(TBL_PROFIT_CENTER_TARGET.PERIOD_END_DATE, hValues.INVOICE_DATE.toISOString().split('T')[0])
                    ));
            }

            const invoiceResult = { msg: "Tax Invoice created successfully", taxInvoiceRefNo: finalRefNo };

            // Send Email to Customer
            try {
                const customerId = hValues.CUSTOMER_ID;
                const companyId = hValues.COMPANY_ID;
                const customer = (await tx.select().from(TBL_CUSTOMER_MASTER).where(eq(TBL_CUSTOMER_MASTER.Customer_Id, customerId)).limit(1))[0];
                const company = (await tx.select().from(TBL_COMPANY_MASTER).where(eq(TBL_COMPANY_MASTER.Company_Id, companyId)).limit(1))[0];
                const bankAccounts = await tx.select({
                    label: TBL_BANK_MASTER.BANK_NAME,
                    details: sql`CONCAT(${TBL_COMPANY_BANK_ACCOUNT_MASTER.Account_Number}, ', ', ${TBL_COMPANY_BANK_ACCOUNT_MASTER.Bank_Branch_Name})`,
                    swift: TBL_COMPANY_BANK_ACCOUNT_MASTER.Swift_Code
                })
                    .from(TBL_COMPANY_BANK_ACCOUNT_MASTER)
                    .leftJoin(TBL_BANK_MASTER, eq(TBL_COMPANY_BANK_ACCOUNT_MASTER.Bank_Id, TBL_BANK_MASTER.BANK_ID))
                    .where(eq(TBL_COMPANY_BANK_ACCOUNT_MASTER.Company_id, companyId));

                // Fetch Product Images for Invoice
                const productIds = (items || []).map((i: any) => i.productId).filter((id: any) => id != null);
                const fetchedProducts = productIds.length > 0 
                    ? await tx.select({
                        id: TBL_PRODUCT_MASTER.PRODUCT_ID,
                        image: TBL_PRODUCT_MASTER.CONTENT_DATA,
                        mimeType: TBL_PRODUCT_MASTER.CONTENT_TYPE
                    })
                    .from(TBL_PRODUCT_MASTER)
                    .where(inArray(TBL_PRODUCT_MASTER.PRODUCT_ID, productIds))
                    : [];
                
                const imageMap = new Map();
                fetchedProducts.forEach(p => {
                    if (p.image) {
                        const base64 = p.image.toString('base64');
                        imageMap.set(p.id, `data:${p.mimeType || 'image/png'};base64,${base64}`);
                    }
                });

                if (customer?.Email_Address) {
                    const invoiceHtml = LandscapeInvoice({
                        email: company?.Email || 'accounts@azpfl.com',
                        vatRegNo: company?.TIN_Number || '',
                        taxNo: company?.TIN_Number || '',
                        referenceNo: finalRefNo,
                        issuedByName: audit?.user || "System",
                        items: items.map((i: any) => ({
                            description: i.productName || 'Product',
                            refNo: i.productId?.toString() || '',
                            quantity: Number(i.invoiceQty),
                            uom: i.uom || 'PCS',
                            unitPrice: Number(i.rate),
                            discountPercent: 0,
                            imageUrl: imageMap.get(i.productId)
                        })),
                        vatPercent: items[0]?.vatPercent || 18,

                        bankDetails: {
                            name: company?.Company_Name || 'Company Name',
                            accounts: bankAccounts.map(acc => ({
                                label: acc.label || 'Bank',
                                details: acc.details?.toString() || '',
                                swift: acc.swift || undefined
                            })) as any
                        }
                    });

                    const pdfBuffer = await generatePdfFromHtml(invoiceHtml);

                    sendEmail({
                        to: customer.Email_Address,
                        subject: `TAX INVOICE: ${finalRefNo} | ${company?.Company_Name || 'Prime Harvest'}`,
                        html: getBaseTemplate('Invoice Issued', `
                            <h2>Invoice Number: <span class="highlight">${finalRefNo}</span></h2>
                            <p>Thank you for your business. Your tax invoice has been generated and is attached below.</p>
                            <p>Total Payable: <strong>${Number(header.finalSalesAmount).toLocaleString()}</strong></p>
                        `),
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

            // Fetch old header for Profit Center rollback
            const oldHeader = await tx.select().from(TBL_TAX_INVOICE_HDR).where(eq(TBL_TAX_INVOICE_HDR.TAX_INVOICE_REF_NO, decodedId)).limit(1);
            
            if (oldHeader.length > 0 && oldHeader[0].PROFIT_CENTER_ID) {
                // 1. Revert old target actuals
                await tx.update(TBL_PROFIT_CENTER_TARGET)
                    .set({
                        ACTUAL_REVENUE: sql`CAST(${TBL_PROFIT_CENTER_TARGET.ACTUAL_REVENUE} AS NUMERIC) - ${Number(oldHeader[0].FINAL_SALES_AMOUNT) * (Number(oldHeader[0].EXCHANGE_RATE) || 1)}`
                    })
                    .where(and(
                        eq(TBL_PROFIT_CENTER_TARGET.PROFIT_CENTER_ID, oldHeader[0].PROFIT_CENTER_ID),
                        lte(TBL_PROFIT_CENTER_TARGET.PERIOD_START_DATE, oldHeader[0].INVOICE_DATE!.toISOString().split('T')[0]),
                        gte(TBL_PROFIT_CENTER_TARGET.PERIOD_END_DATE, oldHeader[0].INVOICE_DATE!.toISOString().split('T')[0])
                    ));
                
                // 2. Delete old allocation
                await tx.delete(TBL_PROFIT_CENTER_ALLOCATION)
                    .where(and(
                        eq(TBL_PROFIT_CENTER_ALLOCATION.SOURCE_REF_NO, decodedId),
                        eq(TBL_PROFIT_CENTER_ALLOCATION.SOURCE_TABLE, 'TBL_TAX_INVOICE_HDR')
                    ));
            }

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

            // Update Accounting Journal Entry
            // 1. Delete old entries
            const oldJournals = await tx.select({ journalRefNo: TBL_JOURNAL_HDR.JOURNAL_REF_NO })
                .from(TBL_JOURNAL_HDR)
                .where(and(eq(TBL_JOURNAL_HDR.MODULE_REF_NO, decodedId), eq(TBL_JOURNAL_HDR.MODULE_NAME, "TAX_INVOICE")));
            
            for (const j of oldJournals) {
                await tx.delete(TBL_JOURNAL_DTL).where(eq(TBL_JOURNAL_DTL.JOURNAL_REF_NO, j.journalRefNo));
                await tx.delete(TBL_JOURNAL_HDR).where(eq(TBL_JOURNAL_HDR.JOURNAL_REF_NO, j.journalRefNo));
            }

            // 2. Create new entry
            const salesLedgerId = await getSystemLedger(tx, header.companyId, "Sales Account", "Revenue");
            const customerLedgerId = await getLedgerForCustomer(tx, header.customerId, header.companyId);
            const vatLedgerId = await getSystemLedger(tx, header.companyId, "VAT Output Account", "Liability");

            const journalDetails = [
                {
                    ledgerId: customerLedgerId,
                    debit: Number(header.finalSalesAmount),
                    credit: 0,
                    remarks: `Invoice Update: ${decodedId}`
                },
                {
                    ledgerId: salesLedgerId,
                    debit: 0,
                    credit: Number(header.totalProductAmount),
                    remarks: `Sales Items (Updated) - ${decodedId}`
                }
            ];

            if (Number(header.vatAmount) > 0) {
                journalDetails.push({
                    ledgerId: vatLedgerId,
                    debit: 0,
                    credit: Number(header.vatAmount),
                    remarks: `VAT Output (Updated) - ${decodedId}`
                });
            }


            await createJournalEntry(tx, {
                journalDate: hUpdates.INVOICE_DATE || new Date(),
                companyId: header.companyId,
                moduleName: "TAX_INVOICE",
                moduleRefNo: decodedId,
                narration: `Tax Invoice ${decodedId} (Updated)`,
                createdBy: audit?.user || "System",
                ipAddress: req.ip
            }, journalDetails);

            // 3. Create new Profit Center Allocation
            if (header.profitCenterId) {
                const invDate = header.invoiceDate ? new Date(header.invoiceDate) : (oldHeader[0]?.INVOICE_DATE || new Date());
                await tx.insert(TBL_PROFIT_CENTER_ALLOCATION).values({
                    Company_ID: header.companyId,
                    PROFIT_CENTER_ID: header.profitCenterId,
                    SOURCE_TABLE: 'TBL_TAX_INVOICE_HDR',
                    SOURCE_REF_NO: header.taxInvoiceRefNo,
                    REVENUE_DATE: header.invoiceDate ? new Date(header.invoiceDate) : new Date(),
                    REVENUE_CATEGORY: header.revenueCategory || 'SALES',
                    CURRENCY_ID: header.currencyId || 1,
                    REVENUE_AMOUNT: String(header.finalSalesAmount),
                    LC_AMOUNT: String(Number(header.finalSalesAmount) * (header.exchangeRate || 1)),
                    ALLOCATION_PERCENTAGE: '100',
                    ALLOCATED_AMOUNT: String(Number(header.finalSalesAmount) * (header.exchangeRate || 1)),
                    STATUS_ENTRY: 'Active',
                    CREATED_BY: audit?.user || "System",
                    CREATED_DATE: new Date(),
                });

                // Update Revenue Targets
                await tx.update(TBL_PROFIT_CENTER_TARGET)
                    .set({
                        ACTUAL_REVENUE: sql`CAST(${TBL_PROFIT_CENTER_TARGET.ACTUAL_REVENUE} AS NUMERIC) + ${Number(header.finalSalesAmount) * (header.exchangeRate || 1)}`
                    })
                    .where(and(
                        eq(TBL_PROFIT_CENTER_TARGET.PROFIT_CENTER_ID, header.profitCenterId),
                        lte(TBL_PROFIT_CENTER_TARGET.PERIOD_START_DATE, invDate.toISOString().split('T')[0]),
                        gte(TBL_PROFIT_CENTER_TARGET.PERIOD_END_DATE, invDate.toISOString().split('T')[0])
                    ));
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
            // 1. Delete references in customer receipts bridge table
            await tx.delete(TBL_CUSTOMER_RECEIPT_INVOICE_DTL).where(eq(TBL_CUSTOMER_RECEIPT_INVOICE_DTL.TAX_INVOICE_REF_NO, decodedId));

            // Delete Journal Entries
            const oldJournals = await tx.select({ journalRefNo: TBL_JOURNAL_HDR.JOURNAL_REF_NO })
                .from(TBL_JOURNAL_HDR)
                .where(and(eq(TBL_JOURNAL_HDR.MODULE_REF_NO, decodedId), eq(TBL_JOURNAL_HDR.MODULE_NAME, "TAX_INVOICE")));
            
            for (const j of oldJournals) {
                await tx.delete(TBL_JOURNAL_DTL).where(eq(TBL_JOURNAL_DTL.JOURNAL_REF_NO, j.journalRefNo));
                await tx.delete(TBL_JOURNAL_HDR).where(eq(TBL_JOURNAL_HDR.JOURNAL_REF_NO, j.journalRefNo));
            }

            // 2. Delete related files
            await tx.delete(TBL_TAX_INVOICE_FILES_UPLOAD).where(eq(TBL_TAX_INVOICE_FILES_UPLOAD.TAX_INVOICE_REF_NO, decodedId));

            // 3. Delete items and header
            const oldHeader = await tx.select().from(TBL_TAX_INVOICE_HDR).where(eq(TBL_TAX_INVOICE_HDR.TAX_INVOICE_REF_NO, decodedId)).limit(1);
            
            if (oldHeader.length > 0 && oldHeader[0].PROFIT_CENTER_ID) {
                // Revert target actuals
                await tx.update(TBL_PROFIT_CENTER_TARGET)
                    .set({
                        ACTUAL_REVENUE: sql`CAST(${TBL_PROFIT_CENTER_TARGET.ACTUAL_REVENUE} AS NUMERIC) - ${Number(oldHeader[0].FINAL_SALES_AMOUNT) * (Number(oldHeader[0].EXCHANGE_RATE) || 1)}`
                    })
                    .where(and(
                        eq(TBL_PROFIT_CENTER_TARGET.PROFIT_CENTER_ID, oldHeader[0].PROFIT_CENTER_ID),
                        lte(TBL_PROFIT_CENTER_TARGET.PERIOD_START_DATE, oldHeader[0].INVOICE_DATE!.toISOString().split('T')[0]),
                        gte(TBL_PROFIT_CENTER_TARGET.PERIOD_END_DATE, oldHeader[0].INVOICE_DATE!.toISOString().split('T')[0])
                    ));
                
                // Delete allocation
                await tx.delete(TBL_PROFIT_CENTER_ALLOCATION)
                    .where(and(
                        eq(TBL_PROFIT_CENTER_ALLOCATION.SOURCE_REF_NO, decodedId),
                        eq(TBL_PROFIT_CENTER_ALLOCATION.SOURCE_TABLE, 'TBL_TAX_INVOICE_HDR')
                    ));
            }

            await tx.delete(TBL_TAX_INVOICE_DTL).where(eq(TBL_TAX_INVOICE_DTL.TAX_INVOICE_REF_NO, decodedId));
            await tx.delete(TBL_TAX_INVOICE_HDR).where(eq(TBL_TAX_INVOICE_HDR.TAX_INVOICE_REF_NO, decodedId));
        });

        return res.status(200).json({ msg: "Tax Invoice and all related data removed successfully" });
    } catch (error: any) {
        console.error("Delete Invoice Error:", error);
        const errorCode = error.code || error.cause?.code;
        if (errorCode === '23503') {
            return res.status(400).json({ 
                msg: "Cannot delete Tax Invoice because it is still referenced in other records (e.g., Payments or Receipts). Please ensure dependent records are removed first." 
            });
        }
        return res.status(500).json({ msg: "Internal server error" });
    }
};
