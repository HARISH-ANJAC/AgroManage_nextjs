import { db } from './src/db/index.js';
import { TBL_USER_INFO_HDR } from './src/db/schema/index.js';

async function checkUsers() {
  try {
    const users = await db.select().from(TBL_USER_INFO_HDR);
    console.log('Current users in DB:', users);
    process.exit(0);
  } catch (err) {
    console.error('Error checking users:', err);
    process.exit(1);
  }
}

checkUsers();
