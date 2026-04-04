import { sql } from "drizzle-orm";
import { db } from "./index.js";

async function main() {
  console.log("Fixing missing TBL_SALES_ORDER_HDR column...");
  try {
    // We add the column to TBL_SALES_ORDER_HDR
    // We omit NOT NULL to accommodate any existing data, our ts-logic will enforce it anyway or we can drop existing data.
    await db.execute(sql`
      ALTER TABLE "stoentries"."TBL_SALES_ORDER_HDR" ADD COLUMN IF NOT EXISTS "SALES_PROFORMA_REF_NO" varchar(50);
    `);
    console.log("Added SALES_PROFORMA_REF_NO column to TBL_SALES_ORDER_HDR!");

    await db.execute(sql`
      ALTER TABLE "stoentries"."TBL_SALES_ORDER_HDR" ADD CONSTRAINT "TBL_SALES_ORDER_HDR_SALES_PROFORMA_REF_NO_fk" FOREIGN KEY ("SALES_PROFORMA_REF_NO") REFERENCES "stoentries"."TBL_SALES_PROFORMA_HDR"("SALES_PROFORMA_REF_NO") ON DELETE no action ON UPDATE no action;
    `);
    console.log("Added foreign key constraint!");

    console.log("Sales Order DB updates are successful!");
    process.exit(0);
  } catch (err) {
    console.warn("Notice: ", err);
    process.exit(0);
  }
}

main();
