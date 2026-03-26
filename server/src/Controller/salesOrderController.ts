import { Request, Response } from "express";
import { db } from "../db/index.js";
import { 
    TBL_SALES_ORDER_HDR, 
    TBL_SALES_ORDER_DTL 
} from "../db/schema/index.js";
import { eq } from "drizzle-orm";

export const getSalesOrders = async (req: Request, res: Response): Promise<Response> => {
    try {
        const data = await db.select().from(TBL_SALES_ORDER_HDR);
        return res.status(200).json(data);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ msg: "Internal server error" });
    }
};

export const getSalesOrderById = async (req: Request, res: Response): Promise<Response> => {
    try {
        const { id } = req.params;
        const header = await db.select().from(TBL_SALES_ORDER_HDR).where(eq(TBL_SALES_ORDER_HDR.SALES_ORDER_REF_NO, id as string)).limit(1);
        if (!header.length) return res.status(404).json({ msg: "Sales Order not found" });

        const items = await db.select().from(TBL_SALES_ORDER_DTL).where(eq(TBL_SALES_ORDER_DTL.SALES_ORDER_REF_NO, id as string));

        return res.status(200).json({
            header: header[0],
            items
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ msg: "Internal server error" });
    }
};

export const createSalesOrder = async (req: Request, res: Response): Promise<Response> => {
    const transaction = await db.transaction(async (tx) => {
        try {
            const { header, items, audit } = req.body;
            
            const hValues = {
                SALES_ORDER_REF_NO: header.salesOrderRefNo,
                SALES_ORDER_DATE: header.salesOrderDate ? new Date(header.salesOrderDate) : new Date(),
                COMPANY_ID: header.companyId,
                STORE_ID: header.storeId,
                CUSTOMER_ID: header.customerId,
                BILLING_LOCATION_ID: header.billingLocationId,
                SALES_PERSON_EMP_ID: header.salesPersonId,
                CREDIT_LIMIT_AMOUNT: header.creditLimitAmt,
                CREDIT_LIMIT_DAYS: header.creditLimitDays,
                OUTSTANDING_AMOUNT: header.outstandingAmt,
                CURRENCY_ID: header.currencyId,
                EXCHANGE_RATE: header.exchangeRate,
                TOTAL_PRODUCT_AMOUNT: header.totalProductAmount,
                VAT_AMOUNT: header.vatAmount,
                FINAL_SALES_AMOUNT: header.finalSalesAmount,
                STATUS_ENTRY: header.status || "Draft",
                REMARKS: header.remarks,
                CREATED_BY: audit?.user,
                CREATED_MAC_ADDRESS: req.ip || "127.0.0.1"
            };

            await tx.insert(TBL_SALES_ORDER_HDR).values(hValues as any);

            if (items && items.length > 0) {
                const dValues = items.map((item: any) => ({
                    SALES_ORDER_REF_NO: header.salesOrderRefNo,
                    PRODUCT_ID: item.productId,
                    TOTAL_QTY: item.totalQty,
                    SALES_RATE_PER_QTY: item.rate,
                    TOTAL_PRODUCT_AMOUNT: item.amount,
                    VAT_PERCENTAGE: item.vatPercent,
                    VAT_AMOUNT: item.vatAmount,
                    FINAL_SALES_AMOUNT: item.finalAmount,
                    CREATED_BY: audit?.user,
                    STATUS_ENTRY: "Active",
                    CREATED_MAC_ADDRESS: req.ip || "127.0.0.1"
                }));
                await tx.insert(TBL_SALES_ORDER_DTL).values(dValues as any);
            }

            return { msg: "Sales Order created successfully", salesOrderRefNo: header.salesOrderRefNo };
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
    const transaction = await db.transaction(async (tx) => {
        try {
            const { header, items, audit } = req.body;
            
            const hUpdates = {
                SALES_ORDER_DATE: header.salesOrderDate ? new Date(header.salesOrderDate) : undefined,
                TOTAL_PRODUCT_AMOUNT: header.totalProductAmount,
                VAT_AMOUNT: header.vatAmount,
                FINAL_SALES_AMOUNT: header.finalSalesAmount,
                STATUS_ENTRY: header.status,
                REMARKS: header.remarks,
                MODIFIED_BY: audit?.user,
                MODIFIED_MAC_ADDRESS: req.ip || "127.0.0.1"
            };

            await tx.update(TBL_SALES_ORDER_HDR).set(hUpdates as any).where(eq(TBL_SALES_ORDER_HDR.SALES_ORDER_REF_NO, id as string));

            await tx.delete(TBL_SALES_ORDER_DTL).where(eq(TBL_SALES_ORDER_DTL.SALES_ORDER_REF_NO, id as string));
            if (items && items.length > 0) {
                const dValues = items.map((item: any) => ({
                    SALES_ORDER_REF_NO: id as string,
                    PRODUCT_ID: item.productId,
                    TOTAL_QTY: item.totalQty,
                    SALES_RATE_PER_QTY: item.rate,
                    TOTAL_PRODUCT_AMOUNT: item.amount,
                    VAT_PERCENTAGE: item.vatPercent,
                    VAT_AMOUNT: item.vatAmount,
                    FINAL_SALES_AMOUNT: item.finalAmount,
                    CREATED_BY: audit?.user,
                    STATUS_ENTRY: "Active",
                    CREATED_MAC_ADDRESS: req.ip || "127.0.0.1"
                }));
                await tx.insert(TBL_SALES_ORDER_DTL).values(dValues as any);
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
