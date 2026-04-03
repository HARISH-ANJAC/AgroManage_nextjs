import { Request, Response } from "express";
import { db } from "../db/index.js";
import {
    TBL_SALES_ORDER_HDR,
    TBL_SALES_ORDER_DTL,
    TBL_SALES_ORDER_FILES_UPLOAD,
    TBL_PRODUCT_MASTER,
    TBL_CUSTOMER_MASTER,
    TBL_STORE_MASTER,
    TBL_COMPANY_MASTER
} from "../db/schema/index.js";
import { eq, like, desc, getTableColumns } from "drizzle-orm";

interface SalesOrderHeader {
    salesOrderRefNo?: string;
    salesOrderDate?: string;
    companyId: number;
    storeId: number;
    customerId: number;
    billingLocationId: number;
    salesPersonId: number;
    creditLimitAmt: number;
    creditLimitDays: number;
    outstandingAmt: number;
    currencyId: number;
    exchangeRate: number;
    productAmount: number;
    totalVatAmount: number;
    finalAmount: number;
    status: string;
    remarks: string;
}

interface SalesOrderItem {
    productId: number;
    totalQty: number;
    rate: number;
    amount: number;
    vatPercent: number;
    vatAmount: number;
    finalAmount: number;
    uom: string;
    qtyPerPack: number;
    mainCategoryId: number;
    subCategoryId: number;
    poRefNo?: string;
    poDtlSno?: number;
}

export const getSalesOrders = async (req: Request, res: Response): Promise<Response> => {
    try {
        const data = await db.select({
            id: TBL_SALES_ORDER_HDR.SNO,
            salesOrderRefNo: TBL_SALES_ORDER_HDR.SALES_ORDER_REF_NO,
            salesOrderDate: TBL_SALES_ORDER_HDR.SALES_ORDER_DATE,
            companyId: TBL_SALES_ORDER_HDR.COMPANY_ID,
            storeId: TBL_SALES_ORDER_HDR.STORE_ID,
            customerId: TBL_SALES_ORDER_HDR.CUSTOMER_ID,
            billingLocationId: TBL_SALES_ORDER_HDR.BILLING_LOCATION_ID,
            salesPersonId: TBL_SALES_ORDER_HDR.SALES_PERSON_EMP_ID,
            creditLimitAmt: TBL_SALES_ORDER_HDR.CREDIT_LIMIT_AMOUNT,
            creditLimitDays: TBL_SALES_ORDER_HDR.CREDIT_LIMIT_DAYS,
            outstandingAmt: TBL_SALES_ORDER_HDR.OUTSTANDING_AMOUNT,
            currencyId: TBL_SALES_ORDER_HDR.CURRENCY_ID,
            exchangeRate: TBL_SALES_ORDER_HDR.EXCHANGE_RATE,
            totalProductAmount: TBL_SALES_ORDER_HDR.TOTAL_PRODUCT_AMOUNT,
            vatAmount: TBL_SALES_ORDER_HDR.VAT_AMOUNT,
            finalSalesAmount: TBL_SALES_ORDER_HDR.FINAL_SALES_AMOUNT,
            totalProductAmountLC: TBL_SALES_ORDER_HDR.TOTAL_PRODUCT_AMOUNT_LC,
            finalSalesAmountLC: TBL_SALES_ORDER_HDR.FINAL_SALES_AMOUNT_LC,
            remarks: TBL_SALES_ORDER_HDR.REMARKS,
            status: TBL_SALES_ORDER_HDR.STATUS_ENTRY,
            customerName: TBL_CUSTOMER_MASTER.Customer_Name,
            storeName: TBL_STORE_MASTER.Store_Name,
            companyName: TBL_COMPANY_MASTER.Company_Name
        })
            .from(TBL_SALES_ORDER_HDR)
            .leftJoin(TBL_CUSTOMER_MASTER, eq(TBL_SALES_ORDER_HDR.CUSTOMER_ID, TBL_CUSTOMER_MASTER.Customer_Id))
            .leftJoin(TBL_STORE_MASTER, eq(TBL_SALES_ORDER_HDR.STORE_ID, TBL_STORE_MASTER.Store_Id))
            .leftJoin(TBL_COMPANY_MASTER, eq(TBL_SALES_ORDER_HDR.COMPANY_ID, TBL_COMPANY_MASTER.Company_Id))
            .orderBy(desc(TBL_SALES_ORDER_HDR.CREATED_DATE));

        return res.status(200).json(data);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ msg: "Internal server error" });
    }
};

