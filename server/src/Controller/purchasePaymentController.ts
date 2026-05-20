import { Request, Response } from "express";
import { db } from "../db/index.js";
import {
    TBL_PURCHASE_PAYMENT_HDR,
    TBL_PURCHASE_PAYMENT_INV_DTL,
    TBL_PURCHASE_PAYMENT_FILES_UPLOAD,
    TBL_JOURNAL_HDR,
    TBL_JOURNAL_DTL,
    TBL_PURCHASE_INVOICE_HDR
} from "../db/schema/StoEntries.js";
import { 
    TBL_SUPPLIER_MASTER, 
    TBL_COMPANY_MASTER, 
    TBL_CURRENCY_MASTER, 
    TBL_PAYMENT_MODE_MASTER,
    TBL_MULTI_CURRENCY_TRANSACTIONS,
    TBL_REALIZED_GAIN_LOSS
} from "../db/schema/StoMaster.js";
import { eq, desc, sql, and, like } from "drizzle-orm";
import { createJournalEntry, getLedgerForSupplier } from "../utils/accountingUtils.js";

export const getPurchasePayments = async (req: Request, res: Response) => {
    try {
        const data = await db.select({
            id: TBL_PURCHASE_PAYMENT_HDR.SNO,
            paymentRefNo: TBL_PURCHASE_PAYMENT_HDR.PAYMENT_REF_NO,
            paymentDate: TBL_PURCHASE_PAYMENT_HDR.PAYMENT_DATE,
            paymentType: TBL_PURCHASE_PAYMENT_HDR.PAYMENT_TYPE,
            companyId: TBL_PURCHASE_PAYMENT_HDR.COMPANY_ID,
            supplierId: TBL_PURCHASE_PAYMENT_HDR.SUPPLIER_ID,
            paymentModeId: TBL_PURCHASE_PAYMENT_HDR.PAYMENT_MODE_ID,
            crBankCashId: TBL_PURCHASE_PAYMENT_HDR.CR_BANK_CASH_ID,
            drBankCashId: TBL_PURCHASE_PAYMENT_HDR.DR_BANK_CASH_ID,
            drAccountId: TBL_PURCHASE_PAYMENT_HDR.DR_ACCOUNT_ID,
            paymentAmount: TBL_PURCHASE_PAYMENT_HDR.PAYMENT_AMOUNT,
            currencyId: TBL_PURCHASE_PAYMENT_HDR.CURRENCY_ID,
            exchangeRate: TBL_PURCHASE_PAYMENT_HDR.EXCHANGE_RATE,
            paymentAmountLc: TBL_PURCHASE_PAYMENT_HDR.PAYMENT_AMOUNT_LC,
            transactionRefNo: TBL_PURCHASE_PAYMENT_HDR.TRANSACTION_REF_NO,
            transactionDate: TBL_PURCHASE_PAYMENT_HDR.TRANSACTION_DATE,
            status: TBL_PURCHASE_PAYMENT_HDR.STATUS_ENTRY,
            remarks: TBL_PURCHASE_PAYMENT_HDR.REMARKS,
            // Joins
            supplierName: TBL_SUPPLIER_MASTER.Supplier_Name,
            companyName: TBL_COMPANY_MASTER.Company_Name,
            currencyName: TBL_CURRENCY_MASTER.CURRENCY_NAME,
            paymentModeName: TBL_PAYMENT_MODE_MASTER.PAYMENT_MODE_NAME
        })
        .from(TBL_PURCHASE_PAYMENT_HDR)
        .leftJoin(TBL_SUPPLIER_MASTER, eq(TBL_PURCHASE_PAYMENT_HDR.SUPPLIER_ID, TBL_SUPPLIER_MASTER.Supplier_Id))
        .leftJoin(TBL_COMPANY_MASTER, eq(TBL_PURCHASE_PAYMENT_HDR.COMPANY_ID, TBL_COMPANY_MASTER.Company_Id))
        .leftJoin(TBL_CURRENCY_MASTER, eq(TBL_PURCHASE_PAYMENT_HDR.CURRENCY_ID, TBL_CURRENCY_MASTER.CURRENCY_ID))
        .leftJoin(TBL_PAYMENT_MODE_MASTER, eq(TBL_PURCHASE_PAYMENT_HDR.PAYMENT_MODE_ID, TBL_PAYMENT_MODE_MASTER.PAYMENT_MODE_ID))
        .orderBy(desc(TBL_PURCHASE_PAYMENT_HDR.SNO));

        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch purchase payments" });
    }
};

