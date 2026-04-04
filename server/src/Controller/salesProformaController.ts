import { Request, Response } from "express";
import { db } from "../db/index.js";
import {
    TBL_SALES_PROFORMA_HDR,
    TBL_SALES_PROFORMA_DTL,
    TBL_SALES_PROFORMA_FILES_UPLOAD,
    TBL_PRODUCT_MASTER,
    TBL_CUSTOMER_MASTER,
    TBL_STORE_MASTER,
    TBL_COMPANY_MASTER,
    TBL_SALES_PERSON_MASTER,
    TBL_BILLING_LOCATION_MASTER,
    TBL_CURRENCY_MASTER
} from "../db/schema/index.js";
import { eq, like, desc } from "drizzle-orm";
import { generateInvoicePdf } from "../utils/pdfGenerator.js";


// ─── Interfaces ───────────────────────────────────────────────────────────────

interface ProformaHeader {
    salesProformaRefNo?: string;
    salesProformaDate?: string;
    companyId: number;
    storeId: number;
    customerId: number;
    billingLocationId: number;
    salesPersonEmpId: number;
    currencyId: number;
    exchangeRate: number;
    totalProductAmount: number;
    vatAmount: number;
    finalSalesAmount: number;
    remarks?: string;
    testDesc?: string;
    status: string;
}

interface ProformaItem {
    productId: number;
    mainCategoryId: number;
    subCategoryId: number;
    salesRatePerQty: number;
    totalQty: number;
    qtyPerPacking: number;
    uom: string;
    alternateUom?: string;
    totalProductAmount: number;
    vatPercentage: number;
    vatAmount: number;
    finalSalesAmount: number;
    storeStockPcs?: number;
    poRefNo?: string;
    poDtlSno?: number;
    poDtlStockQty?: number;
    purchaseRatePerQty?: number;
    poExpenseAmount?: number;
}

// ─── GET ALL Proformas ─────────────────────────────────────────────────────────

