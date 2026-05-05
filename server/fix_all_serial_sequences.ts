import pg from 'pg';
import 'dotenv/config';

/**
 * Comprehensive one-time fix script.
 *
 * PROBLEM: Many tables in stoentries/stomaster were created with old SERIAL
 * syntax (e.g., "SNO" SERIAL PRIMARY KEY). SERIAL auto-creates a sequence
 * named like "TableName_ColumnName_seq".
 *
 * Drizzle's schema now uses generatedAlwaysAsIdentity() which, when pushed,
 * tries to create PostgreSQL IDENTITY columns. This internally creates a new
 * sequence with the same name → conflict error 42P07.
 *
 * FIX (no data loss):
 * For each SERIAL column found, we:
 *   1. DROP the DEFAULT (nextval link) from the column
 *   2. ADD GENERATED ALWAYS AS IDENTITY (PostgreSQL native identity)
 *   3. Sync the new identity sequence's current value to avoid PK collisions
 *   4. DROP the old orphan SERIAL sequence
 *
 * This preserves ALL existing data.
 */

const SCHEMAS = ['stoentries', 'stomaster'];

interface SerialColumn {
  schema: string;
  table: string;
  column: string;
  seqSchema: string;
  seqName: string;
  currentMax: number;
}

async function fixAllSerialSequences() {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    console.error('DATABASE_URL is missing from .env');
    process.exit(1);
  }

  const client = new pg.Client({ connectionString });

  try {
    await client.connect();
    console.log('✅ Connected to database.\n');

    // -------------------------------------------------------------------
    // 1. Find all columns that still use old SERIAL-style nextval defaults
    // -------------------------------------------------------------------
    const findSerialsQuery = `
      SELECT
        n.nspname       AS schema,
        t.relname       AS table,
        a.attname       AS column,
        sn.nspname      AS seq_schema,
        s.relname       AS seq_name
      FROM pg_attribute a
      JOIN pg_class t ON t.oid = a.attrelid
      JOIN pg_namespace n ON n.oid = t.relnamespace
      JOIN pg_attrdef d ON d.adrelid = t.oid AND d.adnum = a.attnum
      -- Resolve the sequence referenced in the default expression
      JOIN pg_depend dep ON dep.objid = d.oid
        AND dep.classid = 'pg_attrdef'::regclass
        AND dep.deptype = 'n'
        AND dep.refclassid = 'pg_class'::regclass
      JOIN pg_class s ON s.oid = dep.refobjid AND s.relkind = 'S'
      JOIN pg_namespace sn ON sn.oid = s.relnamespace
      WHERE n.nspname = ANY($1)
        AND a.attgenerated = ''   -- NOT a generated column yet
      ORDER BY n.nspname, t.relname, a.attname;
    `;

    const { rows: serialCols } = await client.query<Omit<SerialColumn, 'currentMax'>>(
      findSerialsQuery,
      [SCHEMAS]
    );

    if (serialCols.length === 0) {
      console.log('✅ No SERIAL columns found. Nothing to fix — database is already in IDENTITY format.');
      process.exit(0);
    }

    console.log(`Found ${serialCols.length} SERIAL-style column(s) to convert:\n`);
    for (const col of serialCols) {
      console.log(`  [${col.schema}] "${col.table}"."${col.column}" → seq: ${col.seqSchema}."${col.seqName}"`);
    }
    console.log('');

    // -------------------------------------------------------------------
    // 2. Convert each column to GENERATED ALWAYS AS IDENTITY
    // -------------------------------------------------------------------
    let successCount = 0;
    let skipCount = 0;

    for (const col of serialCols) {
      const schemaQuoted  = `"${col.schema}"`;
      const tableQuoted   = `${schemaQuoted}."${col.table}"`;
      const columnQuoted  = `"${col.column}"`;
      const seqFull       = `"${col.seqSchema}"."${col.seqName}"`;

      console.log(`\n🔧 Converting ${tableQuoted}.${columnQuoted} ...`);

      try {
        // Get the current max value of the column so the new identity
        // sequence starts above it (prevents unique-key violations).
        const maxRes = await client.query(
          `SELECT COALESCE(MAX(${columnQuoted}), 0) AS maxval FROM ${tableQuoted}`
        );
        const maxVal: number = parseInt(maxRes.rows[0].maxval, 10);
        console.log(`   Current MAX(${col.column}) = ${maxVal}`);

        // Step A: Drop the SERIAL default so the column has no default at all.
        await client.query(
          `ALTER TABLE ${tableQuoted} ALTER COLUMN ${columnQuoted} DROP DEFAULT`
        );
        console.log(`   ✅ Dropped SERIAL default`);

        // Step B: Attach GENERATED ALWAYS AS IDENTITY with a start value
        // that safely exceeds any existing row value.
        const startWith = Math.max(maxVal + 1, 1);
        await client.query(
          `ALTER TABLE ${tableQuoted} ALTER COLUMN ${columnQuoted} ADD GENERATED ALWAYS AS IDENTITY (START WITH ${startWith})`
        );
        console.log(`   ✅ Added GENERATED ALWAYS AS IDENTITY (START WITH ${startWith})`);

        // Step C: Drop the now-orphaned old SERIAL sequence.
        // CASCADE is safe here because the DEFAULT link was already removed.
        await client.query(`DROP SEQUENCE IF EXISTS ${seqFull} CASCADE`);
        console.log(`   ✅ Dropped old sequence ${seqFull}`);

        successCount++;
      } catch (err: any) {
        console.warn(`   ⚠️  Skipped (${err.message})`);
        skipCount++;
      }
    }

    // -------------------------------------------------------------------
    // 3. Summary
    // -------------------------------------------------------------------
    console.log('\n' + '─'.repeat(60));
    console.log(`✅ Done! Converted: ${successCount}  |  Skipped: ${skipCount}`);
    console.log('\nYou can now run:  pnpm db:push');
    process.exit(0);

  } catch (err) {
    console.error('❌ Fatal error:', err);
    process.exit(1);
  } finally {
    await client.end();
  }
}

fixAllSerialSequences();
