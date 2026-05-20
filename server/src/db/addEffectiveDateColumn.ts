import { sql } from "drizzle-orm";
import { db } from "./index.js";

async function main() {
  console.log("🔧 Adding EFFECTIVE_DATE column to TBL_EXCHANGE_RATE_MASTER...");
  try {
    // Use DO block so it's safe to run multiple times — no error if column already exists
    await db.execute(sql`
      DO $$
      BEGIN
        IF NOT EXISTS (
          SELECT 1
          FROM information_schema.columns
          WHERE table_schema = 'stomaster'
            AND table_name   = 'TBL_EXCHANGE_RATE_MASTER'
            AND column_name  = 'EFFECTIVE_DATE'
        ) THEN
          ALTER TABLE "stomaster"."TBL_EXCHANGE_RATE_MASTER"
            ADD COLUMN "EFFECTIVE_DATE" timestamp;
          RAISE NOTICE 'Column EFFECTIVE_DATE added successfully.';
        ELSE
          RAISE NOTICE 'Column EFFECTIVE_DATE already exists — skipping.';
        END IF;
      END
      $$;
    `);

    console.log("✅ Done. EFFECTIVE_DATE column is now present.");
    process.exit(0);
  } catch (err) {
    console.error("❌ Migration failed:", err);
    process.exit(1);
  }
}

main();
