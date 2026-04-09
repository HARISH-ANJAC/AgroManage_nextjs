import { db } from "./index.js";
import { TBL_TAX_INVOICE_HDR } from "./schema/index.js";

async function run() {
  const data = await db.select().from(TBL_TAX_INVOICE_HDR);
  console.log("Tax Invoices in DB:", data);
  process.exit(0);
}

run();
