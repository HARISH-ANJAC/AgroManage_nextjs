import pg from 'pg';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config();

async function run() {
    const client = new pg.Client({
        connectionString: process.env.DATABASE_URL,
    });

    await client.connect();
    console.log("Connected to database");

    try {
        const sql = fs.readFileSync('./drizzle/0005_typical_wildside.sql', 'utf8');
        const statements = sql.split('--> statement-breakpoint');

        for (const statement of statements) {
            if (statement.trim()) {
                console.log(`Executing: ${statement.substring(0, 50)}...`);
                await client.query(statement).catch(e => {
                    if (e.message.includes('already exists')) {
                        console.log('Skipping (already exists)');
                    } else {
                        throw e;
                    }
                });
            }
        }
        
        console.log("Multi-currency tables created/verified successfully");
        
    } catch (err) {
        console.error("Error during manual fix:", err);
    } finally {
        await client.end();
    }
}

run();