export const getSalesProformas = async (req: Request, res: Response): Promise<Response> => {
    try {
        const data = await db.select({
            id: TBL_SALES_PROFORMA_HDR.SNO,
            salesProformaRefNo: TBL_SALES_PROFORMA_HDR.SALES_PROFORMA_REF_NO,
            salesProformaDate: TBL_SALES_PROFORMA_HDR.SALES_PROFORMA_DATE,
            companyId: TBL_SALES_PROFORMA_HDR.COMPANY_ID,
            storeId: TBL_SALES_PROFORMA_HDR.STORE_ID,
            customerId: TBL_SALES_PROFORMA_HDR.CUSTOMER_ID,
            billingLocationId: TBL_SALES_PROFORMA_HDR.BILLING_LOCATION_ID,
            salesPersonEmpId: TBL_SALES_PROFORMA_HDR.SALES_PERSON_EMP_ID,
            currencyId: TBL_SALES_PROFORMA_HDR.CURRENCY_ID,
            exchangeRate: TBL_SALES_PROFORMA_HDR.EXCHANGE_RATE,
            totalProductAmount: TBL_SALES_PROFORMA_HDR.TOTAL_PRODUCT_AMOUNT,
            vatAmount: TBL_SALES_PROFORMA_HDR.VAT_AMOUNT,
            finalSalesAmount: TBL_SALES_PROFORMA_HDR.FINAL_SALES_AMOUNT,
            totalProductAmountLC: TBL_SALES_PROFORMA_HDR.TOTAL_PRODUCT_AMOUNT_LC,
            finalSalesAmountLC: TBL_SALES_PROFORMA_HDR.FINAL_SALES_AMOUNT_LC,
            remarks: TBL_SALES_PROFORMA_HDR.REMARKS,
            status: TBL_SALES_PROFORMA_HDR.STATUS_ENTRY,
            submittedBy: TBL_SALES_PROFORMA_HDR.SUBMITTED_BY,
            submittedDate: TBL_SALES_PROFORMA_HDR.SUBMITTED_DATE,
            customerName: TBL_CUSTOMER_MASTER.Customer_Name,
            storeName: TBL_STORE_MASTER.Store_Name,
            companyName: TBL_COMPANY_MASTER.Company_Name,
            salesPersonName: TBL_SALES_PERSON_MASTER.PERSON_NAME,
            billingLocationName: TBL_BILLING_LOCATION_MASTER.Billing_Location_Name,
            currencyName: TBL_CURRENCY_MASTER.CURRENCY_NAME,
        })
            .from(TBL_SALES_PROFORMA_HDR)
            .leftJoin(TBL_CUSTOMER_MASTER, eq(TBL_SALES_PROFORMA_HDR.CUSTOMER_ID, TBL_CUSTOMER_MASTER.Customer_Id))
            .leftJoin(TBL_STORE_MASTER, eq(TBL_SALES_PROFORMA_HDR.STORE_ID, TBL_STORE_MASTER.Store_Id))
            .leftJoin(TBL_COMPANY_MASTER, eq(TBL_SALES_PROFORMA_HDR.COMPANY_ID, TBL_COMPANY_MASTER.Company_Id))
            .leftJoin(TBL_SALES_PERSON_MASTER, eq(TBL_SALES_PROFORMA_HDR.SALES_PERSON_EMP_ID, TBL_SALES_PERSON_MASTER.Sales_Person_ID))
            .leftJoin(TBL_BILLING_LOCATION_MASTER, eq(TBL_SALES_PROFORMA_HDR.BILLING_LOCATION_ID, TBL_BILLING_LOCATION_MASTER.Billing_Location_Id))
            .leftJoin(TBL_CURRENCY_MASTER, eq(TBL_SALES_PROFORMA_HDR.CURRENCY_ID, TBL_CURRENCY_MASTER.CURRENCY_ID))
            .orderBy(desc(TBL_SALES_PROFORMA_HDR.CREATED_DATE));

        return res.status(200).json(data);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ msg: "Internal server error" });
    }
};

// ─── GET ONE Proforma by Ref No ────────────────────────────────────────────────

