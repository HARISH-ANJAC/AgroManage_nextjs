import { Pool } from 'pg';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.join(process.cwd(), '.env') });

const pool = new Pool({
  connectionString: process.env.DATABASE_URL
});

async function fix() {
  const client = await pool.connect();
  try {
    console.log("Finding and dropping foreign key constraints on TBL_SALES_PROFORMA_DTL and TBL_SALES_ORDER_DTL...");
    
    const tables = ['TBL_SALES_PROFORMA_DTL', 'TBL_SALES_ORDER_DTL'];
    
    for (const table of tables) {
      console.log(`Checking table: ${table}`);
      const findConstraints = `
        SELECT constraint_name 
        FROM information_schema.key_column_usage 
        WHERE table_name = '${table}' 
        AND (column_name = 'PO_REF_NO' OR column_name = 'PO_DTL_SNO')
        AND table_schema = 'stoentries';
      `;
      
      const res = await client.query(findConstraints);
      console.log(`Found ${res.rows.length} constraints to drop for ${table}.`);
      
      for (const row of res.rows) {
        const dropQuery = `ALTER TABLE "stoentries"."${table}" DROP CONSTRAINT "${row.constraint_name}"`;
        console.log(`Executing: ${dropQuery}`);
        await client.query(dropQuery);
      }
    }
    
    console.log("Cleanup complete.");
  } catch (err) {
    console.error("Error during cleanup:", err);
  } finally {
    client.release();
    await pool.end();
  }
}

fix();
