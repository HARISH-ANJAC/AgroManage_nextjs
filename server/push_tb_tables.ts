import pg from 'pg';
import 'dotenv/config';

async function pushNewTables() {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    console.error('DATABASE_URL is missing');
    process.exit(1);
  }

  const client = new pg.Client({ connectionString });
  
  try {
    await client.connect();
    console.log('Connected to database.');

    const createHdrSql = `
      CREATE TABLE IF NOT EXISTS stoentries."TBL_TRIAL_BALANCE_HDR" (
        "SNO" SERIAL NOT NULL,
        "TB_REF_NO" varchar(50) PRIMARY KEY NOT NULL,
        "AS_OF_DATE" timestamp NOT NULL,
        "COMPANY_ID" integer REFERENCES stomaster."tbl_Company_Master"("Company_Id"),
        "FINANCIAL_YEAR" varchar(50),
        "TOTAL_DEBIT" numeric(30, 2) DEFAULT '0',
        "TOTAL_CREDIT" numeric(30, 2) DEFAULT '0',
        "STATUS_ENTRY" varchar(20),
        "CREATED_BY" varchar(50),
        "CREATED_DATE" timestamp DEFAULT now(),
        "CREATED_IP_ADDRESS" varchar(50),
        "MODIFIED_BY" varchar(50),
        "MODIFIED_DATE" timestamp,
        "MODIFIED_IP_ADDRESS" varchar(50)
      );
    `;

    const createDtlSql = `
      CREATE TABLE IF NOT EXISTS stoentries."TBL_TRIAL_BALANCE_DTL" (
        "SNO" SERIAL PRIMARY KEY NOT NULL,
        "TB_REF_NO" varchar(50) REFERENCES stoentries."TBL_TRIAL_BALANCE_HDR"("TB_REF_NO"),
        "LEDGER_ID" integer REFERENCES stomaster."TBL_ACCOUNTS_LEDGER_MASTER"("LEDGER_ID"),
        "OPENING_DEBIT" numeric(30, 2) DEFAULT '0',
        "OPENING_CREDIT" numeric(30, 2) DEFAULT '0',
        "PERIOD_DEBIT" numeric(30, 2) DEFAULT '0',
        "PERIOD_CREDIT" numeric(30, 2) DEFAULT '0',
        "CLOSING_DEBIT" numeric(30, 2) DEFAULT '0',
        "CLOSING_CREDIT" numeric(30, 2) DEFAULT '0',
        "REMARKS" varchar(255)
      );
    `;

    console.log('Creating TBL_TRIAL_BALANCE_HDR...');
    await client.query(createHdrSql);
    
    console.log('Creating TBL_TRIAL_BALANCE_DTL...');
    await client.query(createDtlSql);
    
    console.log('Tables created successfully!');
    process.exit(0);
  } catch (err) {
    console.error('Error creating tables:', err);
    process.exit(1);
  } finally {
    await client.end();
  }
}

pushNewTables();
