
import { migrate } from "drizzle-orm/node-postgres/migrator";
import { db } from "./index.js";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function runMigration() {
    console.log("Starting migration...");
    try {
        await migrate(db, { migrationsFolder: path.join(__dirname, "../../drizzle") });
        console.log("Migration successful!");
        process.exit(0);
    } catch (error) {
        console.error("Migration failed:", error);
        process.exit(1);
    }
}

runMigration();
