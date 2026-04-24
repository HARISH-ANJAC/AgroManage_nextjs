import { 
    TBL_JOURNAL_HDR, 
    TBL_JOURNAL_DTL,
    TBL_ACCOUNTS_LEDGER_MASTER,
    TBL_SUPPLIER_MASTER,
    TBL_CUSTOMER_MASTER
} from "../db/schema/index.js";
import { like, desc, and, eq } from "drizzle-orm";

export interface JournalDetail {
    ledgerId: number;
    debit: number;
    credit: number;
    remarks?: string;
}

export interface JournalHeader {
    journalDate: Date;
    companyId: number;
    moduleName: string;
    moduleRefNo: string;
    narration: string;
    createdBy: string;
    ipAddress?: string;
}

/**
 * Creates a Journal Entry within a transaction.
 * Ensures that Total Debit equals Total Credit.
 */
export const createJournalEntry = async (tx: any, header: JournalHeader, details: JournalDetail[]) => {
    // 1. Validate Balancing (using a small epsilon for floating point issues)
    const totalDebit = details.reduce((sum, d) => sum + Number(d.debit), 0);
    const totalCredit = details.reduce((sum, d) => sum + Number(d.credit), 0);

    if (Math.abs(totalDebit - totalCredit) > 0.01) {
        throw new Error(`Accounting Mismatch: Total Debit (${totalDebit.toFixed(2)}) does not equal Total Credit (${totalCredit.toFixed(2)}) for ${header.moduleRefNo}`);
    }

    // 2. Generate Journal Ref No (Format: JV/YYYY/MM/SEQ)
    const journalDate = header.journalDate;
    const year = journalDate.getFullYear();
    const month = (journalDate.getMonth() + 1).toString().padStart(2, '0');
    const searchPrefix = `JV/${year}/${month}/%`;

    const latestJV = await tx.select({ ref: TBL_JOURNAL_HDR.JOURNAL_REF_NO })
        .from(TBL_JOURNAL_HDR)
        .where(like(TBL_JOURNAL_HDR.JOURNAL_REF_NO, searchPrefix))
        .orderBy(desc(TBL_JOURNAL_HDR.JOURNAL_REF_NO))
        .limit(1);

    let nextSeq = 1;
    if (latestJV.length > 0 && latestJV[0].ref) {
        const parts = latestJV[0].ref.split('/');
        if (parts.length === 4) {
            nextSeq = parseInt(parts[3], 10) + 1;
        }
    }
    const finalRefNo = `JV/${year}/${month}/${nextSeq.toString().padStart(3, '0')}`;

    // 3. Insert Header
    await tx.insert(TBL_JOURNAL_HDR).values({
        JOURNAL_REF_NO: finalRefNo,
        JOURNAL_DATE: journalDate,
        COMPANY_ID: header.companyId,
        MODULE_NAME: header.moduleName,
        MODULE_REF_NO: header.moduleRefNo,
        NARRATION: header.narration,
        STATUS_ENTRY: "Posted",
        CREATED_BY: header.createdBy,
        CREATED_IP_ADDRESS: header.ipAddress || "127.0.0.1",
        CREATED_DATE: new Date()
    });

    // 4. Insert Details
    const dValues = details.map(d => ({
        JOURNAL_REF_NO: finalRefNo,
        LEDGER_ID: d.ledgerId,
        DEBIT: d.debit.toFixed(2),
        CREDIT: d.credit.toFixed(2),
        REMARKS: d.remarks
    }));

    if (dValues.length > 0) {
        await tx.insert(TBL_JOURNAL_DTL).values(dValues);
    }

    return finalRefNo;
};

/**
 * Finds or creates a system ledger (e.g. Purchase Account, Sales Account, VAT Account)
 */
export const getSystemLedger = async (tx: any, companyId: number, name: string, type: string = "Indirect") => {
    let ledger = await tx.select().from(TBL_ACCOUNTS_LEDGER_MASTER)
        .where(and(eq(TBL_ACCOUNTS_LEDGER_MASTER.LEDGER_NAME, name), eq(TBL_ACCOUNTS_LEDGER_MASTER.Company_id, companyId)))
        .limit(1);
    
    if (ledger.length > 0) return ledger[0].LEDGER_ID;
    
    const inserted = await tx.insert(TBL_ACCOUNTS_LEDGER_MASTER).values({
        LEDGER_NAME: name,
        LEDGER_TYPE: type,
        Company_id: companyId,
        STATUS_MASTER: "Active"
    } as any).returning();
    return inserted[0].LEDGER_ID;
};

/**
 * Finds or creates a ledger for a specific Supplier
 */
export const getLedgerForSupplier = async (tx: any, supplierId: number, companyId: number) => {
    const supplier = (await tx.select().from(TBL_SUPPLIER_MASTER).where(eq(TBL_SUPPLIER_MASTER.Supplier_Id, supplierId)).limit(1))[0];
    if (!supplier) throw new Error("Supplier not found");

    const ledgerName = `Supplier: ${supplier.Supplier_Name}`;
    return await getSystemLedger(tx, companyId, ledgerName, "Liability");
};

/**
 * Finds or creates a ledger for a specific Customer
 */
export const getLedgerForCustomer = async (tx: any, customerId: number, companyId: number) => {
    const customer = (await tx.select().from(TBL_CUSTOMER_MASTER).where(eq(TBL_CUSTOMER_MASTER.Customer_Id, customerId)).limit(1))[0];
    if (!customer) throw new Error("Customer not found");

    const ledgerName = `Customer: ${customer.Customer_Name}`;
    return await getSystemLedger(tx, companyId, ledgerName, "Asset");
};
