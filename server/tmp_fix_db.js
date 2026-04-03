import pg from "pg";
const { Client } = pg;

const client = new Client({
  connectionString: "postgresql://postgres:root@localhost:5432/agrobusiness"
});

async function run() {
  try {
    await client.connect();
    console.log("Connected to database.");

    const sequences = [
      'stomaster."CUSTOMER_CREDIT_LIMIT_FILE_UPLOAD_SNO_seq"',
      'stomaster."TBL_CUSTOMER_MASTER_FILES_UPLOAD_SNO_seq"',
      'stoentries."TBL_EXPENSE_FILES_UPLOAD_SNO_seq"',
      'stoentries."TBL_SALES_ORDER_FILES_UPLOAD_SNO_seq"',
      'stoentries."TBL_DELIVERY_FILES_UPLOAD_SNO_seq"',
      'stoentries."TBL_TAX_INVOICE_FILES_UPLOAD_SNO_seq"',
      'stoentries."TBL_CUSTOMER_RECEIPT_FILES_UPLOAD_SNO_seq"',
      'stoentries."TBL_GOODS_FILES_UPLOAD_SNO_seq"'
    ];

    for (const seq of sequences) {
      console.log(`Attempting to drop sequence: ${seq}`);
      try {
        await client.query(`DROP SEQUENCE IF EXISTS ${seq} CASCADE;`);
        console.log(`Success: Dropped ${seq}`);
      } catch (e) {
        console.warn(`Failed or already dropped: ${seq}`, e.message);
      }
    }

  } catch (err) {
    console.error("Connection error:", err);
  } finally {
    await client.end();
  }
}

run();
