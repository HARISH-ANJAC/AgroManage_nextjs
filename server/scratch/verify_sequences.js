import pkg from 'pg';
const { Client } = pkg;
import dotenv from 'dotenv';
dotenv.config();

async function checkSequenceValues() {
    const client = new Client({
        connectionString: process.env.DATABASE_URL,
    });
    await client.connect();
    try {
        const tables = [
            { schema: 'stomaster', table: 'TBL_ACCOUNTS_LEDGER_MASTER', column: 'LEDGER_ID' },
            { schema: 'stoentries', table: 'TBL_PURCHASE_ORDER_HDR', column: 'SNO' }
        ];
        
        for (const t of tables) {
            const res = await client.query(`SELECT MAX("${t.column}") as max_val FROM "${t.schema}"."${t.table}";`);
            const maxVal = res.rows[0].max_val;
            
            const seqRes = await client.query(`SELECT last_value FROM pg_sequences WHERE schemaname = '${t.schema}' AND tablename = '${t.table}';`);
            const lastVal = seqRes.rows[0]?.last_value;
            
            console.log(`Table ${t.table}: Max=${maxVal}, Seq Last=${lastVal}`);
        }
    } catch (err) {
        console.error(err);
    } finally {
        await client.end();
    }
}

checkSequenceValues();
