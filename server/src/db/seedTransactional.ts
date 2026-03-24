import { db } from "./index.js";
import { eq } from "drizzle-orm";
import { 
    TBL_COMPANY_MASTER,
    TBL_STORE_MASTER,
    TBL_CURRENCY_MASTER,
    TBL_PRODUCT_MASTER,
    TBL_SUPPLIER_MASTER,
    TBL_CUSTOMER_MASTER,
    TBL_PAYMENT_TERM_MASTER,
    TBL_ACCOUNTS_HEAD_MASTER,
    TBL_SALES_PERSON_MASTER,
    TBL_BILLING_LOCATION_MASTER,
    TBL_ADDITIONAL_COST_TYPE_MASTER,
    TBL_PURCHASE_ORDER_HDR,
    TBL_PURCHASE_ORDER_DTL,
    TBL_SALES_ORDER_HDR,
    TBL_SALES_ORDER_DTL,
    TBL_EXPENSE_HDR,
    TBL_EXPENSE_DTL,
    TBL_GOODS_INWARD_GRN_HDR,
    TBL_GOODS_INWARD_GRN_DTL,
    TBL_TAX_INVOICE_HDR,
    TBL_TAX_INVOICE_DTL,
    TBL_CUSTOMER_RECEIPT_HDR,
    TBL_CUSTOMER_RECEIPT_INVOICE_DTL
} from "./schema/index.js";