export const getPurchasePaymentById = async (req: Request, res: Response) => {
    try {
        const idParam = req.params.id as string;
        const id = decodeURIComponent(idParam);
        const header = await db.select({
            id: TBL_PURCHASE_PAYMENT_HDR.SNO,
            paymentRefNo: TBL_PURCHASE_PAYMENT_HDR.PAYMENT_REF_NO,
            paymentDate: TBL_PURCHASE_PAYMENT_HDR.PAYMENT_DATE,
            paymentType: TBL_PURCHASE_PAYMENT_HDR.PAYMENT_TYPE,
            companyId: TBL_PURCHASE_PAYMENT_HDR.COMPANY_ID,
            supplierId: TBL_PURCHASE_PAYMENT_HDR.SUPPLIER_ID,
            paymentModeId: TBL_PURCHASE_PAYMENT_HDR.PAYMENT_MODE_ID,
            crBankCashId: TBL_PURCHASE_PAYMENT_HDR.CR_BANK_CASH_ID,
            drBankCashId: TBL_PURCHASE_PAYMENT_HDR.DR_BANK_CASH_ID,
            drAccountId: TBL_PURCHASE_PAYMENT_HDR.DR_ACCOUNT_ID,
            transactionRefNo: TBL_PURCHASE_PAYMENT_HDR.TRANSACTION_REF_NO,
            transactionDate: TBL_PURCHASE_PAYMENT_HDR.TRANSACTION_DATE,
            currencyId: TBL_PURCHASE_PAYMENT_HDR.CURRENCY_ID,
            paymentAmount: TBL_PURCHASE_PAYMENT_HDR.PAYMENT_AMOUNT,
            exchangeRate: TBL_PURCHASE_PAYMENT_HDR.EXCHANGE_RATE,
            paymentAmountLc: TBL_PURCHASE_PAYMENT_HDR.PAYMENT_AMOUNT_LC,
            status: TBL_PURCHASE_PAYMENT_HDR.STATUS_ENTRY,
            remarks: TBL_PURCHASE_PAYMENT_HDR.REMARKS,
            supplierName: TBL_SUPPLIER_MASTER.Supplier_Name,
            submittedBy: TBL_PURCHASE_PAYMENT_HDR.Submitted_By,
            submittedDate: TBL_PURCHASE_PAYMENT_HDR.Submitted_Date
        })
        .from(TBL_PURCHASE_PAYMENT_HDR)
        .leftJoin(TBL_SUPPLIER_MASTER, eq(TBL_PURCHASE_PAYMENT_HDR.SUPPLIER_ID, TBL_SUPPLIER_MASTER.Supplier_Id))
        .where(eq(TBL_PURCHASE_PAYMENT_HDR.PAYMENT_REF_NO, id))
        .limit(1);

        if (!header.length) return res.status(404).json({ error: "Payment not found" });

        const items = await db.select({
            id: TBL_PURCHASE_PAYMENT_INV_DTL.SNO,
            paymentRefNo: TBL_PURCHASE_PAYMENT_INV_DTL.PAYMENT_REF_NO,
            purchaseInvoiceRefNo: TBL_PURCHASE_PAYMENT_INV_DTL.PURCHASE_INVOICE_REF_NO,
            actualInvoiceAmount: TBL_PURCHASE_PAYMENT_INV_DTL.ACTUAL_INVOICE_AMOUNT,
            alreadyPaidAmount: TBL_PURCHASE_PAYMENT_INV_DTL.ALREADY_PAID_AMOUNT,
            outstandingInvoiceAmount: TBL_PURCHASE_PAYMENT_INV_DTL.OUTSTANDING_INVOICE_AMOUNT,
            paymentInvoiceAdjustAmount: TBL_PURCHASE_PAYMENT_INV_DTL.PAYMENT_INVOICE_ADJUST_AMOUNT,
            remarks: TBL_PURCHASE_PAYMENT_INV_DTL.REMARKS,
            status: TBL_PURCHASE_PAYMENT_INV_DTL.STATUS_ENTRY
        })
        .from(TBL_PURCHASE_PAYMENT_INV_DTL)
        .where(eq(TBL_PURCHASE_PAYMENT_INV_DTL.PAYMENT_REF_NO, id));

        const filesData = await db.select().from(TBL_PURCHASE_PAYMENT_FILES_UPLOAD).where(eq(TBL_PURCHASE_PAYMENT_FILES_UPLOAD.PAYMENT_REF_NO, id));
        const processedFiles = filesData.map(f => ({
            ...f,
            CONTENT_DATA: f.CONTENT_DATA ? f.CONTENT_DATA.toString('base64') : null
        }));

        res.json({ header: header[0], items, files: processedFiles });
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch payment details" });
    }
};