export const getSalesOrderById = async (req: Request, res: Response): Promise<Response> => {
    try {
        const { id } = req.params;
        const decodedId = decodeURIComponent(id as string);

        // Fetch Header with joined names
        const headerResult = await db.select({
            id: TBL_SALES_ORDER_HDR.SNO,
            salesOrderRefNo: TBL_SALES_ORDER_HDR.SALES_ORDER_REF_NO,
            salesOrderDate: TBL_SALES_ORDER_HDR.SALES_ORDER_DATE,
            companyId: TBL_SALES_ORDER_HDR.COMPANY_ID,
            storeId: TBL_SALES_ORDER_HDR.STORE_ID,
            customerId: TBL_SALES_ORDER_HDR.CUSTOMER_ID,
            billingLocationId: TBL_SALES_ORDER_HDR.BILLING_LOCATION_ID,
            salesPersonId: TBL_SALES_ORDER_HDR.SALES_PERSON_EMP_ID,
            creditLimitAmt: TBL_SALES_ORDER_HDR.CREDIT_LIMIT_AMOUNT,
            creditLimitDays: TBL_SALES_ORDER_HDR.CREDIT_LIMIT_DAYS,
            outstandingAmt: TBL_SALES_ORDER_HDR.OUTSTANDING_AMOUNT,
            currencyId: TBL_SALES_ORDER_HDR.CURRENCY_ID,
            exchangeRate: TBL_SALES_ORDER_HDR.EXCHANGE_RATE,
            totalProductAmount: TBL_SALES_ORDER_HDR.TOTAL_PRODUCT_AMOUNT,
            vatAmount: TBL_SALES_ORDER_HDR.VAT_AMOUNT,
            finalSalesAmount: TBL_SALES_ORDER_HDR.FINAL_SALES_AMOUNT,
            totalProductAmountLC: TBL_SALES_ORDER_HDR.TOTAL_PRODUCT_AMOUNT_LC,
            finalSalesAmountLC: TBL_SALES_ORDER_HDR.FINAL_SALES_AMOUNT_LC,
            remarks: TBL_SALES_ORDER_HDR.REMARKS,
            status: TBL_SALES_ORDER_HDR.STATUS_ENTRY,
            customerName: TBL_CUSTOMER_MASTER.Customer_Name,
            storeName: TBL_STORE_MASTER.Store_Name
        })
            .from(TBL_SALES_ORDER_HDR)
            .leftJoin(TBL_CUSTOMER_MASTER, eq(TBL_SALES_ORDER_HDR.CUSTOMER_ID, TBL_CUSTOMER_MASTER.Customer_Id))
            .leftJoin(TBL_STORE_MASTER, eq(TBL_SALES_ORDER_HDR.STORE_ID, TBL_STORE_MASTER.Store_Id))
            .where(eq(TBL_SALES_ORDER_HDR.SALES_ORDER_REF_NO, decodedId))
            .limit(1);

        if (!headerResult.length) return res.status(404).json({ msg: "Sales Order not found" });

        // Fetch Items with camelCase mapping
        const items = await db.select({
            id: TBL_SALES_ORDER_DTL.SNO,
            salesOrderRefNo: TBL_SALES_ORDER_DTL.SALES_ORDER_REF_NO,
            productId: TBL_SALES_ORDER_DTL.PRODUCT_ID,
            productName: TBL_PRODUCT_MASTER.PRODUCT_NAME,
            mainCategoryId: TBL_SALES_ORDER_DTL.MAIN_CATEGORY_ID,
            subCategoryId: TBL_SALES_ORDER_DTL.SUB_CATEGORY_ID,
            qtyPerPacking: TBL_SALES_ORDER_DTL.QTY_PER_PACKING,
            totalQty: TBL_SALES_ORDER_DTL.TOTAL_QTY,
            uom: TBL_SALES_ORDER_DTL.UOM,
            rate: TBL_SALES_ORDER_DTL.SALES_RATE_PER_QTY,
            vatPercent: TBL_SALES_ORDER_DTL.VAT_PERCENTAGE,
            vatAmount: TBL_SALES_ORDER_DTL.VAT_AMOUNT,
            amount: TBL_SALES_ORDER_DTL.FINAL_SALES_AMOUNT,
            poRefNo: TBL_SALES_ORDER_DTL.PO_REF_NO,
            poDtlSno: TBL_SALES_ORDER_DTL.PO_DTL_SNO
        })
            .from(TBL_SALES_ORDER_DTL)
            .leftJoin(TBL_PRODUCT_MASTER, eq(TBL_SALES_ORDER_DTL.PRODUCT_ID, TBL_PRODUCT_MASTER.PRODUCT_ID))
            .where(eq(TBL_SALES_ORDER_DTL.SALES_ORDER_REF_NO, decodedId));

        const filesData = await db.select().from(TBL_SALES_ORDER_FILES_UPLOAD).where(eq(TBL_SALES_ORDER_FILES_UPLOAD.SALES_ORDER_REF_NO, decodedId));
        const processedFiles = filesData.map(f => ({
            ...f,
            CONTENT_DATA: f.CONTENT_DATA ? f.CONTENT_DATA.toString('base64') : null
        }));

        return res.status(200).json({
            header: headerResult[0],
            items,
            files: processedFiles
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ msg: "Internal server error" });
    }
};

