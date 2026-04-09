import { db } from "./index.js";
import { TBL_TAX_INVOICE_HDR, TBL_COMPANY_MASTER, TBL_STORE_MASTER, TBL_CUSTOMER_MASTER } from "./schema/index.js";
import { eq, desc } from "drizzle-orm";

async function run() {
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
    console.log("Success:", data);
  } catch (err) {
    console.error("ERROR running query:", err);
  }
  process.exit(0);
}

run();
