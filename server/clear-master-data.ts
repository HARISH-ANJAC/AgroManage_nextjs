import { db } from "./src/db/index.js";
import { 
    TBL_COMPANY_MASTER,
    TBL_STORE_MASTER,
    TBL_PRODUCT_MAIN_CATEGORY_MASTER,
    TBL_PRODUCT_SUB_CATEGORY_MASTER,
    TBL_PRODUCT_MASTER,
    TBL_SUPPLIER_MASTER,
    TBL_CUSTOMER_MASTER,
    TBL_EMPLOYEE_MASTER,
    TBL_SALES_PERSON_MASTER
} from "./src/db/schema/index.js";
import { getTableName, sql } from "drizzle-orm";

async function clearMasterData() {
    console.log("🧹 Starting master data cleanup...");
    
    // Ordered list for deletion (child tables first if not using CASCADE, 
    // but CASCADE is safer for complex schemas)
    const tables = [
        TBL_PRODUCT_MASTER,
        TBL_PRODUCT_SUB_CATEGORY_MASTER,
        TBL_PRODUCT_MAIN_CATEGORY_MASTER,
        TBL_STORE_MASTER,
        TBL_SUPPLIER_MASTER,
        TBL_CUSTOMER_MASTER,
        TBL_EMPLOYEE_MASTER,
        TBL_SALES_PERSON_MASTER,
        TBL_COMPANY_MASTER
    ];

    try {
        for (const table of tables) {
            const tableName = getTableName(table);
            const schemaName = (table as any).schema || 'public';
            
            console.log(`🗑️  Clearing ${tableName}...`);
            
            // Using Drizzle's sql template literal with the table object directly 
            // handles quoting and schemas correctly.
            await db.execute(sql`TRUNCATE TABLE ${table} RESTART IDENTITY CASCADE`);
        }
        
        console.log("\n✅ Master data cleared successfully!");
        process.exit(0);
    } catch (error) {
        console.error("\n❌ Error clearing master data:", error);
        process.exit(1);
    }
}

clearMasterData();
