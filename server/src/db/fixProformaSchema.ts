import { sql } from "drizzle-orm";
import { db } from "./index.js";

async function main() {
  console.log("Fixing missing PROFORMA schemas...");
  try {
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS "stoentries"."TBL_SALES_PROFORMA_HDR" (
        "SNO" serial4 NOT NULL,
        "SALES_PROFORMA_REF_NO" varchar(50) NOT NULL PRIMARY KEY,
        "SALES_PROFORMA_DATE" timestamp,
        "COMPANY_ID" int4,
        "STORE_ID" int4,
        "CUSTOMER_ID" int4,
        "BILLING_LOCATION_ID" int4,
        "SALES_PERSON_EMP_ID" int4,
        "CURRENCY_ID" int4,
        "EXCHANGE_RATE" numeric(15, 2),
        "TOTAL_PRODUCT_AMOUNT" numeric(15, 4),
        "VAT_AMOUNT" numeric(15, 4),
        "FINAL_SALES_AMOUNT" numeric(15, 4),
        "TOTAL_PRODUCT_AMOUNT_LC" numeric(15, 4),
        "FINAL_SALES_AMOUNT_LC" numeric(15, 4),
        "REMARKS" varchar(2000),
        "TEST_DESC" varchar(50),
        "STATUS_ENTRY" varchar(20),
        "CREATED_BY" varchar(50),
        "CREATED_DATE" timestamp,
        "CREATED_MAC_ADDRESS" varchar(50),
        "MODIFIED_BY" varchar(50),
        "MODIFIED_DATE" timestamp,
        "MODIFIED_MAC_ADDRESS" varchar(50),
        "SUBMITTED_BY" varchar(50),
        "SUBMITTED_DATE" timestamp
      );
    `);
    console.log("Created TBL_SALES_PROFORMA_HDR");

    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS "stoentries"."TBL_SALES_PROFORMA_DTL" (
        "SNO" serial4 NOT NULL PRIMARY KEY,
        "SALES_PROFORMA_REF_NO" varchar(50),
        "MAIN_CATEGORY_ID" int4,
        "SUB_CATEGORY_ID" int4,
        "PRODUCT_ID" int4,
        "STORE_STOCK_PCS" numeric(15, 4),
        "PO_REF_NO" varchar(50),
        "PO_DTL_SNO" int4,
        "PO_DTL_STOCK_QTY" numeric(15, 4),
        "PURCHASE_RATE_PER_QTY" numeric(15, 6),
        "PO_EXPENSE_AMOUNT" numeric(15, 4),
        "SALES_RATE_PER_QTY" numeric(15, 6),
        "QTY_PER_PACKING" numeric(15, 2),
        "TOTAL_QTY" numeric(15, 4),
        "UOM" varchar(50),
        "TOTAL_PACKING" numeric(15, 4),
        "ALTERNATE_UOM" varchar(500),
        "TOTAL_PRODUCT_AMOUNT" numeric(15, 4),
        "VAT_PERCENTAGE" numeric(15, 2),
        "VAT_AMOUNT" numeric(15, 4),
        "FINAL_SALES_AMOUNT" numeric(15, 4),
        "TOTAL_PRODUCT_AMOUNT_LC" numeric(15, 4),
        "FINAL_SALES_AMOUNT_LC" numeric(15, 4),
        "REMARKS" varchar(2000),
        "STATUS_ENTRY" varchar(20),
        "CREATED_BY" varchar(50),
        "CREATED_DATE" timestamp,
        "CREATED_MAC_ADDRESS" varchar(50),
        "MODIFIED_BY" varchar(50),
        "MODIFIED_DATE" timestamp,
        "MODIFIED_MAC_ADDRESS" varchar(50)
      );
    `);
    console.log("Created TBL_SALES_PROFORMA_DTL");

    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS "stoentries"."TBL_SALES_PROFORMA_FILES_UPLOAD" (
        "SNO" serial4 NOT NULL PRIMARY KEY,
        "SALES_PROFORMA_REF_NO" varchar(50),
        "DOCUMENT_TYPE" varchar(50),
        "DESCRIPTION_DETAILS" varchar(100),
        "FILE_NAME" varchar(150),
        "CONTENT_TYPE" varchar(50),
        "CONTENT_DATA" bytea,
        "REMARKS" varchar(1000),
        "STATUS_MASTER" varchar(20),
        "CREATED_BY" varchar(50),
        "CREATED_DATE" timestamp,
        "CREATED_IP_ADDRESS" varchar(50),
        "MODIFIED_BY" varchar(50),
        "MODIFIED_DATE" timestamp,
        "MODIFIED_IP_ADDRESS" varchar(50)
      );
    `);
    console.log("Created TBL_SALES_PROFORMA_FILES_UPLOAD");

    console.log("Tables successfully created!");
    process.exit(0);
  } catch (err) {
    console.error("Migration fix error:", err);
    process.exit(1);
  }
}

main();
