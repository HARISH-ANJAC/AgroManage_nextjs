import pg from 'pg';
import 'dotenv/config';

/**
 * Fix script: Revert identity columns back to plain integer,
 * then Drizzle db:push will create them correctly from scratch.
 *
 * Safe: no data is deleted. The column values are preserved.
 * After this runs, immediately run: pnpm db:push
 */
const SCHEMAS = ['stoentries', 'stomaster'];

async function revertIdentity() {
  const client = new pg.Client({ connectionString: process.env.DATABASE_URL });
  await client.connect();
  console.log('✅ Connected.\n');

  // Find all GENERATED ALWAYS AS IDENTITY columns in our schemas
  const { rows } = await client.query<{ schema: string; table: string; column: string }>(`
    SELECT n.nspname AS schema, c.relname AS table, a.attname AS column
    FROM pg_attribute a
    JOIN pg_class c ON c.oid = a.attrelid
    JOIN pg_namespace n ON n.oid = c.relnamespace
    WHERE n.nspname = ANY($1)
      AND a.attidentity IN ('a', 'd')  -- 'a'=ALWAYS, 'd'=BY DEFAULT
      AND a.attnum > 0
      AND NOT a.attisdropped
    ORDER BY n.nspname, c.relname, a.attname
  `, [SCHEMAS]);

  console.log(`Found ${rows.length} IDENTITY column(s) to revert.\n`);

  let ok = 0, fail = 0;
  for (const row of rows) {
    const tbl = `"${row.schema}"."${row.table}"`;
    const col = `"${row.column}"`;
    try {
      // DROP IDENTITY also drops the associated sequence automatically
      await client.query(`ALTER TABLE ${tbl} ALTER COLUMN ${col} DROP IDENTITY IF EXISTS`);
      console.log(`✅ ${tbl}.${col} → plain integer`);
      ok++;
    } catch (e: any) {
      console.warn(`⚠️  ${tbl}.${col}: ${e.message}`);
      fail++;
    }
  }

  console.log(`\n─────────────────────────────────────────`);
  console.log(`Done. Reverted: ${ok}  |  Failed: ${fail}`);
  console.log(`\nNow run:  pnpm db:push`);
  await client.end();
}

revertIdentity().catch(e => { console.error(e); process.exit(1); });
