import pg from 'pg';
import 'dotenv/config';

/**
 * One-time fix script.
 * 
 * PROBLEM: TBL_TRIAL_BALANCE_HDR and TBL_TRIAL_BALANCE_DTL were previously
 * created manually (push_tb_tables.ts) using SERIAL syntax, which creates a
 * sequence named "TBL_TRIAL_BALANCE_HDR_SNO_seq".
 * 
 * Drizzle's db:push/migrate now tries to create the same tables using
 * GENERATED ALWAYS AS IDENTITY, which conflicts with the existing sequence.
 * 
 * FIX: Drop both tables (and their sequences) so Drizzle can recreate them.
 * Only safe to run if these tables have no important data.
 */
async function fixTbTables() {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    console.error('DATABASE_URL is missing from .env');
    process.exit(1);
  }

  const client = new pg.Client({ connectionString });

  try {
    await client.connect();
    console.log('✅ Connected to database.');

    // Check if tables exist and show row counts before dropping
    const hdrCountRes = await client.query(`
      SELECT COUNT(*) as count FROM stoentries."TBL_TRIAL_BALANCE_HDR"
    `).catch(() => null);

    const dtlCountRes = await client.query(`
      SELECT COUNT(*) as count FROM stoentries."TBL_TRIAL_BALANCE_DTL"
    `).catch(() => null);

    if (hdrCountRes) {
      console.log(`ℹ️  TBL_TRIAL_BALANCE_HDR has ${hdrCountRes.rows[0].count} rows`);
    } else {
      console.log('ℹ️  TBL_TRIAL_BALANCE_HDR does not exist yet');
    }

    if (dtlCountRes) {
      console.log(`ℹ️  TBL_TRIAL_BALANCE_DTL has ${dtlCountRes.rows[0].count} rows`);
    } else {
      console.log('ℹ️  TBL_TRIAL_BALANCE_DTL does not exist yet');
    }

    // Drop DTL first (child table, foreign key to HDR)
    console.log('\n🗑️  Dropping TBL_TRIAL_BALANCE_DTL...');
    await client.query(`DROP TABLE IF EXISTS stoentries."TBL_TRIAL_BALANCE_DTL" CASCADE;`);
    console.log('   ✅ Done.');

    // Drop HDR (parent table) — CASCADE removes any dependent sequences/constraints
    console.log('🗑️  Dropping TBL_TRIAL_BALANCE_HDR...');
    await client.query(`DROP TABLE IF EXISTS stoentries."TBL_TRIAL_BALANCE_HDR" CASCADE;`);
    console.log('   ✅ Done.');

    // Also drop the orphan sequence if it still exists
    const seqCheck = await client.query(`
      SELECT sequencename FROM pg_sequences
      WHERE schemaname = 'stoentries'
      AND sequencename LIKE '%TBL_TRIAL_BALANCE%';
    `);

    if (seqCheck.rows.length > 0) {
      for (const row of seqCheck.rows) {
        console.log(`🗑️  Dropping orphan sequence: ${row.sequencename}`);
        await client.query(`DROP SEQUENCE IF EXISTS stoentries."${row.sequencename}" CASCADE;`);
        console.log('   ✅ Done.');
      }
    } else {
      console.log('ℹ️  No orphan sequences found.');
    }

    console.log('\n✅ Fix complete! Now run: pnpm db:push  (or pnpm db:migrate)');
    process.exit(0);
  } catch (err) {
    console.error('❌ Error:', err);
    process.exit(1);
  } finally {
    await client.end();
  }
}

fixTbTables();
