import postgres from 'pg';
import dotenv from 'dotenv';
const { Client } = postgres;
dotenv.config();

async function createDepartmentTable() {
    console.log("Connecting to Database at: " + process.env.DATABASE_URL.split('@')[1]); // Log safely
    const client = new Client({
        connectionString: process.env.DATABASE_URL,
        connectionTimeoutMillis: 30000 // Give Railway 30 seconds to wake up
    });

    try {
        await client.connect();
        console.log("✅ Successfully connected to Postgres.");

        // Execute exactly what Drizzle mapped out for Department Master
        const query = `
            CREATE TABLE IF NOT EXISTS "stomaster"."tbl_Department_Master" (
                "Department_Id" serial PRIMARY KEY NOT NULL,
                "Department_Name" varchar(100),
                "Department_Description" varchar(200),
                "Remarks" varchar(1000),
                "Status_Master" varchar(20),
                "Created_By" varchar(50),
                "Created_Date" timestamp,
                "Created_Mac_Address" varchar(50),
                "Modified_By" varchar(50),
                "Modified_Date" timestamp,
                "Modified_Mac_Address" varchar(50),
                CONSTRAINT "tbl_Department_Master_Department_Name_unique" UNIQUE("Department_Name")
            );
        `;
        
        console.log("⏳ Pushing Department Table to schema...");
        await client.query(query);
        console.log("\n================================================");
        console.log("✅ tbl_Department_Master PUSHED SUCCESSFULLY! ");
        console.log("================================================\n");

        console.log("Checking if table is active...");
        const res = await client.query(`SELECT table_name FROM information_schema.tables WHERE table_schema = 'stomaster' AND table_name = 'tbl_Department_Master';`);
        if (res.rows.length > 0) {
            console.log("✔️ Verified: Table exists in remote database.");
        }

    } catch (e) {
        console.error("\n❌ DATABASE ERROR:", e.message);
        console.log("\nSince this is Railway, it might have timed out while proxying. Try running this script again.");
    } finally {
        await client.end();
    }
}

createDepartmentTable();