export const addPurchasePayment = async (req: Request, res: Response) => {
    const { header, items, audit } = req.body;
    try {
        await db.transaction(async (tx) => {
            // 1. Generate Payment Ref No
            const date = new Date();
            const yearStr = date.getFullYear().toString().slice(-2);
            const currentMonth = (date.getMonth() + 1).toString().padStart(2, '0');
            const prefix = `PP/${yearStr}/${currentMonth}/`;

            const lastEntry = await tx.select({ ref: TBL_PURCHASE_PAYMENT_HDR.PAYMENT_REF_NO })
                .from(TBL_PURCHASE_PAYMENT_HDR)
                .where(like(TBL_PURCHASE_PAYMENT_HDR.PAYMENT_REF_NO, prefix + '%'))
                .orderBy(desc(TBL_PURCHASE_PAYMENT_HDR.PAYMENT_REF_NO))
                .limit(1);

            let newNo = "001";
            if (lastEntry.length > 0 && lastEntry[0].ref) {
                const parts = lastEntry[0].ref.split('/');
                const lastSeq = parseInt(parts[parts.length - 1]);
                if (!isNaN(lastSeq)) {
                    newNo = (lastSeq + 1).toString().padStart(3, '0');
                }
            }
            const paymentRefNo = prefix + newNo;

            // 2. Insert Header
            await tx.insert(TBL_PURCHASE_PAYMENT_HDR).values({
                PAYMENT_REF_NO: paymentRefNo,
                PAYMENT_DATE: header.paymentDate ? new Date(header.paymentDate) : new Date(),
                PAYMENT_TYPE: header.paymentType || "Regular",
                COMPANY_ID: header.companyId,
                SUPPLIER_ID: header.supplierId,
                PAYMENT_MODE_ID: header.paymentModeId,
                CR_BANK_CASH_ID: header.crBankCashId,
                DR_BANK_CASH_ID: header.drBankCashId,
                DR_ACCOUNT_ID: header.drAccountId,
                TRANSACTION_REF_NO: header.transactionRefNo,
                TRANSACTION_DATE: header.transactionDate ? new Date(header.transactionDate) : null,
                CURRENCY_ID: header.currencyId || 1,
                PAYMENT_AMOUNT: String(header.paymentAmount),
                EXCHANGE_RATE: String(header.exchangeRate || 1),
                PAYMENT_AMOUNT_LC: String(Number(header.paymentAmount) * (Number(header.exchangeRate) || 1)),
                REMARKS: header.remarks,
                STATUS_ENTRY: header.status || "Closed",
                CREATED_BY: audit?.user || "System",
                CREATED_DATE: new Date(),
                CREATED_MAC_ADDRESS: req.ip || "127.0.0.1",
                Submitted_By: header.status === "Closed" ? audit?.user : null,
                Submitted_Date: header.status === "Closed" ? new Date() : null,
                Submitted_IP_Address: header.status === "Closed" ? (req.ip || "127.0.0.1") : null
            } as any);

            // 3. Insert Details & Handle Realized Gain/Loss
            if (items && items.length > 0) {
                for (const item of items) {
                    await tx.insert(TBL_PURCHASE_PAYMENT_INV_DTL).values({
                        PAYMENT_REF_NO: paymentRefNo,
                        PURCHASE_INVOICE_REF_NO: item.purchaseInvoiceRefNo,
                        ACTUAL_INVOICE_AMOUNT: String(item.actualInvoiceAmount || 0),
                        ALREADY_PAID_AMOUNT: String(item.alreadyPaidAmount || 0),
                        OUTSTANDING_INVOICE_AMOUNT: String(item.outstandingInvoiceAmount || 0),
                        PAYMENT_INVOICE_ADJUST_AMOUNT: String(item.paymentInvoiceAdjustAmount || 0),
                        REMARKS: item.remarks,
                        STATUS_ENTRY: "Normal",
                        CREATED_BY: audit?.user || "System",
                        CREATED_DATE: new Date(),
                        CREATED_MAC_ADDRESS: req.ip || "127.0.0.1"
                    });

                    const settleAmount = Number(item.paymentInvoiceAdjustAmount || 0);
                    if (settleAmount > 0) {
                        const origTx = await tx.select()
                            .from(TBL_MULTI_CURRENCY_TRANSACTIONS)
                            .where(and(
                                eq(TBL_MULTI_CURRENCY_TRANSACTIONS.DOCUMENT_NUMBER, item.purchaseInvoiceRefNo),
                                eq(TBL_MULTI_CURRENCY_TRANSACTIONS.DOCUMENT_TYPE, 'PURCHASE_INVOICE')
                            ))
                            .limit(1);

                        if (origTx.length > 0) {
                            const txData = origTx[0];
                            const currentRate = Number(header.exchangeRate || 1);
                            const originalRate = Number(txData.EXCHANGE_RATE_USED || 1);

                            if (currentRate !== originalRate) {
                                const currentBase = settleAmount * currentRate;
                                const originalBase = settleAmount * originalRate;
                                const glDiff = originalBase - currentBase; // For Liability, Decrease in value is GAIN
                                
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
                    PAYMENT_REF_NO: paymentRefNo,
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
                await tx.insert(TBL_PURCHASE_PAYMENT_FILES_UPLOAD).values(fValues as any);
            }

            // 4. Generate Accounting Journal Entry
            const supplierLedgerId = await getLedgerForSupplier(tx, header.supplierId, header.companyId);
            const bankLedgerId = header.crBankCashId; // Cr Bank for payment

            if (bankLedgerId && supplierLedgerId) {
                const journalDetails = [
                    {
                        ledgerId: supplierLedgerId,
                        debit: Number(header.paymentAmount),
                        credit: 0,
                        remarks: `Supplier Payment - ${paymentRefNo}`
                    },
                    {
                        ledgerId: Number(bankLedgerId),
                        debit: 0,
                        credit: Number(header.paymentAmount),
                        remarks: `Payment - ${paymentRefNo}`
                    }
                ];

                await createJournalEntry(tx, {
                    journalDate: header.paymentDate ? new Date(header.paymentDate) : new Date(),
                    companyId: header.companyId,
                    moduleName: "PURCHASE_PAYMENT",
                    moduleRefNo: paymentRefNo,
                    narration: `Payment made to Supplier ID: ${header.supplierId}`,
                    createdBy: audit?.user || "System",
                    ipAddress: req.ip
                }, journalDetails);
            }
        });
        res.status(201).json({ message: "Purchase payment created successfully" });
    } catch (error: any) {
        console.error("Add Payment Error:", error);
        res.status(500).json({ error: error.message || "Failed to create purchase payment" });
    }
};

export const updatePurchasePayment = async (req: Request, res: Response) => {
    const { header, items, audit } = req.body;
    const idParam = req.params.id as string;
    const id = decodeURIComponent(idParam);

    try {
        await db.transaction(async (tx) => {
            // 1. Revert Accounting (Delete old journals)
            const oldJournals = await tx.select({ journalRefNo: TBL_JOURNAL_HDR.JOURNAL_REF_NO })
                .from(TBL_JOURNAL_HDR)
                .where(and(eq(TBL_JOURNAL_HDR.MODULE_REF_NO, id), eq(TBL_JOURNAL_HDR.MODULE_NAME, "PURCHASE_PAYMENT")));
            
            for (const j of oldJournals) {
                await tx.delete(TBL_JOURNAL_DTL).where(eq(TBL_JOURNAL_DTL.JOURNAL_REF_NO, j.journalRefNo));
                await tx.delete(TBL_JOURNAL_HDR).where(eq(TBL_JOURNAL_HDR.JOURNAL_REF_NO, j.journalRefNo));
            }

            // 2. Delete old details
            await tx.delete(TBL_PURCHASE_PAYMENT_INV_DTL).where(eq(TBL_PURCHASE_PAYMENT_INV_DTL.PAYMENT_REF_NO, id));
            await tx.delete(TBL_PURCHASE_PAYMENT_FILES_UPLOAD).where(eq(TBL_PURCHASE_PAYMENT_FILES_UPLOAD.PAYMENT_REF_NO, id));

            // 3. Update Header
            await tx.update(TBL_PURCHASE_PAYMENT_HDR)
                .set({
                    PAYMENT_DATE: header.paymentDate ? new Date(header.paymentDate) : new Date(),
                    PAYMENT_TYPE: header.paymentType || "Regular",
                    COMPANY_ID: header.companyId,
                    SUPPLIER_ID: header.supplierId,
                    PAYMENT_MODE_ID: header.paymentModeId,
                    CR_BANK_CASH_ID: header.crBankCashId,
                    DR_BANK_CASH_ID: header.drBankCashId,
                    DR_ACCOUNT_ID: header.drAccountId,
                    TRANSACTION_REF_NO: header.transactionRefNo,
                    TRANSACTION_DATE: header.transactionDate ? new Date(header.transactionDate) : null,
                    CURRENCY_ID: header.currencyId || 1,
                    PAYMENT_AMOUNT: String(header.paymentAmount),
                    EXCHANGE_RATE: String(header.exchangeRate || 1),
                    PAYMENT_AMOUNT_LC: String(Number(header.paymentAmount) * (Number(header.exchangeRate) || 1)),
                    REMARKS: header.remarks,
                    STATUS_ENTRY: header.status || "Closed",
                    MODIFIED_BY: audit?.user || "System",
                    MODIFIED_DATE: new Date(),
                    Submitted_By: header.status === "Closed" ? audit?.user : null,
                    Submitted_Date: header.status === "Closed" ? new Date() : null
                })
                .where(eq(TBL_PURCHASE_PAYMENT_HDR.PAYMENT_REF_NO, id));

            // 4. Insert New Details & Accounting (Reuse logic)
            if (items && items.length > 0) {
                for (const item of items) {
                    await tx.insert(TBL_PURCHASE_PAYMENT_INV_DTL).values({
                        PAYMENT_REF_NO: id,
                        PURCHASE_INVOICE_REF_NO: item.purchaseInvoiceRefNo,
                        ACTUAL_INVOICE_AMOUNT: String(item.actualInvoiceAmount || 0),
                        ALREADY_PAID_AMOUNT: String(item.alreadyPaidAmount || 0),
                        OUTSTANDING_INVOICE_AMOUNT: String(item.outstandingInvoiceAmount || 0),
                        PAYMENT_INVOICE_ADJUST_AMOUNT: String(item.paymentInvoiceAdjustAmount || 0),
                        REMARKS: item.remarks,
                        STATUS_ENTRY: "Normal",
                        CREATED_BY: audit?.user || "System",
                        CREATED_DATE: new Date(),
                        CREATED_MAC_ADDRESS: req.ip || "127.0.0.1"
                    });
                }
            }

            if (req.body.files && req.body.files.length > 0) {
                const fValues = req.body.files.map((f: any) => ({
                    PAYMENT_REF_NO: id,
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
                await tx.insert(TBL_PURCHASE_PAYMENT_FILES_UPLOAD).values(fValues as any);
            }

            // 5. Re-generate Accounting
            const supplierLedgerId = await getLedgerForSupplier(tx, header.supplierId, header.companyId);
            const bankLedgerId = header.crBankCashId;

            if (bankLedgerId && supplierLedgerId) {
                const journalDetails = [
                    {
                        ledgerId: supplierLedgerId,
                        debit: Number(header.paymentAmount),
                        credit: 0,
                        remarks: `Supplier Payment (Update) - ${id}`
                    },
                    {
                        ledgerId: Number(bankLedgerId),
                        debit: 0,
                        credit: Number(header.paymentAmount),
                        remarks: `Payment (Update) - ${id}`
                    }
                ];

                await createJournalEntry(tx, {
                    journalDate: header.paymentDate ? new Date(header.paymentDate) : new Date(),
                    companyId: header.companyId,
                    moduleName: "PURCHASE_PAYMENT",
                    moduleRefNo: id,
                    narration: `Payment updated for Supplier ID: ${header.supplierId}`,
                    createdBy: audit?.user || "System",
                    ipAddress: req.ip
                }, journalDetails);
            }
        });
        res.json({ message: "Purchase payment updated successfully" });
    } catch (error: any) {
        console.error("Update Payment Error:", error);
        res.status(500).json({ error: error.message || "Failed to update purchase payment" });
    }
};

export const deletePurchasePayment = async (req: Request, res: Response) => {
    try {
        const idParam = req.params.id as string;
        const id = decodeURIComponent(idParam);
        await db.transaction(async (tx) => {
            const oldJournals = await tx.select({ journalRefNo: TBL_JOURNAL_HDR.JOURNAL_REF_NO })
                .from(TBL_JOURNAL_HDR)
                .where(and(eq(TBL_JOURNAL_HDR.MODULE_REF_NO, id), eq(TBL_JOURNAL_HDR.MODULE_NAME, "PURCHASE_PAYMENT")));
            
            for (const j of oldJournals) {
                await tx.delete(TBL_JOURNAL_DTL).where(eq(TBL_JOURNAL_DTL.JOURNAL_REF_NO, j.journalRefNo));
                await tx.delete(TBL_JOURNAL_HDR).where(eq(TBL_JOURNAL_HDR.JOURNAL_REF_NO, j.journalRefNo));
            }

            await tx.delete(TBL_PURCHASE_PAYMENT_INV_DTL).where(eq(TBL_PURCHASE_PAYMENT_INV_DTL.PAYMENT_REF_NO, id));
            await tx.delete(TBL_PURCHASE_PAYMENT_FILES_UPLOAD).where(eq(TBL_PURCHASE_PAYMENT_FILES_UPLOAD.PAYMENT_REF_NO, id));
            await tx.delete(TBL_PURCHASE_PAYMENT_HDR).where(eq(TBL_PURCHASE_PAYMENT_HDR.PAYMENT_REF_NO, id));
        });
        res.json({ message: "Payment deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: "Failed to delete payment" });
    }
};