export const getSalesProformaById = async (req: Request, res: Response): Promise<Response> => {
    try {
        const { id } = req.params;
        const decodedId = decodeURIComponent(id as string);

        const headerResult = await db.select({
            id: TBL_SALES_PROFORMA_HDR.SNO,
            salesProformaRefNo: TBL_SALES_PROFORMA_HDR.SALES_PROFORMA_REF_NO,
            salesProformaDate: TBL_SALES_PROFORMA_HDR.SALES_PROFORMA_DATE,
            companyId: TBL_SALES_PROFORMA_HDR.COMPANY_ID,
            storeId: TBL_SALES_PROFORMA_HDR.STORE_ID,
            customerId: TBL_SALES_PROFORMA_HDR.CUSTOMER_ID,
            billingLocationId: TBL_SALES_PROFORMA_HDR.BILLING_LOCATION_ID,
            salesPersonEmpId: TBL_SALES_PROFORMA_HDR.SALES_PERSON_EMP_ID,
            currencyId: TBL_SALES_PROFORMA_HDR.CURRENCY_ID,
            exchangeRate: TBL_SALES_PROFORMA_HDR.EXCHANGE_RATE,
            totalProductAmount: TBL_SALES_PROFORMA_HDR.TOTAL_PRODUCT_AMOUNT,
            vatAmount: TBL_SALES_PROFORMA_HDR.VAT_AMOUNT,
            finalSalesAmount: TBL_SALES_PROFORMA_HDR.FINAL_SALES_AMOUNT,
            totalProductAmountLC: TBL_SALES_PROFORMA_HDR.TOTAL_PRODUCT_AMOUNT_LC,
            finalSalesAmountLC: TBL_SALES_PROFORMA_HDR.FINAL_SALES_AMOUNT_LC,
            remarks: TBL_SALES_PROFORMA_HDR.REMARKS,
            testDesc: TBL_SALES_PROFORMA_HDR.TEST_DESC,
            status: TBL_SALES_PROFORMA_HDR.STATUS_ENTRY,
            submittedBy: TBL_SALES_PROFORMA_HDR.SUBMITTED_BY,
            submittedDate: TBL_SALES_PROFORMA_HDR.SUBMITTED_DATE,
            customerName: TBL_CUSTOMER_MASTER.Customer_Name,
            storeName: TBL_STORE_MASTER.Store_Name,
            companyName: TBL_COMPANY_MASTER.Company_Name,
            salesPersonName: TBL_SALES_PERSON_MASTER.PERSON_NAME,
            billingLocationName: TBL_BILLING_LOCATION_MASTER.Billing_Location_Name,
            currencyName: TBL_CURRENCY_MASTER.CURRENCY_NAME,
        })
            .from(TBL_SALES_PROFORMA_HDR)
            .leftJoin(TBL_CUSTOMER_MASTER, eq(TBL_SALES_PROFORMA_HDR.CUSTOMER_ID, TBL_CUSTOMER_MASTER.Customer_Id))
            .leftJoin(TBL_STORE_MASTER, eq(TBL_SALES_PROFORMA_HDR.STORE_ID, TBL_STORE_MASTER.Store_Id))
            .leftJoin(TBL_COMPANY_MASTER, eq(TBL_SALES_PROFORMA_HDR.COMPANY_ID, TBL_COMPANY_MASTER.Company_Id))
            .leftJoin(TBL_SALES_PERSON_MASTER, eq(TBL_SALES_PROFORMA_HDR.SALES_PERSON_EMP_ID, TBL_SALES_PERSON_MASTER.Sales_Person_ID))
            .leftJoin(TBL_BILLING_LOCATION_MASTER, eq(TBL_SALES_PROFORMA_HDR.BILLING_LOCATION_ID, TBL_BILLING_LOCATION_MASTER.Billing_Location_Id))
            .leftJoin(TBL_CURRENCY_MASTER, eq(TBL_SALES_PROFORMA_HDR.CURRENCY_ID, TBL_CURRENCY_MASTER.CURRENCY_ID))
            .where(eq(TBL_SALES_PROFORMA_HDR.SALES_PROFORMA_REF_NO, decodedId))
            .limit(1);

        if (!headerResult.length) {
            return res.status(404).json({ msg: "Sales Proforma not found" });
        }

        // Fetch line items with product name
        const items = await db.select({
            id: TBL_SALES_PROFORMA_DTL.SNO,
            salesProformaRefNo: TBL_SALES_PROFORMA_DTL.SALES_PROFORMA_REF_NO,
            productId: TBL_SALES_PROFORMA_DTL.PRODUCT_ID,
            productName: TBL_PRODUCT_MASTER.PRODUCT_NAME,
            mainCategoryId: TBL_SALES_PROFORMA_DTL.MAIN_CATEGORY_ID,
            subCategoryId: TBL_SALES_PROFORMA_DTL.SUB_CATEGORY_ID,
            storeStockPcs: TBL_SALES_PROFORMA_DTL.STORE_STOCK_PCS,
            poRefNo: TBL_SALES_PROFORMA_DTL.PO_REF_NO,
            poDtlSno: TBL_SALES_PROFORMA_DTL.PO_DTL_SNO,
            poDtlStockQty: TBL_SALES_PROFORMA_DTL.PO_DTL_STOCK_QTY,
            purchaseRatePerQty: TBL_SALES_PROFORMA_DTL.PURCHASE_RATE_PER_QTY,
            poExpenseAmount: TBL_SALES_PROFORMA_DTL.PO_EXPENSE_AMOUNT,
            salesRatePerQty: TBL_SALES_PROFORMA_DTL.SALES_RATE_PER_QTY,
            qtyPerPacking: TBL_SALES_PROFORMA_DTL.QTY_PER_PACKING,
            totalQty: TBL_SALES_PROFORMA_DTL.TOTAL_QTY,
            uom: TBL_SALES_PROFORMA_DTL.UOM,
            totalPacking: TBL_SALES_PROFORMA_DTL.TOTAL_PACKING,
            alternateUom: TBL_SALES_PROFORMA_DTL.ALTERNATE_UOM,
            totalProductAmount: TBL_SALES_PROFORMA_DTL.TOTAL_PRODUCT_AMOUNT,
            vatPercentage: TBL_SALES_PROFORMA_DTL.VAT_PERCENTAGE,
            vatAmount: TBL_SALES_PROFORMA_DTL.VAT_AMOUNT,
            finalSalesAmount: TBL_SALES_PROFORMA_DTL.FINAL_SALES_AMOUNT,
            totalProductAmountLC: TBL_SALES_PROFORMA_DTL.TOTAL_PRODUCT_AMOUNT_LC,
            finalSalesAmountLC: TBL_SALES_PROFORMA_DTL.FINAL_SALES_AMOUNT_LC,
            remarks: TBL_SALES_PROFORMA_DTL.REMARKS,
        })
            .from(TBL_SALES_PROFORMA_DTL)
            .leftJoin(TBL_PRODUCT_MASTER, eq(TBL_SALES_PROFORMA_DTL.PRODUCT_ID, TBL_PRODUCT_MASTER.PRODUCT_ID))
            .where(eq(TBL_SALES_PROFORMA_DTL.SALES_PROFORMA_REF_NO, decodedId));

        // Fetch attached files (binary data as base64)
        const filesData = await db.select()
            .from(TBL_SALES_PROFORMA_FILES_UPLOAD)
            .where(eq(TBL_SALES_PROFORMA_FILES_UPLOAD.SALES_PROFORMA_REF_NO, decodedId));

        const files = filesData.map(f => ({
            ...f,
            CONTENT_DATA: f.CONTENT_DATA ? f.CONTENT_DATA.toString('base64') : null
        }));

        return res.status(200).json({ header: headerResult[0], items, files });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ msg: "Internal server error" });
    }
};

