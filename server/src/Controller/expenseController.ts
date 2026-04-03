import { Request, Response } from "express";
import { db } from "../db/index.js";
import { 
    TBL_EXPENSE_HDR, 
    TBL_EXPENSE_DTL,
    TBL_EXPENSE_FILES_UPLOAD,
    TBL_COMPANY_MASTER,
    TBL_SUPPLIER_MASTER,
    TBL_ACCOUNTS_HEAD_MASTER
} from "../db/schema/index.js";
import { eq, desc, sql, and, ne } from "drizzle-orm";

export const getExpenses = async (req: Request, res: Response): Promise<Response> => {
    try {
        const data = await db.select({
            id: TBL_EXPENSE_HDR.SNO,
            expenseRefNo: TBL_EXPENSE_HDR.EXPENSE_REF_NO,
            expenseDate: TBL_EXPENSE_HDR.EXPENSE_DATE,
            companyId: TBL_EXPENSE_HDR.COMPANY_ID,
            companyName: TBL_COMPANY_MASTER.Company_Name,
            expenseAgainst: TBL_EXPENSE_HDR.EXPENSE_AGAINST,
            poRefNo: TBL_EXPENSE_HDR.PO_REF_NO,
            accountHeadId: TBL_EXPENSE_HDR.ACCOUNT_HEAD_ID,
            accountHeadName: TBL_ACCOUNTS_HEAD_MASTER.ACCOUNT_HEAD_NAME,
            supplierId: TBL_EXPENSE_HDR.EXPENSE_SUPPLIER_ID,
            supplierName: TBL_SUPPLIER_MASTER.Supplier_Name,
            expenseType: TBL_EXPENSE_HDR.EXPENSE_TYPE,
            traEfdReceiptNo: TBL_EXPENSE_HDR.TRA_EFD_RECEIPT_NO,
            currencyId: TBL_EXPENSE_HDR.CURRENCY_ID,
            totalExpenseAmount: TBL_EXPENSE_HDR.TOTAL_EXPENSE_AMOUNT,
            status: TBL_EXPENSE_HDR.STATUS_ENTRY,
            remarks: TBL_EXPENSE_HDR.REMARKS,
            createdBy: TBL_EXPENSE_HDR.CREATED_BY,
            createdDate: TBL_EXPENSE_HDR.CREATED_DATE
        })
        .from(TBL_EXPENSE_HDR)
        .leftJoin(TBL_COMPANY_MASTER, eq(TBL_EXPENSE_HDR.COMPANY_ID, TBL_COMPANY_MASTER.Company_Id))
        .leftJoin(TBL_SUPPLIER_MASTER, eq(TBL_EXPENSE_HDR.EXPENSE_SUPPLIER_ID, TBL_SUPPLIER_MASTER.Supplier_Id))
        .leftJoin(TBL_ACCOUNTS_HEAD_MASTER, eq(TBL_EXPENSE_HDR.ACCOUNT_HEAD_ID, TBL_ACCOUNTS_HEAD_MASTER.ACCOUNT_HEAD_ID))
        .orderBy(desc(TBL_EXPENSE_HDR.CREATED_DATE));

        return res.status(200).json(data);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ msg: "Internal server error" });
    }
};

