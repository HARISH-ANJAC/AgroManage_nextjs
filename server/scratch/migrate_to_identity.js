import pkg from 'pg';
const { Client } = pkg;
import dotenv from 'dotenv';
dotenv.config();

const configs = [
    // StoEntries
    { schema: 'stoentries', table: 'TBL_PURCHASE_ORDER_HDR', column: 'SNO' },
    { schema: 'stoentries', table: 'TBL_PURCHASE_ORDER_DTL', column: 'SNO' },
    { schema: 'stoentries', table: 'TBL_PURCHASE_ORDER_ADDITIONAL_COST_DETAILS', column: 'SNO' },
    { schema: 'stoentries', table: 'TBL_PURCHASE_ORDER_FILES_UPLOAD', column: 'SNO' },
    { schema: 'stoentries', table: 'TBL_PURCHASE_ORDER_CONVERSATION_DTL', column: 'SNO' },
    { schema: 'stoentries', table: 'TBL_GOODS_INWARD_GRN_HDR', column: 'SNO' },
    { schema: 'stoentries', table: 'TBL_GOODS_INWARD_GRN_DTL', column: 'SNO' },
    { schema: 'stoentries', table: 'TBL_PURCHASE_INVOICE_HDR', column: 'SNO' },
    { schema: 'stoentries', table: 'TBL_PURCHASE_INVOICE_DTL', column: 'SNO' },
    { schema: 'stoentries', table: 'TBL_PURCHASE_INVOICE_ADDITIONAL_COST_DETAILS', column: 'SNO' },
    { schema: 'stoentries', table: 'TBL_PURCHASE_INVOICE_FILES_UPLOAD', column: 'SNO' },
    { schema: 'stoentries', table: 'TBL_EXPENSE_HDR', column: 'SNO' },
    { schema: 'stoentries', table: 'TBL_EXPENSE_DTL', column: 'SNO' },
    { schema: 'stoentries', table: 'TBL_SALES_ORDER_HDR', column: 'SNO' },
    { schema: 'stoentries', table: 'TBL_SALES_ORDER_DTL', column: 'SNO' },
    { schema: 'stoentries', table: 'TBL_DELIVERY_NOTE_HDR', column: 'SNO' },
    { schema: 'stoentries', table: 'TBL_DELIVERY_NOTE_DTL', column: 'SNO' },
    { schema: 'stoentries', table: 'TBL_TAX_INVOICE_HDR', column: 'SNO' },
    { schema: 'stoentries', table: 'TBL_TAX_INVOICE_DTL', column: 'SNO' },
    { schema: 'stoentries', table: 'TBL_CUSTOMER_RECEIPT_HDR', column: 'SNO' },
    { schema: 'stoentries', table: 'TBL_CUSTOMER_RECEIPT_INVOICE_DTL', column: 'SNO' },
    { schema: 'stoentries', table: 'TBL_SALES_PROFORMA_HDR', column: 'SNO' },
    { schema: 'stoentries', table: 'TBL_SALES_PROFORMA_DTL', column: 'SNO' },
    { schema: 'stoentries', table: 'TBL_JOURNAL_HDR', column: 'SNO' },
    { schema: 'stoentries', table: 'TBL_JOURNAL_DTL', column: 'SNO' },
    { schema: 'stoentries', table: 'TBL_TRIAL_BALANCE_HDR', column: 'SNO' },
    { schema: 'stoentries', table: 'TBL_TRIAL_BALANCE_DTL', column: 'SNO' },
    
    // StoMaster
    { schema: 'stomaster', table: 'TBL_CUSTOMER_PAYMENT_MODE_MASTER', column: 'PAYMENT_MODE_ID' },
    { schema: 'stomaster', table: 'tbl_Billing_Location_Master', column: 'Billing_Location_Id' },
    { schema: 'stomaster', table: 'TBL_BANK_MASTER', column: 'BANK_ID' },
    { schema: 'stomaster', table: 'TBL_ROLE_MASTER', column: 'ROLE_ID' },
    { schema: 'stomaster', table: 'tbl_Department_Master', column: 'Department_Id' },
    { schema: 'stomaster', table: 'tbl_Employee_Master', column: 'Employee_Id' },
    { schema: 'stomaster', table: 'tbl_Tax_Master', column: 'Tax_Id' },
    { schema: 'stomaster', table: 'TBL_CURRENCY_MASTER', column: 'CURRENCY_ID' },
    { schema: 'stomaster', table: 'tbl_Company_Master', column: 'Company_Id' },
    { schema: 'stomaster', table: 'TBL_EXCHANGE_RATE_MASTER', column: 'SNO' },
    { schema: 'stomaster', table: 'TBL_USER_INFO_HDR', column: 'LOGIN_ID_USER_HDR' },
    { schema: 'stomaster', table: 'TBL_VAT_PERCENTAGE_SETTING', column: 'SNO' },
    { schema: 'stomaster', table: 'tbl_Location_Master', column: 'Location_Id' },
    { schema: 'stomaster', table: 'tbl_Store_Master', column: 'Store_Id' },
    { schema: 'stomaster', table: 'TBL_USER_TO_STORE_MAPPING', column: 'USER_TO_LOCATION_ID_USER_TO_ROLE' },
    { schema: 'stomaster', table: 'TBL_PAYMENT_MODE_MASTER', column: 'PAYMENT_MODE_ID' },
    { schema: 'stomaster', table: 'TBL_ADDITIONAL_COST_TYPE_MASTER', column: 'ADDITIONAL_COST_TYPE_ID' },
    { schema: 'stomaster', table: 'TBL_PAYMENT_TERM_MASTER', column: 'PAYMENT_TERM_ID' },
    { schema: 'stomaster', table: 'TBL_ACCOUNTS_LEDGER_GROUP_MASTER', column: 'LEDGER_GROUP_ID' },
    { schema: 'stomaster', table: 'TBL_ACCOUNTS_HEAD_MASTER', column: 'ACCOUNT_HEAD_ID' },
    { schema: 'stomaster', table: 'TBL_PRODUCT_MAIN_CATEGORY_MASTER', column: 'MAIN_CATEGORY_ID' },
    { schema: 'stomaster', table: 'TBL_PRODUCT_SUB_CATEGORY_MASTER', column: 'SUB_CATEGORY_ID' },
    { schema: 'stomaster', table: 'TBL_PRODUCT_MASTER', column: 'PRODUCT_ID' },
    { schema: 'stomaster', table: 'tbl_country_master', column: 'Country_Id' },
    { schema: 'stomaster', table: 'TBL_REGION_MASTER', column: 'REGION_ID' },
    { schema: 'stomaster', table: 'TBL_PRODUCT_OPENING_STOCK', column: 'SNO' },
    { schema: 'stomaster', table: 'tbl_field_hdr', column: 'field_id_fld_hdr' },
    { schema: 'stomaster', table: 'tbl_field_dtl', column: 'activity_id_fld_dtl' },
    { schema: 'stomaster', table: 'tbl_Product_Company_Main_Category_Mapping', column: 'Sno' },
    { schema: 'stomaster', table: 'tbl_Store_Product_Minimum_Stock', column: 'Sno' },
    { schema: 'stomaster', table: 'tbl_Supplier_Master', column: 'Supplier_Id' },
    { schema: 'stomaster', table: 'tbl_Company_Bank_Account_Master', column: 'Account_Id' },
    { schema: 'stomaster', table: 'tbl_Change_Password_Log', column: 'Sno' },
    { schema: 'stomaster', table: 'tbl_District_Master', column: 'District_id' },
    { schema: 'stomaster', table: 'tbl_Customer_Master', column: 'Customer_Id' },
    { schema: 'stomaster', table: 'tbl_Customer_Address_Details', column: 'Sno' },
    { schema: 'stomaster', table: 'TBL_CUSTOMER_COMPANY_WISE_BILLING_LOCATION_MAPPING', column: 'SNO' },
    { schema: 'stomaster', table: 'TBL_CUSTOMER_PRODUCT_VAT_PERCENTAGE_SETTINGS', column: 'SNO' },
    { schema: 'stomaster', table: 'tbl_Customer_Wise_Product_Price_Settings', column: 'Sno' },
    { schema: 'stomaster', table: 'tbl_Customer_Credit_Limit_Details', column: 'Sno' },
    { schema: 'stomaster', table: 'TBL_ACCOUNTS_LEDGER_MASTER', column: 'LEDGER_ID' },
    { schema: 'stomaster', table: 'TBL_SALES_PERSON_MASTER', column: 'Sales_Person_ID' },
    { schema: 'stomaster', table: 'TBL_SCHEDULER_SETTINGS', column: 'SNO' },
    { schema: 'stomaster', table: 'TBL_MULTI_CURRENCY_TRANSACTIONS', column: 'TRANSACTION_ID' },
    { schema: 'stomaster', table: 'TBL_EXCHANGE_RATE_USAGE_LOG', column: 'LOG_ID' },
    { schema: 'stomaster', table: 'TBL_UNREALIZED_GAIN_LOSS', column: 'GL_ID' },
    { schema: 'stomaster', table: 'TBL_REALIZED_GAIN_LOSS', column: 'GL_ID' },
    { schema: 'stomaster', table: 'TBL_COMPANY_BASE_CURRENCY', column: 'ID' },
];

