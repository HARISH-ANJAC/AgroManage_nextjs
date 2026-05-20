import pg from "pg";
const { Client } = pg;
import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.join(process.cwd(), ".env") });

async function createDatabase() {
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

    // Connect to 'postgres' database to create the new one
    const client = new Client({
        connectionString: `${baseUrl}/postgres`,
    });

    try {
        await client.connect();
        
        console.log(`🔍 Checking if database "${dbName}" exists...`);
        const res = await client.query(`SELECT 1 FROM pg_database WHERE datname = '${dbName}'`);
        
        if (res.rowCount === 0) {
            console.log(`🏗️  Creating database "${dbName}"...`);
            await client.query(`CREATE DATABASE "${dbName}"`);
            console.log(`✅ Database "${dbName}" created successfully!`);
        } else {
            console.log(`ℹ️  Database "${dbName}" already exists.`);
        }
    } catch (error) {
        console.error("❌ Error creating database:", error);
        process.exit(1);
    } finally {
        await client.end();
    }
}

createDatabase();
