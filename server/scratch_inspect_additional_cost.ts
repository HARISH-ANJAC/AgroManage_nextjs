import pg from 'pg';
import 'dotenv/config';

async function inspectTable() {
  const client = new pg.Client({ connectionString: process.env.DATABASE_URL });
  await client.connect();
  console.log('Connected to database.');

  // 1. Inspect table columns and default/identity status
  const columnsRes = await client.query(`
    SELECT 
      column_name, 
      data_type, 
      column_default, 
      is_identity, 
      identity_generation
    FROM information_schema.columns 
    WHERE table_schema = 'stomaster' AND table_name = 'TBL_ADDITIONAL_COST_TYPE_MASTER';
  `);
  console.log('--- Columns ---');
  console.log(columnsRes.rows);

  // 2. Inspect sequences in stomaster schema
  const seqRes = await client.query(`
    SELECT c.relname AS sequence_name
    FROM pg_class c
    JOIN pg_namespace n ON n.oid = c.relnamespace
    WHERE n.nspname = 'stomaster' AND c.relkind = 'S';
  `);
  console.log('--- Sequences ---');
  console.log(seqRes.rows);

  // 3. Inspect sequence dependencies
  const depRes = await client.query(`
    SELECT 
      d.refobjid::regclass AS table_name,
      a.attname AS column_name,
      c.relname AS sequence_name
    FROM pg_depend d
    JOIN pg_attribute a ON a.attrelid = d.refobjid AND a.attnum = d.refobjsubid
    JOIN pg_class c ON c.oid = d.objid
    WHERE c.relkind = 'S' 
      AND d.refobjid::regclass::text LIKE '%TBL_ADDITIONAL_COST_TYPE_MASTER%';
  `);
  console.log('--- Sequence Dependencies ---');
  console.log(depRes.rows);

  await client.end();
}

inspectTable().catch(console.error);
