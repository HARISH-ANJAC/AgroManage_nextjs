import pg from 'pg';
import dotenv from 'dotenv';
import path from 'path';

import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables from the server directory
dotenv.config({ path: path.join(__dirname, '../.env') });

async function migrate() {
    const pool = new pg.Pool({ 
        connectionString: process.env.DATABASE_URL,
        ssl: { rejectUnauthorized: false } // Required for Railway/External Postgres
    });

    try {
        console.log("🚀 Starting Employee Master Migration...");

        // 1. Create table if not exists (including the new Card_Id column)
        console.log("Step 1: Ensuring tbl_Employee_Master exists with correct schema...");
        await pool.query(`
            CREATE TABLE IF NOT EXISTS "stomaster"."tbl_Employee_Master" (
                "Employee_Id" serial PRIMARY KEY,
                "Card_Id" varchar(50),
                "Name" varchar(150) NOT NULL,
                "Role" varchar(100),
                "Department" integer REFERENCES "stomaster"."tbl_Department_Master"("Department_Id"),
                "Phone" varchar(50),
                "Email" varchar(150),
                "Remarks" varchar(1000),
                "Status_Master" varchar(20) DEFAULT 'Active',
                "Created_By" varchar(50),
                "Created_Date" timestamp DEFAULT CURRENT_TIMESTAMP,
                "Created_Mac_Address" varchar(50),
                "Modified_By" varchar(50),
                "Modified_Date" timestamp,
                "Modified_Mac_Address" varchar(50)
            )
        `);

        // 2. Add Card_Id if it was missing (for existing tables)
        console.log("Step 2: Checking for Card_Id column...");
        await pool.query(`
            ALTER TABLE "stomaster"."tbl_Employee_Master" 
            ADD COLUMN IF NOT EXISTS "Card_Id" varchar(50)
        `);

        console.log("✅ Migration completed successfully!");
    } catch (error) {
        console.error("❌ Migration failed:");
        console.error(error);
        process.exit(1);
    } finally {
        await pool.end();
    }
}

migrate();
