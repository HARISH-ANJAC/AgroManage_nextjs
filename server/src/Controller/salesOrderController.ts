import { Request, Response } from "express";
import { db } from "../db/index.js";
import { TBL_SALES_ORDER_HDR, TBL_SALES_ORDER_DTL } from "../db/schema/index.js";
import { eq, desc } from "drizzle-orm";

/**
 * Get all Sales Orders
 */
export const getSalesOrders = async (req: Request, res: Response): Promise<Response> => {
    try {
        const data = await db.select().from(TBL_SALES_ORDER_HDR).orderBy(desc(TBL_SALES_ORDER_HDR.CREATED_DATE));
        return res.status(200).json(data);
    } catch (error: any) {
        console.error("Error fetching Sales Orders:", error);
        return res.status(500).json({ msg: error.message });
    }
};

/**
 * Create a new Sales Order
 */
export const createSalesOrder = async (req: Request, res: Response): Promise<Response> => {
    try {
        const { header: headerBody, items, audit: auditBody } = req.body;
        const header = headerBody || req.body;
        const audit = auditBody || req.body.audit;
        
        const createdBy = String(audit?.user || req.body.user || "system").substring(0, 50);
        const macAddress = String(audit?.macAddress || req.body.macAddress || "").substring(0, 50);

        await db.transaction(async (tx) => {
            // Insert Header
            await tx.insert(TBL_SALES_ORDER_HDR).values({
                SALES_ORDER_REF_NO: header.salesOrderRefNo,
                SALES_ORDER_DATE: header.salesOrderDate ? new Date(header.salesOrderDate) : new Date(),
                COMPANY_ID: header.companyId ? Number(header.companyId) : null,
                STORE_ID: header.storeId ? Number(header.storeId) : null,
                CUSTOMER_ID: header.customerId ? Number(header.customerId) : null,
                BILLING_LOCATION_ID: header.billingLocationId ? Number(header.billingLocationId) : null,
                SALES_PERSON_EMP_ID: header.salesPersonEmpId ? Number(header.salesPersonEmpId) : null,
                CREDIT_LIMIT_AMOUNT: header.creditLimitAmount?.toString(),
                CREDIT_LIMIT_DAYS: header.creditLimitDays?.toString(),
                OUTSTANDING_AMOUNT: header.outstandingAmount?.toString(),
                CURRENCY_ID: header.currencyId ? Number(header.currencyId) : null,
                EXCHANGE_RATE: header.exchangeRate?.toString(),
                TOTAL_PRODUCT_AMOUNT: header.totalProductAmount?.toString(),
                VAT_AMOUNT: header.vatAmount?.toString(),
                FINAL_SALES_AMOUNT: header.finalSalesAmount?.toString(),
                TOTAL_PRODUCT_AMOUNT_LC: header.totalProductAmountLc?.toString(),
                FINAL_SALES_AMOUNT_LC: header.finalSalesAmountLc?.toString(),
                REMARKS: header.remarks,
                STATUS_ENTRY: header.status || "Submitted",
                CREATED_BY: createdBy,
                CREATED_DATE: new Date(),
                CREATED_MAC_ADDRESS: macAddress,
            });

            // Insert Details
            if (items && Array.isArray(items)) {
                for (const item of items) {
                    await tx.insert(TBL_SALES_ORDER_DTL).values({
                        SALES_ORDER_REF_NO: header.salesOrderRefNo,
                        MAIN_CATEGORY_ID: item.mainCategoryId ? Number(item.mainCategoryId) : null,
                        SUB_CATEGORY_ID: item.subCategoryId ? Number(item.subCategoryId) : null,
                        PRODUCT_ID: item.productId ? Number(item.productId) : null,
                        STORE_STOCK_PCS: item.storeStockPcs?.toString(),
                        PO_REF_NO: item.poRefNo,
                        PO_DTL_SNO: item.poDtlSno ? Number(item.poDtlSno) : null,
                        PO_DTL_STOCK_QTY: item.poDtlStockQty?.toString(),
                        PURCHASE_RATE_PER_QTY: item.purchaseRatePerQty?.toString(),
                        PO_EXPENSE_AMOUNT: item.poExpenseAmount?.toString(),
                        SALES_RATE_PER_QTY: item.salesRatePerQty?.toString(),
                        QTY_PER_PACKING: item.qtyPerPacking?.toString(),
                        TOTAL_QTY: item.totalQty?.toString(),
                        UOM: item.uom,
                        TOTAL_PACKING: item.totalPacking?.toString(),
                        ALTERNATE_UOM: item.alternateUom,
                        TOTAL_PRODUCT_AMOUNT: item.totalProductAmount?.toString(),
                        VAT_PERCENTAGE: item.vatPercentage?.toString(),
                        VAT_AMOUNT: item.vatAmount?.toString(),
                        FINAL_SALES_AMOUNT: item.finalSalesAmount?.toString(),
                        TOTAL_PRODUCT_AMOUNT_LC: item.totalProductAmountLc?.toString(),
                        FINAL_SALES_AMOUNT_LC: item.finalSalesAmountLc?.toString(),
                        REMARKS: item.remarks,
                        STATUS_ENTRY: item.status || "Submitted",
                        CREATED_BY: createdBy,
                        CREATED_DATE: new Date(),
                        CREATED_MAC_ADDRESS: macAddress,
                    });
                }
            }
        });

        return res.status(201).json({ msg: "Sales Order created successfully" });
    } catch (error: any) {
        console.error("Error creating Sales Order:", error);
        return res.status(500).json({ msg: error.message });
    }
};

/**
 * Delete a Sales Order
 */
export const deleteSalesOrder = async (req: Request, res: Response): Promise<Response> => {
    try {
        const id = String(req.params.id);
        await db.transaction(async (tx) => {
            await tx.delete(TBL_SALES_ORDER_DTL).where(eq(TBL_SALES_ORDER_DTL.SALES_ORDER_REF_NO, id));
            await tx.delete(TBL_SALES_ORDER_HDR).where(eq(TBL_SALES_ORDER_HDR.SALES_ORDER_REF_NO, id));
        });
        return res.status(200).json({ msg: "Sales Order deleted successfully" });
    } catch (error: any) {
        console.error("Error deleting Sales Order:", error);
        return res.status(500).json({ msg: error.message });
    }
};
