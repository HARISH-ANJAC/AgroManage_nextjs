import { Request, Response } from "express";
import { db } from "../db/index.js";
import {
    TBL_CUSTOMER_RECEIPT_HDR,
    TBL_CUSTOMER_RECEIPT_INVOICE_DTL,
    TBL_CUSTOMER_RECEIPT_FILES_UPLOAD,
    TBL_JOURNAL_HDR,
    TBL_JOURNAL_DTL
} from "../db/schema/StoEntries.js";
import { 
    TBL_CUSTOMER_MASTER, 
    TBL_COMPANY_MASTER, 
    TBL_CURRENCY_MASTER, 
    TBL_CUSTOMER_PAYMENT_MODE_MASTER,
    TBL_MULTI_CURRENCY_TRANSACTIONS,
    TBL_REALIZED_GAIN_LOSS
} from "../db/schema/StoMaster.js";
import { eq, desc, sql, and } from "drizzle-orm";
import { createJournalEntry, getLedgerForCustomer, getSystemLedger } from "../utils/accountingUtils.js";

export const getCustomerReceipts = async (req: Request, res: Response) => {
    try {
        const data = await db.select({
            id: TBL_CUSTOMER_RECEIPT_HDR.SNO,
            receiptRefNo: TBL_CUSTOMER_RECEIPT_HDR.RECEIPT_REF_NO,
            receiptDate: TBL_CUSTOMER_RECEIPT_HDR.RECEIPT_DATE,
            paymentType: TBL_CUSTOMER_RECEIPT_HDR.PAYMENT_TYPE,
            companyId: TBL_CUSTOMER_RECEIPT_HDR.COMPANY_ID,
            customerId: TBL_CUSTOMER_RECEIPT_HDR.CUSTOMER_ID,
            paymentModeId: TBL_CUSTOMER_RECEIPT_HDR.PAYMENT_MODE_ID,
            receiptAmount: TBL_CUSTOMER_RECEIPT_HDR.RECEIPT_AMOUNT,
            currencyId: TBL_CUSTOMER_RECEIPT_HDR.CURRENCY_ID,
            transactionRefNo: TBL_CUSTOMER_RECEIPT_HDR.TRANSACTION_REF_NO,
            status: TBL_CUSTOMER_RECEIPT_HDR.STATUS_ENTRY,
            remarks: TBL_CUSTOMER_RECEIPT_HDR.REMARKS,
            // Joins
            customerName: TBL_CUSTOMER_MASTER.Customer_Name,
            companyName: TBL_COMPANY_MASTER.Company_Name,
            currencyName: TBL_CURRENCY_MASTER.CURRENCY_NAME,
            paymentModeName: TBL_CUSTOMER_PAYMENT_MODE_MASTER.PAYMENT_MODE_NAME
        })
        .from(TBL_CUSTOMER_RECEIPT_HDR)
        .leftJoin(TBL_CUSTOMER_MASTER, eq(TBL_CUSTOMER_RECEIPT_HDR.CUSTOMER_ID, TBL_CUSTOMER_MASTER.Customer_Id))
        .leftJoin(TBL_COMPANY_MASTER, eq(TBL_CUSTOMER_RECEIPT_HDR.COMPANY_ID, TBL_COMPANY_MASTER.Company_Id))
        .leftJoin(TBL_CURRENCY_MASTER, eq(TBL_CUSTOMER_RECEIPT_HDR.CURRENCY_ID, TBL_CURRENCY_MASTER.CURRENCY_ID))
        .leftJoin(TBL_CUSTOMER_PAYMENT_MODE_MASTER, eq(TBL_CUSTOMER_RECEIPT_HDR.PAYMENT_MODE_ID, TBL_CUSTOMER_PAYMENT_MODE_MASTER.PAYMENT_MODE_ID))
        .orderBy(desc(TBL_CUSTOMER_RECEIPT_HDR.SNO));

        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch customer receipts" });
    }
};