async function migrateToIdentity() {
    const client = new Client({
        connectionString: process.env.DATABASE_URL,
    });
    await client.connect();
    try {
        // 0. Handle Rename
        try {
            await client.query(`ALTER TABLE "stoentries"."TBL_PURCHASE_ORDER_HDR" RENAME COLUMN "SUPLIER_PROFORMA_NUMBER" TO "SUPPLIER_PROFORMA_NUMBER";`);
            console.log("Renamed SUPLIER_PROFORMA_NUMBER to SUPPLIER_PROFORMA_NUMBER");
        } catch (e) {
            console.log("Rename failed or already done:", e.message);
        }

        for (const config of configs) {
            const { schema, table, column } = config;
            try {
                console.log(`Migrating ${schema}.${table}.${column} to identity...`);
                
                // 1. Drop existing default if it exists
                await client.query(`ALTER TABLE "${schema}"."${table}" ALTER COLUMN "${column}" DROP DEFAULT;`).catch(() => {});
                
                // 2. Add identity
                await client.query(`ALTER TABLE "${schema}"."${table}" ALTER COLUMN "${column}" ADD GENERATED ALWAYS AS IDENTITY;`);
                
                // 3. Sync sequence
                const maxRes = await client.query(`SELECT MAX("${column}") as max_val FROM "${schema}"."${table}";`);
                const maxVal = parseInt(maxRes.rows[0].max_val) || 0;
                await client.query(`ALTER TABLE "${schema}"."${table}" ALTER COLUMN "${column}" RESTART WITH ${maxVal + 1};`);
                
                console.log(`  Success. Next value: ${maxVal + 1}`);
            } catch (err) {
                console.error(`  Failed to migrate ${table}.${column}:`, err.message);
            }
        }
    } catch (err) {
        console.error("Migration error:", err);
    } finally {
        await client.end();
    }
}

migrateToIdentity();
