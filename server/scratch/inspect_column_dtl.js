import pkg from 'pg';
const { Client } = pkg;
import dotenv from 'dotenv';
dotenv.config();

async function inspectColumn() {
    const client = new Client({
        connectionString: process.env.DATABASE_URL,
    });
    await client.connect();
    try {
        const res = await client.query(`
            SELECT column_name, data_type, is_identity, identity_generation
            FROM information_schema.columns 
            WHERE table_schema = 'stoentries' 
            AND table_name = 'TBL_SALES_ORDER_DTL' 
            AND column_name = 'SNO';
        `);
        console.log(JSON.stringify(res.rows, null, 2));
    } catch (err) {
        console.error(err);
    } finally {
        await client.end();
    }
}

inspectColumn();