export const getCustomerReceiptById = async (req: Request, res: Response) => {
    try {
        const idParam = req.params.id as string;
        const id = decodeURIComponent(idParam);
        const header = await db.select({
            id: TBL_CUSTOMER_RECEIPT_HDR.SNO,
            receiptRefNo: TBL_CUSTOMER_RECEIPT_HDR.RECEIPT_REF_NO,
            receiptDate: TBL_CUSTOMER_RECEIPT_HDR.RECEIPT_DATE,
            paymentType: TBL_CUSTOMER_RECEIPT_HDR.PAYMENT_TYPE,
            companyId: TBL_CUSTOMER_RECEIPT_HDR.COMPANY_ID,
            customerId: TBL_CUSTOMER_RECEIPT_HDR.CUSTOMER_ID,
            paymentModeId: TBL_CUSTOMER_RECEIPT_HDR.PAYMENT_MODE_ID,
            crBankCashId: TBL_CUSTOMER_RECEIPT_HDR.CR_BANK_CASH_ID,
            crAccountId: TBL_CUSTOMER_RECEIPT_HDR.CR_ACCOUNT_ID,
            drBankCashId: TBL_CUSTOMER_RECEIPT_HDR.DR_BANK_CASH_ID,
            transactionRefNo: TBL_CUSTOMER_RECEIPT_HDR.TRANSACTION_REF_NO,
            transactionDate: TBL_CUSTOMER_RECEIPT_HDR.TRANSACTION_DATE,
            currencyId: TBL_CUSTOMER_RECEIPT_HDR.CURRENCY_ID,
            receiptAmount: TBL_CUSTOMER_RECEIPT_HDR.RECEIPT_AMOUNT,
            exchangeRate: TBL_CUSTOMER_RECEIPT_HDR.EXCHANGE_RATE,
            receiptAmountLc: TBL_CUSTOMER_RECEIPT_HDR.RECEIPT_AMOUNT_LC,
            status: TBL_CUSTOMER_RECEIPT_HDR.STATUS_ENTRY,
            remarks: TBL_CUSTOMER_RECEIPT_HDR.REMARKS,
            customerName: TBL_CUSTOMER_MASTER.Customer_Name,
        })
        .from(TBL_CUSTOMER_RECEIPT_HDR)
        .leftJoin(TBL_CUSTOMER_MASTER, eq(TBL_CUSTOMER_RECEIPT_HDR.CUSTOMER_ID, TBL_CUSTOMER_MASTER.Customer_Id))
        .where(eq(TBL_CUSTOMER_RECEIPT_HDR.RECEIPT_REF_NO, id))
        .limit(1);

        if (!header.length) return res.status(404).json({ error: "Receipt not found" });

        const items = await db.select({
            id: TBL_CUSTOMER_RECEIPT_INVOICE_DTL.SNO,
            receiptRefNo: TBL_CUSTOMER_RECEIPT_INVOICE_DTL.RECEIPT_REF_NO,
            taxInvoiceRefNo: TBL_CUSTOMER_RECEIPT_INVOICE_DTL.TAX_INVOICE_REF_NO,
            actualInvoiceAmount: TBL_CUSTOMER_RECEIPT_INVOICE_DTL.ACTUAL_INVOICE_AMOUNT,
            alreadyPaidAmount: TBL_CUSTOMER_RECEIPT_INVOICE_DTL.ALREADY_PAID_AMOUNT,
            outstandingInvoiceAmount: TBL_CUSTOMER_RECEIPT_INVOICE_DTL.OUTSTANDING_INVOICE_AMOUNT,
            receiptInvoiceAdjustAmount: TBL_CUSTOMER_RECEIPT_INVOICE_DTL.RECEIPT_INVOICE_ADJUST_AMOUNT,
            remarks: TBL_CUSTOMER_RECEIPT_INVOICE_DTL.REMARKS
        })
        .from(TBL_CUSTOMER_RECEIPT_INVOICE_DTL)
        .where(eq(TBL_CUSTOMER_RECEIPT_INVOICE_DTL.RECEIPT_REF_NO, id));

        const filesData = await db.select().from(TBL_CUSTOMER_RECEIPT_FILES_UPLOAD).where(eq(TBL_CUSTOMER_RECEIPT_FILES_UPLOAD.RECEIPT_REF_NO, id));
        const processedFiles = filesData.map(f => ({
            ...f,
            CONTENT_DATA: f.CONTENT_DATA ? f.CONTENT_DATA.toString('base64') : null
        }));

        res.json({ header: header[0], items, files: processedFiles });
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch receipt details" });
    }
};