// ─── CREATE Proforma ───────────────────────────────────────────────────────────

export const createSalesProforma = async (req: Request, res: Response): Promise<Response> => {
    const transaction = await db.transaction(async (tx) => {
        try {
            const { header, items, audit } = req.body as {
                header: ProformaHeader;
                items: ProformaItem[];
                audit: any;
            };

            let finalRefNo = header.salesProformaRefNo;

            // Auto-generate ref no if not provided
            if (!finalRefNo || finalRefNo.startsWith("TEMP-")) {
                const now = new Date();
                const mStr = (now.getMonth() + 1).toString().padStart(2, '0');
                const searchPrefix = `PF/MA/${mStr}/%`;

                const latest = await tx
                    .select({ ref: TBL_SALES_PROFORMA_HDR.SALES_PROFORMA_REF_NO })
                    .from(TBL_SALES_PROFORMA_HDR)
                    .where(like(TBL_SALES_PROFORMA_HDR.SALES_PROFORMA_REF_NO, searchPrefix))
                    .orderBy(desc(TBL_SALES_PROFORMA_HDR.SALES_PROFORMA_REF_NO))
                    .limit(1);

                let nextSeq = 1;
                if (latest.length > 0 && latest[0].ref) {
                    const parts = latest[0].ref.split('/');
                    if (parts.length === 4) {
                        nextSeq = parseInt(parts[3], 10) + 1;
                    }
                }
                finalRefNo = `PF/MA/${mStr}/${nextSeq.toString().padStart(3, '0')}`;
            }

            const exchangeRate = Number(header.exchangeRate) || 1;

            const hValues: typeof TBL_SALES_PROFORMA_HDR.$inferInsert = {
                SALES_PROFORMA_REF_NO: finalRefNo,
                SALES_PROFORMA_DATE: header.salesProformaDate ? new Date(header.salesProformaDate) : new Date(),
                COMPANY_ID: Number(header.companyId),
                STORE_ID: Number(header.storeId),
                CUSTOMER_ID: Number(header.customerId),
                BILLING_LOCATION_ID: Number(header.billingLocationId),
                SALES_PERSON_EMP_ID: Number(header.salesPersonEmpId),
                CURRENCY_ID: Number(header.currencyId),
                EXCHANGE_RATE: String(exchangeRate),
                TOTAL_PRODUCT_AMOUNT: String(header.totalProductAmount || 0),
                VAT_AMOUNT: String(header.vatAmount || 0),
                FINAL_SALES_AMOUNT: String(header.finalSalesAmount || 0),
                TOTAL_PRODUCT_AMOUNT_LC: String((header.totalProductAmount || 0) * exchangeRate),
                FINAL_SALES_AMOUNT_LC: String((header.finalSalesAmount || 0) * exchangeRate),
                REMARKS: header.remarks,
                TEST_DESC: header.testDesc,
                STATUS_ENTRY: header.status || "Draft",
                CREATED_BY: audit?.user || "admin",
                CREATED_DATE: new Date(),
                CREATED_MAC_ADDRESS: req.ip || "127.0.0.1",
                SUBMITTED_BY: header.status === "Confirmed" ? audit?.user : null,
                SUBMITTED_DATE: header.status === "Confirmed" ? new Date() : null,
            };

            await tx.insert(TBL_SALES_PROFORMA_HDR).values(hValues);

            if (items && items.length > 0) {
                const dValues: (typeof TBL_SALES_PROFORMA_DTL.$inferInsert)[] = items.map((item) => ({
                    SALES_PROFORMA_REF_NO: finalRefNo,
                    PRODUCT_ID: Number(item.productId),
                    MAIN_CATEGORY_ID: item.mainCategoryId ? Number(item.mainCategoryId) : null,
                    SUB_CATEGORY_ID: item.subCategoryId ? Number(item.subCategoryId) : null,
                    STORE_STOCK_PCS: item.storeStockPcs != null ? String(item.storeStockPcs) : null,
                    PO_REF_NO: item.poRefNo ?? null,
                    PO_DTL_SNO: item.poDtlSno ? Number(item.poDtlSno) : null,
                    PO_DTL_STOCK_QTY: item.poDtlStockQty != null ? String(item.poDtlStockQty) : null,
                    PURCHASE_RATE_PER_QTY: item.purchaseRatePerQty != null ? String(item.purchaseRatePerQty) : null,
                    PO_EXPENSE_AMOUNT: item.poExpenseAmount != null ? String(item.poExpenseAmount) : null,
                    SALES_RATE_PER_QTY: String(item.salesRatePerQty || 0),
                    QTY_PER_PACKING: String(item.qtyPerPacking || 0),
                    TOTAL_QTY: String(item.totalQty || 0),
                    UOM: item.uom,
                    TOTAL_PACKING: String(item.qtyPerPacking ? Number((item.totalQty / item.qtyPerPacking).toFixed(2)) : 0),
                    ALTERNATE_UOM: item.alternateUom ?? null,
                    TOTAL_PRODUCT_AMOUNT: String(item.totalProductAmount || 0),
                    VAT_PERCENTAGE: String(item.vatPercentage || 0),
                    VAT_AMOUNT: String(item.vatAmount || 0),
                    FINAL_SALES_AMOUNT: String(item.finalSalesAmount || 0),
                    TOTAL_PRODUCT_AMOUNT_LC: String((item.totalProductAmount || 0) * exchangeRate),
                    FINAL_SALES_AMOUNT_LC: String((item.finalSalesAmount || 0) * exchangeRate),
                    STATUS_ENTRY: "Active",
                    CREATED_BY: audit?.user || "admin",
                    CREATED_DATE: new Date(),
                    CREATED_MAC_ADDRESS: req.ip || "127.0.0.1",
                }));
                await tx.insert(TBL_SALES_PROFORMA_DTL).values(dValues);
            }

            if (req.body.files && req.body.files.length > 0) {
                const fValues = req.body.files.map((f: any) => ({
                    SALES_PROFORMA_REF_NO: finalRefNo,
                    DOCUMENT_TYPE: f.documentType,
                    DESCRIPTION_DETAILS: f.descriptionDetails,
                    FILE_NAME: f.fileName,
                    CONTENT_TYPE: f.contentType,
                    CONTENT_DATA: f.contentData ? Buffer.from(f.contentData, 'base64') : null,
                    REMARKS: f.remarks,
                    STATUS_MASTER: "Active",
                    CREATED_BY: audit?.user || "admin",
                    CREATED_DATE: new Date(),
                    CREATED_IP_ADDRESS: req.ip || "127.0.0.1",
                }));
                await tx.insert(TBL_SALES_PROFORMA_FILES_UPLOAD).values(fValues as any);
            }

            return { msg: "Sales Proforma created successfully", salesProformaRefNo: finalRefNo };
        } catch (error: any) {
            console.error(error);
            tx.rollback();
            throw error;
        }
    });

    return res.status(201).json(transaction);
};

