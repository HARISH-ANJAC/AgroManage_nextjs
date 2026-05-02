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
        UPDATE stomaster."TBL_PROFIT_CENTER_MASTER"
        SET "PROFIT_CENTER_CODE" = 'PC-001', "PROFIT_CENTER_NAME" = 'Retail Sales', "MANAGER_NAME" = 'John Doe'
        WHERE "PROFIT_CENTER_ID" = 1;
        SELECT * FROM stomaster."TBL_PROFIT_CENTER_MASTER";
    `);
        console.log(JSON.stringify(res.rows, null, 2));
    } catch (err) {
        console.error(err);
    } finally {
        await client.end();
    }
}

inspectColumn();