export const addCustomerReceipt = async (req: Request, res: Response) => {
    const { header, items, audit } = req.body;
    try {
        await db.transaction(async (tx) => {
            // 1. Generate Receipt Ref No
            const date = new Date();
            const yearStr = date.getFullYear().toString().slice(-2);
            const monthStr = (date.getMonth() + 0).toString().padStart(2, '0'); // Fix: usually 0-indexed month plus 1 if you want calendar month, but let's stick to logic or improve
            const currentMonth = (date.getMonth() + 1).toString().padStart(2, '0');
            const prefix = `CR/${yearStr}/${currentMonth}/`;

            const lastEntry = await tx.select({ ref: TBL_CUSTOMER_RECEIPT_HDR.RECEIPT_REF_NO })
                .from(TBL_CUSTOMER_RECEIPT_HDR)
                .where(sql`${TBL_CUSTOMER_RECEIPT_HDR.RECEIPT_REF_NO} LIKE ${prefix + '%'}`)
                .orderBy(desc(TBL_CUSTOMER_RECEIPT_HDR.RECEIPT_REF_NO))
                .limit(1);

            let newNo = "001";
            if (lastEntry.length > 0 && lastEntry[0].ref) {
                const parts = lastEntry[0].ref.split('/');
                const lastSeq = parseInt(parts[parts.length - 1]);
                if (!isNaN(lastSeq)) {
                    newNo = (lastSeq + 1).toString().padStart(3, '0');
                }
            }
            const receiptRefNo = prefix + newNo;

            // 2. Insert Header
            await tx.insert(TBL_CUSTOMER_RECEIPT_HDR).values({
                RECEIPT_REF_NO: receiptRefNo,
                RECEIPT_DATE: header.receiptDate ? new Date(header.receiptDate) : new Date(),
                PAYMENT_TYPE: header.paymentType || "Regular",
                COMPANY_ID: header.companyId,
                CUSTOMER_ID: header.customerId,
                PAYMENT_MODE_ID: header.paymentModeId,
                CR_BANK_CASH_ID: header.crBankCashId,
                CR_ACCOUNT_ID: header.crAccountId,
                DR_BANK_CASH_ID: header.drBankCashId,
                TRANSACTION_REF_NO: header.transactionRefNo,
                TRANSACTION_DATE: header.transactionDate ? new Date(header.transactionDate) : null,
                CURRENCY_ID: header.currencyId || 1,
                RECEIPT_AMOUNT: String(header.receiptAmount),
                EXCHANGE_RATE: String(header.exchangeRate || 1),
                RECEIPT_AMOUNT_LC: String(Number(header.receiptAmount) * (Number(header.exchangeRate) || 1)),
                REMARKS: header.remarks,
                STATUS_ENTRY: header.status || "Closed",
                CREATED_BY: audit?.user || "System",
                CREATED_DATE: new Date(),
            } as any);

            // 3. Insert Details & Handle Realized Gain/Loss (linked invoices)
            if (items && items.length > 0) {
                for (const item of items) {
                    await tx.insert(TBL_CUSTOMER_RECEIPT_INVOICE_DTL).values({
                        RECEIPT_REF_NO: receiptRefNo,
                        TAX_INVOICE_REF_NO: item.taxInvoiceRefNo,
                        ACTUAL_INVOICE_AMOUNT: String(item.actualInvoiceAmount || 0),
                        ALREADY_PAID_AMOUNT: String(item.alreadyPaidAmount || 0),
                        OUTSTANDING_INVOICE_AMOUNT: String(item.outstandingInvoiceAmount || 0),
                        RECEIPT_INVOICE_ADJUST_AMOUNT: String(item.receiptInvoiceAdjustAmount || 0),
                        REMARKS: item.remarks,
                        STATUS_ENTRY: "Normal",
                        CREATED_BY: audit?.user || "System",
                        CREATED_DATE: new Date(),
                    });

                    // Logic for Realized Gain/Loss (Step 4)
                    const settleAmount = Number(item.receiptInvoiceAdjustAmount || 0);
                    if (settleAmount > 0) {
                        // Find original transaction
                        const origTx = await tx.select()
                            .from(TBL_MULTI_CURRENCY_TRANSACTIONS)
                            .where(and(
                                eq(TBL_MULTI_CURRENCY_TRANSACTIONS.DOCUMENT_NUMBER, item.taxInvoiceRefNo),
                                eq(TBL_MULTI_CURRENCY_TRANSACTIONS.DOCUMENT_TYPE, 'TAX_INVOICE')
                            ))
                            .limit(1);

                        if (origTx.length > 0) {
                            const txData = origTx[0];
                            const currentRate = Number(header.exchangeRate || 1);
                            const originalRate = Number(txData.EXCHANGE_RATE_USED || 1);

                            if (currentRate !== originalRate) {
                                const currentBase = settleAmount * currentRate;
                                const originalBase = settleAmount * originalRate;
                                const glDiff = currentBase - originalBase; // Positive diff on receipt (AR) is a GAIN
                                
                                await tx.insert(TBL_REALIZED_GAIN_LOSS).values({
                                    Company_ID: header.companyId,
                                    TRANSACTION_ID: txData.TRANSACTION_ID,
                                    SETTLEMENT_DATE: new Date().toISOString().split('T')[0],
                                    SETTLEMENT_AMOUNT: settleAmount.toString(),
                                    SETTLEMENT_RATE: currentRate.toString(),
                                    SETTLEMENT_BASE_AMOUNT: currentBase.toString(),
                                    ORIGINAL_BASE_AMOUNT: originalBase.toString(),
                                    REALIZED_GAIN_LOSS: Math.abs(glDiff).toString(),
                                    GL_TYPE: glDiff > 0 ? 'GAIN' : 'LOSS',
                                    CREATED_BY: audit?.user || "System",
                                    CREATED_DATE: new Date()
                                });
                            }

                            // Update settled amount in MC tracking
                            const newSettledTotal = Number(txData.SETTLED_AMOUNT || 0) + settleAmount;
                            await tx.update(TBL_MULTI_CURRENCY_TRANSACTIONS)
                                .set({ 
                                    SETTLED_AMOUNT: newSettledTotal.toString(),
                                    STATUS: newSettledTotal >= Number(txData.TRANSACTION_AMOUNT) ? 'FULLY_SETTLED' : 'PARTIAL'
                                })
                                .where(eq(TBL_MULTI_CURRENCY_TRANSACTIONS.TRANSACTION_ID, txData.TRANSACTION_ID));
                        }
                    }
                }
            }

            if (req.body.files && req.body.files.length > 0) {
                const fValues = req.body.files.map((f: any) => ({
                    RECEIPT_REF_NO: receiptRefNo,
                    DOCUMENT_TYPE: f.documentType,
                    DESCRIPTION_DETAILS: f.descriptionDetails,
                    FILE_NAME: f.fileName,
                    CONTENT_TYPE: f.contentType,
                    CONTENT_DATA: f.contentData ? Buffer.from(f.contentData, 'base64') : null,
                    REMARKS: f.remarks,
                    STATUS_MASTER: "Active",
                    CREATED_BY: audit?.user || "System",
                    CREATED_DATE: new Date(),
                    CREATED_IP_ADDRESS: req.ip || "127.0.0.1"
                }));
                await tx.insert(TBL_CUSTOMER_RECEIPT_FILES_UPLOAD).values(fValues as any);
            }

            // 4. Generate Accounting Journal Entry
            const customerLedgerId = await getLedgerForCustomer(tx, header.customerId, header.companyId);
            
            // Assume DR_BANK_CASH_ID is the ledger ID for the bank/cash account
            // If it's a Bank Master ID, we should ideally map it, but for now we use it directly or lookup
            const bankLedgerId = header.drBankCashId; 

            if (bankLedgerId && customerLedgerId) {
                const journalDetails = [
                    {
                        ledgerId: Number(bankLedgerId),
                        debit: Number(header.receiptAmount),
                        credit: 0,
                        remarks: `Receipt - ${receiptRefNo}`
                    },
                    {
                        ledgerId: customerLedgerId,
                        debit: 0,
                        credit: Number(header.receiptAmount),
                        remarks: `Customer Payment - ${receiptRefNo}`
                    }
                ];

                await createJournalEntry(tx, {
                    journalDate: header.receiptDate ? new Date(header.receiptDate) : new Date(),
                    companyId: header.companyId,
                    moduleName: "CUSTOMER_RECEIPT",
                    moduleRefNo: receiptRefNo,
                    narration: `Payment received from Customer ID: ${header.customerId}`,
                    createdBy: audit?.user || "System",
                    ipAddress: req.ip
                }, journalDetails);
            }
        });
        res.status(201).json({ message: "Customer receipt created successfully" });
    } catch (error: any) {
        console.error("Add Receipt Error:", error);
        res.status(500).json({ error: error.message || "Failed to create customer receipt" });
    }
};

