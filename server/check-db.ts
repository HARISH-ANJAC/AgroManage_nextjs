import { db } from "./src/db/index.js";
import { sql } from "drizzle-orm";

async function checkDb() {
    try {
        console.log("Existing Schemas:");
        const schemas = await db.execute(sql`SELECT schema_name FROM information_schema.schemata`);
        console.log(JSON.stringify(schemas, null, 2));

        console.log("\nExisting Tables:");
        const tables = await db.execute(sql`SELECT table_schema, table_name FROM information_schema.tables WHERE table_schema NOT IN ('information_schema', 'pg_catalog')`);
        console.log(JSON.stringify(tables, null, 2));

    } catch (err) {
        console.error(err);
    } finally {
        process.exit(0);
    }
}

checkDb();