async function seedTransactional() {
    console.log("🌱 Seeding Transactional Data...");

    try {
        // 1. Fetch required master IDs
        const companiesResult = await db.select().from(TBL_COMPANY_MASTER);
        const storesResult = await db.select().from(TBL_STORE_MASTER);
        const currenciesResult = await db.select().from(TBL_CURRENCY_MASTER);
        const productsResult = await db.select().from(TBL_PRODUCT_MASTER).limit(5);

        if (companiesResult.length === 0 || storesResult.length === 0 || productsResult.length === 0) {
            console.error("❌ Master data missing. Please run the main seed script first.");
            process.exit(1);
        }

        const compId = companiesResult[0].Company_Id;
        const storeId = storesResult[0].Store_Id;
        const tzsId = currenciesResult.find(c => c.CURRENCY_NAME === "TZS")?.CURRENCY_ID || 1;
        const usdId = currenciesResult.find(c => c.CURRENCY_NAME === "USD")?.CURRENCY_ID || 2;

        // 2. Additional Masters for Transactions
        console.log(" - Seeding Additional Masters...");
        
        await db.insert(TBL_SUPPLIER_MASTER).values([
            { Supplier_Name: "Global Agro Supplies", Supplier_Type: "International", Country_Id: 1, TIN_Number: "SUP-001", Status_Master: "Active", Created_User: "admin" },
            { Supplier_Name: "Local Farmers Coop", Supplier_Type: "Local", Country_Id: 1, TIN_Number: "SUP-002", Status_Master: "Active", Created_User: "admin" }
        ]).onConflictDoNothing();

        await db.insert(TBL_CUSTOMER_MASTER).values([
            { Customer_Name: "Superstore Mega Mart", TIN_Number: "CUST-001", Status_Master: "Active", Created_By: "admin" },
            { Customer_Name: "City Distribution Hub", TIN_Number: "CUST-002", Status_Master: "Active", Created_By: "admin" }
        ]).onConflictDoNothing();

        await db.insert(TBL_PAYMENT_TERM_MASTER).values([
            { PAYMENT_TERM_NAME: "Net 30", STATUS_ENTRY: "Active", CREATED_BY: "admin" },
            { PAYMENT_TERM_NAME: "Cash on Delivery", STATUS_ENTRY: "Active", CREATED_BY: "admin" }
        ]).onConflictDoNothing();

        await db.insert(TBL_ACCOUNTS_HEAD_MASTER).values([
            { ACCOUNT_HEAD_NAME: "Transportation", STATUS_ENTRY: "Active", CREATED_BY: "admin" },
            { ACCOUNT_HEAD_NAME: "Loading Services", STATUS_ENTRY: "Active", CREATED_BY: "admin" },
            { ACCOUNT_HEAD_NAME: "Warehouse Rent", STATUS_ENTRY: "Active", CREATED_BY: "admin" }
        ]).onConflictDoNothing();

        await db.insert(TBL_SALES_PERSON_MASTER).values([
            { PERSON_NAME: "John Salesman", STATUS_MASTER: "Active", CREATED_BY: "admin" }
        ]).onConflictDoNothing();

        await db.insert(TBL_ADDITIONAL_COST_TYPE_MASTER).values([
            { ADDITIONAL_COST_TYPE_NAME: "Freight", STATUS_ENTRY: "Active", CREATED_BY: "admin" },
            { ADDITIONAL_COST_TYPE_NAME: "Insurance", STATUS_ENTRY: "Active", CREATED_BY: "admin" }
        ]).onConflictDoNothing();

        // Fetch IDs after seeding (handling potential conflicts)
        const allSuppliers = await db.select().from(TBL_SUPPLIER_MASTER);
        const allCustomers = await db.select().from(TBL_CUSTOMER_MASTER);
        const allTerms = await db.select().from(TBL_PAYMENT_TERM_MASTER);
        const allAccHeads = await db.select().from(TBL_ACCOUNTS_HEAD_MASTER);
        const allSalesPersons = await db.select().from(TBL_SALES_PERSON_MASTER);

        const supplierId = allSuppliers[0].Supplier_Id;
        const customerId = allCustomers[0].Customer_Id;
        const termId = allTerms[0].PAYMENT_TERM_ID;
        const accHeadId = allAccHeads[0].ACCOUNT_HEAD_ID;
        const salesPersonId = allSalesPersons[0].Sales_Person_ID;

        // 3. Purchase Orders
        console.log(" - Seeding Purchase Orders...");
        const poRef = "PO/2024/001";
        await db.insert(TBL_PURCHASE_ORDER_HDR).values({
            PO_REF_NO: poRef,
            PO_DATE: new Date(),
            PURCHASE_TYPE: "Local Purchase",
            COMPANY_ID: compId,
            SUPPLIER_ID: supplierId,
            PO_STORE_ID: storeId,
            PAYMENT_TERM_ID: termId,
            CURRENCY_ID: usdId,
            FINAL_PURCHASE_HDR_AMOUNT: "10000.00",
            STATUS_ENTRY: "Approved",
            CREATED_BY: "system",
            CREATED_DATE: new Date()
        }).onConflictDoNothing();

        for (const prod of productsResult) {
            await db.insert(TBL_PURCHASE_ORDER_DTL).values({
                PO_REF_NO: poRef,
                PRODUCT_ID: prod.PRODUCT_ID,
                TOTAL_QTY: "100.00",
                UOM: prod.UOM || "KG",
                RATE_PER_QTY: "50.00",
                FINAL_PRODUCT_AMOUNT: "5000.00",
                STATUS_ENTRY: "Approved",
                CREATED_BY: "system",
                CREATED_DATE: new Date()
            }).onConflictDoNothing();
        }

        // 4. GRN (Goods Receipt)
        console.log(" - Seeding GRNs...");
        const grnRef = "GRN/2024/001";
        await db.insert(TBL_GOODS_INWARD_GRN_HDR).values({
            GRN_REF_NO: grnRef,
            GRN_DATE: new Date(),
            COMPANY_ID: compId,
            PO_REF_NO: poRef,
            GRN_STORE_ID: storeId,
            SUPPLIER_ID: supplierId,
            STATUS_ENTRY: "Received",
            CREATED_BY: "system",
            CREATED_DATE: new Date()
        }).onConflictDoNothing();

        const poDetails = await db.select().from(TBL_PURCHASE_ORDER_DTL).where(eq(TBL_PURCHASE_ORDER_DTL.PO_REF_NO, poRef));
        for (const detail of poDetails) {
            await db.insert(TBL_GOODS_INWARD_GRN_DTL).values({
                GRN_REF_NO: grnRef,
                PO_DTL_SNO: detail.SNO,
                PRODUCT_ID: detail.PRODUCT_ID,
                TOTAL_QTY: detail.TOTAL_QTY,
                UOM: detail.UOM,
                STATUS_ENTRY: "Received",
                CREATED_BY: "system",
                CREATED_DATE: new Date()
            }).onConflictDoNothing();
        }

        // 5. Sales Orders
        console.log(" - Seeding Sales Orders...");
        const soRef = "SO/2024/001";
        await db.insert(TBL_SALES_ORDER_HDR).values({
            SALES_ORDER_REF_NO: soRef,
            SALES_ORDER_DATE: new Date(),
            COMPANY_ID: compId,
            STORE_ID: storeId,
            CUSTOMER_ID: customerId,
            SALES_PERSON_EMP_ID: salesPersonId,
            CURRENCY_ID: tzsId,
            FINAL_SALES_AMOUNT: "25000000.00",
            STATUS_ENTRY: "Pending",
            CREATED_BY: "system",
            CREATED_DATE: new Date()
        }).onConflictDoNothing();

        await db.insert(TBL_SALES_ORDER_DTL).values({
            SALES_ORDER_REF_NO: soRef,
            PRODUCT_ID: productsResult[0].PRODUCT_ID,
            TOTAL_QTY: "50.00",
            SALES_RATE_PER_QTY: "120000.00",
            FINAL_SALES_AMOUNT: "6000000.00",
            STATUS_ENTRY: "Pending",
            CREATED_BY: "system",
            CREATED_DATE: new Date()
        }).onConflictDoNothing();

        // 6. Expenses
        console.log(" - Seeding Expenses...");
        const expRef = "EXP/2024/001";
        await db.insert(TBL_EXPENSE_HDR).values({
            EXPENSE_REF_NO: expRef,
            EXPENSE_DATE: new Date(),
            COMPANY_ID: compId,
            ACCOUNT_HEAD_ID: accHeadId,
            TOTAL_EXPENSE_AMOUNT: "150000.00",
            STATUS_ENTRY: "Approved",
            CREATED_BY: "system",
            CREATED_DATE: new Date()
        }).onConflictDoNothing();

        await db.insert(TBL_EXPENSE_DTL).values({
            EXPENSE_REF_NO: expRef,
            EXPENSE_AMOUNT: "150000.00",
            REMARKS: "Seeded transportation cost",
            STATUS_ENTRY: "Approved",
            CREATED_BY: "system",
            CREATED_DATE: new Date()
        }).onConflictDoNothing();

        // 7. Tax Invoices
        console.log(" - Seeding Tax Invoices...");
        const invRef = "INV/2024/001";
        await db.insert(TBL_TAX_INVOICE_HDR).values({
            TAX_INVOICE_REF_NO: invRef,
            INVOICE_DATE: new Date(),
            COMPANY_ID: compId,
            CUSTOMER_ID: customerId,
            CURRENCY_ID: tzsId,
            FINAL_SALES_AMOUNT: "6000000.00",
            STATUS_ENTRY: "Approved",
            CREATED_BY: "system",
            CREATED_DATE: new Date()
        }).onConflictDoNothing();

        await db.insert(TBL_TAX_INVOICE_DTL).values({
            TAX_INVOICE_REF_NO: invRef,
            PRODUCT_ID: productsResult[0].PRODUCT_ID,
            INVOICE_QTY: "50.00",
            FINAL_SALES_AMOUNT: "6000000.00",
            STATUS_ENTRY: "Approved",
            CREATED_BY: "system",
            CREATED_DATE: new Date()
        }).onConflictDoNothing();

        // 8. Customer Receipts
        console.log(" - Seeding Customer Receipts...");
        const recRef = "REC/2024/001";
        await db.insert(TBL_CUSTOMER_RECEIPT_HDR).values({
            RECEIPT_REF_NO: recRef,
            RECEIPT_DATE: new Date(),
            COMPANY_ID: compId,
            CUSTOMER_ID: customerId,
            CURRENCY_ID: tzsId,
            RECEIPT_AMOUNT: "2000000.00",
            STATUS_ENTRY: "Submitted",
            CREATED_BY: "system",
            CREATED_DATE: new Date()
        }).onConflictDoNothing();

        await db.insert(TBL_CUSTOMER_RECEIPT_INVOICE_DTL).values({
            RECEIPT_REF_NO: recRef,
            TAX_INVOICE_REF_NO: invRef,
            ACTUAL_INVOICE_AMOUNT: "6000000.00",
            ALREADY_PAID_AMOUNT: "0.00",
            OUTSTANDING_INVOICE_AMOUNT: "6000000.00",
            RECEIPT_INVOICE_ADJUST_AMOUNT: "2000000.00",
            STATUS_ENTRY: "Submitted",
            CREATED_BY: "system",
            CREATED_DATE: new Date()
        }).onConflictDoNothing();

        console.log("✅ Transactional seeding completed successfully!");
        process.exit(0);
    } catch (error) {
        console.error("❌ Seeding failed:", error);
        process.exit(1);
    }
}

seedTransactional();