export const deleteCustomerReceipt = async (req: Request, res: Response) => {
    try {
        const idParam = req.params.id as string;
        const id = decodeURIComponent(idParam);
        await db.transaction(async (tx) => {
            // Delete Journal Entries
            const oldJournals = await tx.select({ journalRefNo: TBL_JOURNAL_HDR.JOURNAL_REF_NO })
                .from(TBL_JOURNAL_HDR)
                .where(and(eq(TBL_JOURNAL_HDR.MODULE_REF_NO, id), eq(TBL_JOURNAL_HDR.MODULE_NAME, "CUSTOMER_RECEIPT")));
            
            for (const j of oldJournals) {
                await tx.delete(TBL_JOURNAL_DTL).where(eq(TBL_JOURNAL_DTL.JOURNAL_REF_NO, j.journalRefNo));
                await tx.delete(TBL_JOURNAL_HDR).where(eq(TBL_JOURNAL_HDR.JOURNAL_REF_NO, j.journalRefNo));
            }

            await tx.delete(TBL_CUSTOMER_RECEIPT_INVOICE_DTL).where(eq(TBL_CUSTOMER_RECEIPT_INVOICE_DTL.RECEIPT_REF_NO, id));
            await tx.delete(TBL_CUSTOMER_RECEIPT_FILES_UPLOAD).where(eq(TBL_CUSTOMER_RECEIPT_FILES_UPLOAD.RECEIPT_REF_NO, id));
            await tx.delete(TBL_CUSTOMER_RECEIPT_HDR).where(eq(TBL_CUSTOMER_RECEIPT_HDR.RECEIPT_REF_NO, id));
        });
        res.json({ message: "Receipt deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: "Failed to delete receipt" });
    }
};