// ─── UPDATE Proforma ───────────────────────────────────────────────────────────

export const updateSalesProforma = async (req: Request, res: Response): Promise<Response> => {
    const { id } = req.params;
    const decodedId = decodeURIComponent(id as string);

    const transaction = await db.transaction(async (tx) => {
        try {
            const { header, items, audit } = req.body as {
                header: ProformaHeader;
                items: ProformaItem[];
                audit: any;
            };

            const exchangeRate = Number(header.exchangeRate) || 1;

            const hUpdates: Partial<typeof TBL_SALES_PROFORMA_HDR.$inferInsert> = {
                SALES_PROFORMA_DATE: header.salesProformaDate ? new Date(header.salesProformaDate) : undefined,
                COMPANY_ID: Number(header.companyId),
                STORE_ID: Number(header.storeId),
                CUSTOMER_ID: Number(header.customerId),
                BILLING_LOCATION_ID: Number(header.billingLocationId),
                SALES_PERSON_EMP_ID: Number(header.salesPersonEmpId),
                CURRENCY_ID: Number(header.currencyId),
                EXCHANGE_RATE: String(exchangeRate),
                TOTAL_PRODUCT_AMOUNT: String(header.totalProductAmount || 0),
                VAT_AMOUNT: String(header.vatAmount || 0),
                FINAL_SALES_AMOUNT: String(header.finalSalesAmount || 0),
                TOTAL_PRODUCT_AMOUNT_LC: String((header.totalProductAmount || 0) * exchangeRate),
                FINAL_SALES_AMOUNT_LC: String((header.finalSalesAmount || 0) * exchangeRate),
                REMARKS: header.remarks,
                TEST_DESC: header.testDesc,
                STATUS_ENTRY: header.status,
                MODIFIED_BY: audit?.user || "admin",
                MODIFIED_DATE: new Date(),
                MODIFIED_MAC_ADDRESS: req.ip || "127.0.0.1",
                SUBMITTED_BY: header.status === "Confirmed" ? audit?.user : undefined,
                SUBMITTED_DATE: header.status === "Confirmed" ? new Date() : undefined,
            };

            await tx.update(TBL_SALES_PROFORMA_HDR)
                .set(hUpdates)
                .where(eq(TBL_SALES_PROFORMA_HDR.SALES_PROFORMA_REF_NO, decodedId));

            // Replace detail lines
            await tx.delete(TBL_SALES_PROFORMA_DTL).where(eq(TBL_SALES_PROFORMA_DTL.SALES_PROFORMA_REF_NO, decodedId));
            if (items && items.length > 0) {
                const dValues: (typeof TBL_SALES_PROFORMA_DTL.$inferInsert)[] = items.map((item) => ({
                    SALES_PROFORMA_REF_NO: decodedId,
                    PRODUCT_ID: Number(item.productId),
                    MAIN_CATEGORY_ID: item.mainCategoryId ? Number(item.mainCategoryId) : null,
                    SUB_CATEGORY_ID: item.subCategoryId ? Number(item.subCategoryId) : null,
                    STORE_STOCK_PCS: item.storeStockPcs != null ? String(item.storeStockPcs) : null,
                    PO_REF_NO: item.poRefNo ?? null,
                    PO_DTL_SNO: item.poDtlSno ? Number(item.poDtlSno) : null,
                    PO_DTL_STOCK_QTY: item.poDtlStockQty != null ? String(item.poDtlStockQty) : null,
                    PURCHASE_RATE_PER_QTY: item.purchaseRatePerQty != null ? String(item.purchaseRatePerQty) : null,
                    PO_EXPENSE_AMOUNT: item.poExpenseAmount != null ? String(item.poExpenseAmount) : null,
                    SALES_RATE_PER_QTY: String(item.salesRatePerQty || 0),
                    QTY_PER_PACKING: String(item.qtyPerPacking || 0),
                    TOTAL_QTY: String(item.totalQty || 0),
                    UOM: item.uom,
                    TOTAL_PACKING: String(item.qtyPerPacking ? Number((item.totalQty / item.qtyPerPacking).toFixed(2)) : 0),
                    ALTERNATE_UOM: item.alternateUom ?? null,
                    TOTAL_PRODUCT_AMOUNT: String(item.totalProductAmount || 0),
                    VAT_PERCENTAGE: String(item.vatPercentage || 0),
                    VAT_AMOUNT: String(item.vatAmount || 0),
                    FINAL_SALES_AMOUNT: String(item.finalSalesAmount || 0),
                    TOTAL_PRODUCT_AMOUNT_LC: String((item.totalProductAmount || 0) * exchangeRate),
                    FINAL_SALES_AMOUNT_LC: String((item.finalSalesAmount || 0) * exchangeRate),
                    STATUS_ENTRY: "Active",
                    CREATED_BY: audit?.user || "admin",
                    CREATED_DATE: new Date(),
                    CREATED_MAC_ADDRESS: req.ip || "127.0.0.1",
                }));
                await tx.insert(TBL_SALES_PROFORMA_DTL).values(dValues);
            }

            // Replace file attachments
            await tx.delete(TBL_SALES_PROFORMA_FILES_UPLOAD).where(eq(TBL_SALES_PROFORMA_FILES_UPLOAD.SALES_PROFORMA_REF_NO, decodedId));
            if (req.body.files && req.body.files.length > 0) {
                const fValues = req.body.files.map((f: any) => ({
                    SALES_PROFORMA_REF_NO: decodedId,
                    DOCUMENT_TYPE: f.documentType,
                    DESCRIPTION_DETAILS: f.descriptionDetails,
                    FILE_NAME: f.fileName,
                    CONTENT_TYPE: f.contentType,
                    CONTENT_DATA: f.contentData ? Buffer.from(f.contentData, 'base64') : null,
                    REMARKS: f.remarks,
                    STATUS_MASTER: "Active",
                    CREATED_BY: audit?.user || "admin",
                    CREATED_DATE: new Date(),
                    CREATED_IP_ADDRESS: req.ip || "127.0.0.1",
                }));
                await tx.insert(TBL_SALES_PROFORMA_FILES_UPLOAD).values(fValues as any);
            }

            return { msg: "Sales Proforma updated successfully" };
        } catch (error) {
            console.error(error);
            tx.rollback();
            throw error;
        }
    });

    return res.status(200).json(transaction);
};

