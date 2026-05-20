import pg from "pg";
const { Client } = pg;
import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.join(process.cwd(), ".env") });

async function removeDatabase() {
    const dbUrl = process.env.DATABASE_URL;
    if (!dbUrl) {
        console.error("❌ DATABASE_URL is not defined in .env file");
        process.exit(1);
    }

    // Extract database name and connection details
    const dbName = dbUrl.split("/").pop()?.split("?")[0];
    const baseUrl = dbUrl.substring(0, dbUrl.lastIndexOf("/"));
    
    if (!dbName) {
        console.error("❌ Could not extract database name from DATABASE_URL");
        process.exit(1);
    }

    // Connect to 'postgres' database to drop the target one
    const client = new Client({
        connectionString: `${baseUrl}/postgres`,
    });

    try {
        await client.connect();
        
        console.log(`⚠️  Attempting to drop database "${dbName}"...`);
        
        // Terminate other connections to the database to allow dropping
        await client.query(`
            SELECT pg_terminate_backend(pg_stat_activity.pid)
            FROM pg_stat_activity
            WHERE pg_stat_activity.datname = '${dbName}'
            AND pid <> pg_backend_pid();
        `);

        await client.query(`DROP DATABASE IF EXISTS "${dbName}"`);
        console.log(`✅ Database "${dbName}" removed successfully!`);
    } catch (error) {
        console.error("❌ Error removing database:", error);
        process.exit(1);
    } finally {
        await client.end();
    }
}

removeDatabase();
