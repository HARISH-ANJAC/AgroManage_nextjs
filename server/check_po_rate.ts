import { db } from "./src/db/index.js";
import { TBL_PURCHASE_ORDER_DTL } from "./src/db/schema/index.js";
import { eq } from "drizzle-orm";

async function checkPo() {
  const poRef = "PO/YA/03/001";
  console.log(`Checking PO rate for ${poRef}...`);
  
  const items = await db.select().from(TBL_PURCHASE_ORDER_DTL).where(eq(TBL_PURCHASE_ORDER_DTL.PO_REF_NO, poRef));
  console.log("PO Items:", JSON.stringify(items, null, 2));
  
  process.exit(0);
}

checkPo();
