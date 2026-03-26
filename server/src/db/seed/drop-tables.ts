import { db } from '../index.js';
import * as schema from '../schema/index.js';
import { sql } from 'drizzle-orm';
import { getTableConfig } from 'drizzle-orm/pg-core';

async function dropTables() {
  console.log('Dropping tables...');
  let droppedCount = 0;
  
  for (const [key, item] of Object.entries(schema)) {
    try {
        const config = getTableConfig(item as any);
        if (config && config.name) {
            const schemaName = config.schema || 'public';
            const fullName = `"${schemaName}"."${config.name}"`;
            console.log(`Dropping ${fullName}...`);
            await db.execute(sql.raw(`DROP TABLE IF EXISTS ${fullName} CASCADE`));
            droppedCount++;
        }
    } catch (e) {
        // Not a table, skip
    }
  }

  console.log(`Dropped ${droppedCount} tables successfully!`);
  process.exit(0);
}

dropTables().catch(err => {
  console.error(err);
  process.exit(1);
});