export const getExpenseById = async (req: Request, res: Response): Promise<Response> => {
    try {
        const id = decodeURIComponent(req.params.id as string);
        const header = await db.select({
            id: TBL_EXPENSE_HDR.SNO,
            expenseRefNo: TBL_EXPENSE_HDR.EXPENSE_REF_NO,
            expenseDate: TBL_EXPENSE_HDR.EXPENSE_DATE,
            companyId: TBL_EXPENSE_HDR.COMPANY_ID,
            expenseAgainst: TBL_EXPENSE_HDR.EXPENSE_AGAINST,
            poRefNo: TBL_EXPENSE_HDR.PO_REF_NO,
            accountHeadId: TBL_EXPENSE_HDR.ACCOUNT_HEAD_ID,
            expenseSupplierId: TBL_EXPENSE_HDR.EXPENSE_SUPPLIER_ID,
            expenseType: TBL_EXPENSE_HDR.EXPENSE_TYPE,
            traEfdReceiptNo: TBL_EXPENSE_HDR.TRA_EFD_RECEIPT_NO,
            currencyId: TBL_EXPENSE_HDR.CURRENCY_ID,
            exchangeRate: TBL_EXPENSE_HDR.EXCHANGE_RATE,
            totalExpenseAmount: TBL_EXPENSE_HDR.TOTAL_EXPENSE_AMOUNT,
            totalExpenseAmountLc: TBL_EXPENSE_HDR.TOTAL_EXPENSE_AMOUNT_LC,
            remarks: TBL_EXPENSE_HDR.REMARKS,
            status: TBL_EXPENSE_HDR.STATUS_ENTRY,
        })
        .from(TBL_EXPENSE_HDR)
        .where(eq(TBL_EXPENSE_HDR.EXPENSE_REF_NO, id))
        .limit(1);

        if (!header.length) return res.status(404).json({ msg: "Expense not found" });

        const items = await db.select().from(TBL_EXPENSE_DTL).where(eq(TBL_EXPENSE_DTL.EXPENSE_REF_NO, id));
        const filesData = await db.select().from(TBL_EXPENSE_FILES_UPLOAD).where(eq(TBL_EXPENSE_FILES_UPLOAD.EXPENSE_REF_NO, id));
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

export const createExpense = async (req: Request, res: Response): Promise<Response> => {
    try {
        const result = await db.transaction(async (tx) => {
            const { header, items, audit } = req.body;
 
            // 0. Check for existing expense with same PO Reference (Prevent Duplicates)
            if (header.poRefNo) {
                const existing = await tx.select({ ref: TBL_EXPENSE_HDR.EXPENSE_REF_NO })
                    .from(TBL_EXPENSE_HDR)
                    .where(eq(TBL_EXPENSE_HDR.PO_REF_NO, header.poRefNo))
                    .limit(1);
                    
                if (existing.length > 0) {
                    throw new Error(`Expense already exists for PO: ${header.poRefNo} (Ref: ${existing[0].ref})`);
                }
            }

            // 1. Generate Ref No: EXP/YY/MM/XXX
            const date = new Date();
            const yearStr = date.getFullYear().toString().slice(-2);
            const monthStr = (date.getMonth() + 1).toString().padStart(2, '0');
            const prefix = `EXP/${yearStr}/${monthStr}/`;

            const lastEntry = await tx.select({ ref: TBL_EXPENSE_HDR.EXPENSE_REF_NO })
                .from(TBL_EXPENSE_HDR)
                .where(sql`${TBL_EXPENSE_HDR.EXPENSE_REF_NO} LIKE ${prefix + '%'}`)
                .orderBy(desc(TBL_EXPENSE_HDR.EXPENSE_REF_NO))
                .limit(1);

            let newNo = "001";
            if (lastEntry.length > 0 && lastEntry[0].ref) {
                const parts = lastEntry[0].ref.split('/');
                const lastSeq = parseInt(parts[parts.length - 1]);
                if (!isNaN(lastSeq)) {
                    newNo = (lastSeq + 1).toString().padStart(3, '0');
                }
            }
            const expenseRefNo = prefix + newNo;

            const hValues = {
                EXPENSE_REF_NO: expenseRefNo,
                EXPENSE_DATE: header.expenseDate ? new Date(header.expenseDate) : new Date(),
                COMPANY_ID: header.companyId,
                EXPENSE_AGAINST: header.expenseAgainst || "PO",
                PO_REF_NO: header.poRefNo,
                ACCOUNT_HEAD_ID: header.accountHeadId,
                EXPENSE_SUPPLIER_ID: header.expenseSupplierId,
                EXPENSE_TYPE: header.expenseType || "General",
                TRA_EFD_RECEIPT_NO: header.traEfdReceiptNo,
                CURRENCY_ID: header.currencyId || 1,
                EXCHANGE_RATE: String(header.exchangeRate || 1),
                TOTAL_EXPENSE_AMOUNT: String(header.totalExpenseAmount),
                TOTAL_EXPENSE_AMOUNT_LC: String(Number(header.totalExpenseAmount) * (Number(header.exchangeRate) || 1)),
                STATUS_ENTRY: header.status || "Closed",
                REMARKS: header.remarks,
                CREATED_BY: audit?.user || "System",
                CREATED_DATE: new Date(),
                CREATED_IP_ADDRESS: req.ip || "127.0.0.1"
            };

            await tx.insert(TBL_EXPENSE_HDR).values(hValues as any);

            if (items && items.length > 0) {
                const dValues = items.map((item: any) => ({
                    EXPENSE_REF_NO: expenseRefNo,
                    PO_REF_NO: item.poRefNo,
                    PO_DTL_SNO: item.poDtlSno,
                    PRODUCT_ID: item.productId,
                    EXPENSE_AMOUNT: String(item.expenseAmount),
                    EXPENSE_AMOUNT_LC: String(Number(item.expenseAmount) * (Number(header.exchangeRate) || 1)),
                    REMARKS: item.remarks,
                    STATUS_ENTRY: "Normal",
                    CREATED_BY: audit?.user || "System",
                    CREATED_DATE: new Date(),
                    CREATED_IP_ADDRESS: req.ip || "127.0.0.1"
                }));
                await tx.insert(TBL_EXPENSE_DTL).values(dValues as any);
            }

            if (req.body.files && req.body.files.length > 0) {
                const fValues = req.body.files.map((f: any) => ({
                    EXPENSE_REF_NO: expenseRefNo,
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
                await tx.insert(TBL_EXPENSE_FILES_UPLOAD).values(fValues as any);
            }

            return { msg: "Expense created successfully", expenseRefNo };
        });

        return res.status(201).json(result);
    } catch (error: any) {
        console.error("Create Expense Error:", error);
        return res.status(500).json({ msg: error.message || "Internal server error" });
    }
};

export const updateExpense = async (req: Request, res: Response): Promise<Response> => {
    try {
        const id = decodeURIComponent(req.params.id as string);
        const result = await db.transaction(async (tx) => {
            const { header, items, audit } = req.body;
            
            // 0. Check for duplicate PO Reference on other records
            if (header.poRefNo) {
                const existing = await tx.select({ ref: TBL_EXPENSE_HDR.EXPENSE_REF_NO })
                    .from(TBL_EXPENSE_HDR)
                    .where(and(
                        eq(TBL_EXPENSE_HDR.PO_REF_NO, header.poRefNo),
                        ne(TBL_EXPENSE_HDR.EXPENSE_REF_NO, id)
                    ))
                    .limit(1);

                if (existing.length > 0) {
                    throw new Error(`Another expense already exists for PO: ${header.poRefNo} (Ref: ${existing[0].ref})`);
                }
            }

            const hUpdates = {
                EXPENSE_DATE: header.expenseDate ? new Date(header.expenseDate) : undefined,
                COMPANY_ID: header.companyId,
                ACCOUNT_HEAD_ID: header.accountHeadId,
                EXPENSE_SUPPLIER_ID: header.expenseSupplierId,
                TRA_EFD_RECEIPT_NO: header.traEfdReceiptNo,
                TOTAL_EXPENSE_AMOUNT: String(header.totalExpenseAmount),
                TOTAL_EXPENSE_AMOUNT_LC: String(Number(header.totalExpenseAmount) * (Number(header.exchangeRate) || 1)),
                STATUS_ENTRY: header.status,
                REMARKS: header.remarks,
                MODIFIED_BY: audit?.user || "System",
                MODIFIED_DATE: new Date(),
                MODIFIED_IP_ADDRESS: req.ip || "127.0.0.1"
            };

            await tx.update(TBL_EXPENSE_HDR).set(hUpdates as any).where(eq(TBL_EXPENSE_HDR.EXPENSE_REF_NO, id));

            await tx.delete(TBL_EXPENSE_DTL).where(eq(TBL_EXPENSE_DTL.EXPENSE_REF_NO, id));
            if (items && items.length > 0) {
                const dValues = items.map((item: any) => ({
                    EXPENSE_REF_NO: id,
                    PO_REF_NO: item.poRefNo,
                    PO_DTL_SNO: item.poDtlSno,
                    PRODUCT_ID: item.productId,
                    EXPENSE_AMOUNT: String(item.expenseAmount),
                    EXPENSE_AMOUNT_LC: String(Number(item.expenseAmount) * (Number(header.exchangeRate) || 1)),
                    REMARKS: item.remarks,
                    STATUS_ENTRY: "Normal",
                    CREATED_BY: audit?.user || "System",
                    CREATED_DATE: new Date(),
                    CREATED_IP_ADDRESS: req.ip || "127.0.0.1"
                }));
                await tx.insert(TBL_EXPENSE_DTL).values(dValues as any);
            }

            await tx.delete(TBL_EXPENSE_FILES_UPLOAD).where(eq(TBL_EXPENSE_FILES_UPLOAD.EXPENSE_REF_NO, id as string));
            if (req.body.files && req.body.files.length > 0) {
                const fValues = req.body.files.map((f: any) => ({
                    EXPENSE_REF_NO: id,
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
                await tx.insert(TBL_EXPENSE_FILES_UPLOAD).values(fValues as any);
            }

            return { msg: "Expense updated successfully" };
        });

        return res.status(200).json(result);
    } catch (error: any) {
        console.error("Update Expense Error:", error);
        return res.status(500).json({ msg: error.message || "Internal server error" });
    }
};

export const deleteExpense = async (req: Request, res: Response): Promise<Response> => {
    try {
        const id = decodeURIComponent(req.params.id as string);
        await db.transaction(async (tx) => {
            await tx.delete(TBL_EXPENSE_DTL).where(eq(TBL_EXPENSE_DTL.EXPENSE_REF_NO, id));
            await tx.delete(TBL_EXPENSE_HDR).where(eq(TBL_EXPENSE_HDR.EXPENSE_REF_NO, id));
        });
        return res.status(200).json({ msg: "Expense deleted successfully" });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ msg: "Internal server error" });
    }
};
