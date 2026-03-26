import { db } from "./src/db/index.js";
import { TBL_GOODS_INWARD_GRN_HDR, TBL_GOODS_INWARD_GRN_DTL } from "./src/db/schema/index.js";
import { eq } from "drizzle-orm";

async function checkGrn() {
  const grnRef = "GRN/2026/03/001";
  console.log(`Checking ${grnRef}...`);
  
  const header = await db.select().from(TBL_GOODS_INWARD_GRN_HDR).where(eq(TBL_GOODS_INWARD_GRN_HDR.GRN_REF_NO, grnRef)).limit(1);
  if (!header.length) {
    console.log("GRN not found");
    process.exit(0);
  }
  
  const items = await db.select().from(TBL_GOODS_INWARD_GRN_DTL).where(eq(TBL_GOODS_INWARD_GRN_DTL.GRN_REF_NO, grnRef));
  console.log("GRN Header:", JSON.stringify(header[0], null, 2));
  console.log("GRN Items:", JSON.stringify(items, null, 2));
  
  process.exit(0);
}

checkGrn();
