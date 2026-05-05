
import { db } from "./src/db/index.js";
import { TBL_ADDITIONAL_COST_TYPE_MASTER } from "./src/db/schema/StoMaster.js";

async function check() {
    try {
        console.log("Fetching additional cost types...");
        const data = await db.select().from(TBL_ADDITIONAL_COST_TYPE_MASTER);
        console.log("Data:", JSON.stringify(data, null, 2));
    } catch (e) {
        console.error("Error:", e);
    } finally {
        process.exit();
    }
}

check();
