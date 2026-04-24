import { db } from "../src/db/index.js";
import { sql } from "drizzle-orm";

async function clearData() {
  console.log("🚀 Starting data clearing process...");

  const tablesToClear = [
    'stomaster."tbl_Company_Master"',
    'stomaster."tbl_Store_Master"',
    'stomaster."TBL_PRODUCT_MAIN_CATEGORY_MASTER"',
    'stomaster."TBL_PRODUCT_SUB_CATEGORY_MASTER"',
    'stomaster."TBL_PRODUCT_MASTER"',
    'stomaster."tbl_Supplier_Master"',
    'stomaster."tbl_Customer_Master"',
    'stomaster."tbl_Employee_Master"',
    'stomaster."TBL_SALES_PERSON_MASTER"'
  ];

  try {
    // We use CASCADE to ensure that dependent transaction records are also cleared
    // This is necessary because Master records are referenced by almost all transaction tables.
    for (const table of tablesToClear) {
      console.log(`🧹 Clearing table: ${table}...`);
      await db.execute(sql.raw(`TRUNCATE TABLE ${table} RESTART IDENTITY CASCADE;`));
    }

    console.log("✅ Successfully cleared all requested master tables and their dependent records.");
  } catch (error) {
    console.error("❌ Error clearing data:", error);
  } finally {
    process.exit();
  }
}

clearData();
