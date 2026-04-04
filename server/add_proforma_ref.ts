import { db } from "./src/db/index.js";
import { sql } from "drizzle-orm";

async function main() {
    try {
        console.log("Checking if SALES_PROFORMA_REF_NO exists in TBL_SALES_ORDER_HDR...");
        await db.execute(sql`
            ALTER TABLE stoentries."TBL_SALES_ORDER_HDR" 
            ADD COLUMN "SALES_PROFORMA_REF_NO" character varying(50);
        `);
        console.log("Added SALES_PROFORMA_REF_NO column successfully!");
    } catch (e: any) {
        if (e.message && e.message.includes('already exists')) {
            console.log("Column already exists, skipping.");
        } else {
            console.error("Error modifying schema:", e);
        }
    }
    process.exit(0);
}
main();