// ─── GENERATE PDF for Proforma ────────────────────────────────────────────────

export const getSalesProformaPdf = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const decodedId = decodeURIComponent(id as string);

        // Fetch header with joined master names
        const headerRows = await db.select({
            salesProformaRefNo: TBL_SALES_PROFORMA_HDR.SALES_PROFORMA_REF_NO,
            salesProformaDate: TBL_SALES_PROFORMA_HDR.SALES_PROFORMA_DATE,
            remarks: TBL_SALES_PROFORMA_HDR.REMARKS,
            customerName: TBL_CUSTOMER_MASTER.Customer_Name,
            customerAddress: TBL_CUSTOMER_MASTER.Address,
            companyName: TBL_COMPANY_MASTER.Company_Name,
            currencyName: TBL_CURRENCY_MASTER.CURRENCY_NAME,
        })
            .from(TBL_SALES_PROFORMA_HDR)
            .leftJoin(TBL_CUSTOMER_MASTER, eq(TBL_SALES_PROFORMA_HDR.CUSTOMER_ID, TBL_CUSTOMER_MASTER.Customer_Id))
            .leftJoin(TBL_COMPANY_MASTER, eq(TBL_SALES_PROFORMA_HDR.COMPANY_ID, TBL_COMPANY_MASTER.Company_Id))
            .leftJoin(TBL_CURRENCY_MASTER, eq(TBL_SALES_PROFORMA_HDR.CURRENCY_ID, TBL_CURRENCY_MASTER.CURRENCY_ID))
            .where(eq(TBL_SALES_PROFORMA_HDR.SALES_PROFORMA_REF_NO, decodedId))
            .limit(1);

        if (!headerRows.length) {
            res.status(404).json({ msg: "Sales Proforma not found" });
            return;
        }

        const hdr = headerRows[0];

        // Fetch line items with product names
        const dtlRows = await db.select({
            productName: TBL_PRODUCT_MASTER.PRODUCT_NAME,
            totalQty: TBL_SALES_PROFORMA_DTL.TOTAL_QTY,
            uom: TBL_SALES_PROFORMA_DTL.UOM,
            salesRatePerQty: TBL_SALES_PROFORMA_DTL.SALES_RATE_PER_QTY,
            vatPercentage: TBL_SALES_PROFORMA_DTL.VAT_PERCENTAGE,
        })
            .from(TBL_SALES_PROFORMA_DTL)
            .leftJoin(TBL_PRODUCT_MASTER, eq(TBL_SALES_PROFORMA_DTL.PRODUCT_ID, TBL_PRODUCT_MASTER.PRODUCT_ID))
            .where(eq(TBL_SALES_PROFORMA_DTL.SALES_PROFORMA_REF_NO, decodedId));

        const invoiceDate = hdr.salesProformaDate
            ? new Date(hdr.salesProformaDate).toLocaleDateString('en-GB')
            : new Date().toLocaleDateString('en-GB');

        const pdfBuffer = await generateInvoicePdf({
            companyName: hdr.companyName ?? "AgroManage",
            customerName: hdr.customerName ?? "Customer",
            customerAddress: hdr.customerAddress ?? "",
            date: invoiceDate,
            invoiceNo: hdr.salesProformaRefNo,
            notes: hdr.remarks ?? undefined,
            footerNote: "This is a Proforma Invoice — not a tax document.",
            items: dtlRows.map(row => ({
                productName: row.productName ?? "Unknown Product",
                quantity: Number(row.totalQty) || 0,
                uom: row.uom ?? "PCS",
                rate: Number(row.salesRatePerQty) || 0,
                vatPercent: Number(row.vatPercentage) || 0,
            })),
        });

        res.set({
            'Content-Type': 'application/pdf',
            'Content-Disposition': `inline; filename="Proforma_${decodedId}.pdf"`,
            'Content-Length': pdfBuffer.length.toString(),
        });
        res.send(pdfBuffer);
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: "Failed to generate proforma PDF" });
    }
};