export const createSalesOrder = async (req: Request, res: Response): Promise<Response> => {
    const transaction = await db.transaction(async (tx) => {
        try {
            const { header, items, audit } = req.body as { header: SalesOrderHeader, items: SalesOrderItem[], audit: any };

            let finalRefNo = header.salesOrderRefNo;

            // Auto-generate Ref if not provided or to ensure uniqueness
            if (!finalRefNo || finalRefNo.startsWith("TEMP-")) {
                const now = new Date();
                const mStr = (now.getMonth() + 1).toString().padStart(2, '0');
                const searchPrefix = `SO/MA/${mStr}/%`;

                const latest = await tx.select({ ref: TBL_SALES_ORDER_HDR.SALES_ORDER_REF_NO })
                    .from(TBL_SALES_ORDER_HDR)
                    .where(like(TBL_SALES_ORDER_HDR.SALES_ORDER_REF_NO, searchPrefix))
                    .orderBy(desc(TBL_SALES_ORDER_HDR.SALES_ORDER_REF_NO))
                    .limit(1);

                let nextSeq = 1;
                if (latest.length > 0 && latest[0].ref) {
                    const parts = latest[0].ref.split('/');
                    if (parts.length === 4) {
                        nextSeq = parseInt(parts[3], 10) + 1;
                    }
                }
                finalRefNo = `SO/MA/${mStr}/${nextSeq.toString().padStart(3, '0')}`;
            }

            const hValues: typeof TBL_SALES_ORDER_HDR.$inferInsert = {
                SALES_ORDER_REF_NO: finalRefNo,
                SALES_ORDER_DATE: header.salesOrderDate ? new Date(header.salesOrderDate) : new Date(),
                COMPANY_ID: Number(header.companyId),
                STORE_ID: Number(header.storeId),
                CUSTOMER_ID: Number(header.customerId),
                BILLING_LOCATION_ID: Number(header.billingLocationId),
                SALES_PERSON_EMP_ID: Number(header.salesPersonId),
                CREDIT_LIMIT_AMOUNT: String(header.creditLimitAmt || 0),
                CREDIT_LIMIT_DAYS: String(header.creditLimitDays || 0),
                OUTSTANDING_AMOUNT: String(header.outstandingAmt || 0),
                CURRENCY_ID: Number(header.currencyId),
                EXCHANGE_RATE: String(header.exchangeRate || 1),
                TOTAL_PRODUCT_AMOUNT: String(header.productAmount || 0),
                VAT_AMOUNT: String(header.totalVatAmount || 0),
                FINAL_SALES_AMOUNT: String(header.finalAmount || 0),
                TOTAL_PRODUCT_AMOUNT_LC: String((header.productAmount || 0) * (header.exchangeRate || 1)),
                FINAL_SALES_AMOUNT_LC: String((header.finalAmount || 0) * (header.exchangeRate || 1)),
                STATUS_ENTRY: header.status || "Draft",
                REMARKS: header.remarks,
                CREATED_BY: audit?.user || "admin",
                CREATED_DATE: new Date(),
                CREATED_MAC_ADDRESS: req.ip || "127.0.0.1",
                SUBMITTED_BY: header.status === "Confirmed" ? audit?.user : null,
                SUBMITTED_DATE: header.status === "Confirmed" ? new Date() : null
            };

            await tx.insert(TBL_SALES_ORDER_HDR).values(hValues);

            if (items && items.length > 0) {
                const dValues: (typeof TBL_SALES_ORDER_DTL.$inferInsert)[] = items.map((item) => ({
                    SALES_ORDER_REF_NO: finalRefNo,
                    PRODUCT_ID: Number(item.productId),
                    TOTAL_QTY: String(item.totalQty || 0),
                    SALES_RATE_PER_QTY: String(item.rate || 0),
                    TOTAL_PRODUCT_AMOUNT: String(item.amount || 0),
                    VAT_PERCENTAGE: String(item.vatPercent || 0),
                    VAT_AMOUNT: String(item.vatAmount || 0),
                    FINAL_SALES_AMOUNT: String(item.finalAmount || 0),
                    TOTAL_PRODUCT_AMOUNT_LC: String((item.amount || 0) * (header.exchangeRate || 1)),
                    FINAL_SALES_AMOUNT_LC: String((item.finalAmount || 0) * (header.exchangeRate || 1)),
                    UOM: item.uom,
                    QTY_PER_PACKING: String(item.qtyPerPack || 0),
                    TOTAL_PACKING: String(item.qtyPerPack ? Number((item.totalQty / item.qtyPerPack).toFixed(2)) : 0),
                    MAIN_CATEGORY_ID: item.mainCategoryId ? Number(item.mainCategoryId) : null,
                    SUB_CATEGORY_ID: item.subCategoryId ? Number(item.subCategoryId) : null,
                    PO_REF_NO: item.poRefNo,
                    PO_DTL_SNO: item.poDtlSno ? Number(item.poDtlSno) : null,
                    STATUS_ENTRY: "Active",
                    CREATED_BY: audit?.user || "admin",
                    CREATED_DATE: new Date(),
                    CREATED_MAC_ADDRESS: req.ip || "127.0.0.1"
                }));
                await tx.insert(TBL_SALES_ORDER_DTL).values(dValues);
            }

            if (req.body.files && req.body.files.length > 0) {
                const fValues = req.body.files.map((f: any) => ({
                    SALES_ORDER_REF_NO: finalRefNo,
                    DOCUMENT_TYPE: f.documentType,
                    DESCRIPTION_DETAILS: f.descriptionDetails,
                    FILE_NAME: f.fileName,
                    CONTENT_TYPE: f.contentType,
                    CONTENT_DATA: f.contentData ? Buffer.from(f.contentData, 'base64') : null,
                    REMARKS: f.remarks,
                    STATUS_MASTER: "Active",
                    CREATED_BY: audit?.user || "admin",
                    CREATED_DATE: new Date(),
                    CREATED_MAC_ADDRESS: req.ip || "127.0.0.1"
                }));
                await tx.insert(TBL_SALES_ORDER_FILES_UPLOAD).values(fValues as any);
            }

            return { msg: "Sales Order created successfully", salesOrderRefNo: finalRefNo };
        } catch (error: any) {
            console.error(error);
            tx.rollback();
            throw error;
        }
    });

    return res.status(201).json(transaction);
};

