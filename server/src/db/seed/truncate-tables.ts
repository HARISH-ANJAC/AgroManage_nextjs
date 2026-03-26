import { db } from '../index.js';
import * as schema from '../schema/index.js';
import { sql } from 'drizzle-orm';
import { getTableConfig } from 'drizzle-orm/pg-core';

async function truncateTables() {
  console.log('Truncating tables...');
  let truncatedCount = 0;
  
  for (const [key, item] of Object.entries(schema)) {
    try {
        const config = getTableConfig(item as any);
        if (config && config.name) {
            const schemaName = config.schema || 'public';
            const fullName = `"${schemaName}"."${config.name}"`;
            console.log(`Truncating ${fullName}...`);
            await db.execute(sql.raw(`TRUNCATE TABLE ${fullName} CASCADE`));
            truncatedCount++;
        }
    } catch (e) {
        // Not a table, skip
    }
  }

  console.log(`Truncated ${truncatedCount} tables successfully!`);
  process.exit(0);
}

truncateTables().catch(err => {
  console.error(err);
  process.exit(1);
});