export const updateSalesOrder = async (req: Request, res: Response): Promise<Response> => {
    const { id } = req.params;
    const decodedId = decodeURIComponent(id as string);
    const transaction = await db.transaction(async (tx) => {
        try {
            const { header, items, audit } = req.body as { header: SalesOrderHeader, items: SalesOrderItem[], audit: any };

            const hUpdates: Partial<typeof TBL_SALES_ORDER_HDR.$inferInsert> = {
                SALES_ORDER_DATE: header.salesOrderDate ? new Date(header.salesOrderDate) : undefined,
                COMPANY_ID: Number(header.companyId),
                STORE_ID: Number(header.storeId),
                CUSTOMER_ID: Number(header.customerId),
                BILLING_LOCATION_ID: Number(header.billingLocationId),
                SALES_PERSON_EMP_ID: Number(header.salesPersonId),
                CREDIT_LIMIT_AMOUNT: String(header.creditLimitAmt),
                CREDIT_LIMIT_DAYS: String(header.creditLimitDays),
                OUTSTANDING_AMOUNT: String(header.outstandingAmt),
                CURRENCY_ID: Number(header.currencyId),
                EXCHANGE_RATE: String(header.exchangeRate),
                TOTAL_PRODUCT_AMOUNT: String(header.productAmount),
                VAT_AMOUNT: String(header.totalVatAmount),
                FINAL_SALES_AMOUNT: String(header.finalAmount),
                TOTAL_PRODUCT_AMOUNT_LC: String((header.productAmount || 0) * (header.exchangeRate || 1)),
                FINAL_SALES_AMOUNT_LC: String((header.finalAmount || 0) * (header.exchangeRate || 1)),
                STATUS_ENTRY: header.status,
                REMARKS: header.remarks,
                MODIFIED_BY: audit?.user || "admin",
                MODIFIED_DATE: new Date(),
                MODIFIED_MAC_ADDRESS: req.ip || "127.0.0.1"
            };

            await tx.update(TBL_SALES_ORDER_HDR).set(hUpdates).where(eq(TBL_SALES_ORDER_HDR.SALES_ORDER_REF_NO, decodedId));

            await tx.delete(TBL_SALES_ORDER_DTL).where(eq(TBL_SALES_ORDER_DTL.SALES_ORDER_REF_NO, decodedId));
            if (items && items.length > 0) {
                const dValues: (typeof TBL_SALES_ORDER_DTL.$inferInsert)[] = items.map((item) => ({
                    SALES_ORDER_REF_NO: decodedId,
                    PRODUCT_ID: Number(item.productId),
                    TOTAL_QTY: String(item.totalQty || 0),
                    SALES_RATE_PER_QTY: String(item.rate || 0),
                    TOTAL_PRODUCT_AMOUNT: String(item.amount || 0),
                    VAT_PERCENTAGE: String(item.vatPercent || 0),
                    VAT_AMOUNT: String(item.vatAmount || 0),
                    FINAL_SALES_AMOUNT: String(item.finalAmount || 0),
                    TOTAL_PRODUCT_AMOUNT_LC: String((item.amount || 0) * (header.exchangeRate || 1)),
                    FINAL_SALES_AMOUNT_LC: String((item.finalAmount || 0) * (header.exchangeRate || 1)),
                    UOM: item.uom,
                    QTY_PER_PACKING: String(item.qtyPerPack || 0),
                    TOTAL_PACKING: String(item.qtyPerPack ? Number((item.totalQty / item.qtyPerPack).toFixed(2)) : 0),
                    MAIN_CATEGORY_ID: item.mainCategoryId ? Number(item.mainCategoryId) : null,
                    SUB_CATEGORY_ID: item.subCategoryId ? Number(item.subCategoryId) : null,
                    PO_REF_NO: item.poRefNo,
                    PO_DTL_SNO: item.poDtlSno ? Number(item.poDtlSno) : null,
                    STATUS_ENTRY: "Active",
                    CREATED_BY: audit?.user || "admin",
                    CREATED_DATE: new Date(),
                    CREATED_MAC_ADDRESS: req.ip || "127.0.0.1"
                }));
                await tx.insert(TBL_SALES_ORDER_DTL).values(dValues);
            }

            await tx.delete(TBL_SALES_ORDER_FILES_UPLOAD).where(eq(TBL_SALES_ORDER_FILES_UPLOAD.SALES_ORDER_REF_NO, decodedId));
            if (req.body.files && req.body.files.length > 0) {
                const fValues = req.body.files.map((f: any) => ({
                    SALES_ORDER_REF_NO: decodedId,
                    DOCUMENT_TYPE: f.documentType,
                    DESCRIPTION_DETAILS: f.descriptionDetails,
                    FILE_NAME: f.fileName,
                    CONTENT_TYPE: f.contentType,
                    CONTENT_DATA: f.contentData ? Buffer.from(f.contentData, 'base64') : null,
                    REMARKS: f.remarks,
                    STATUS_MASTER: "Active",
                    CREATED_BY: audit?.user || "admin",
                    CREATED_DATE: new Date(),
                    CREATED_MAC_ADDRESS: req.ip || "127.0.0.1"
                }));
                await tx.insert(TBL_SALES_ORDER_FILES_UPLOAD).values(fValues as any);
            }

            return { msg: "Sales Order updated successfully" };
        } catch (error) {
            console.error(error);
            tx.rollback();
            throw error;
        }
    });

    return res.status(200).json(transaction);
};

