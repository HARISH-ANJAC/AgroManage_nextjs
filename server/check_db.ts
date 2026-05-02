import pg from 'pg';
import 'dotenv/config';

async function pushCostCenterTables() {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    console.error('DATABASE_URL is missing');
    process.exit(1);
  }

  const client = new pg.Client({ connectionString });
  
  try {
    await client.connect();
    console.log('Connected to database.');

    // 1. TBL_COST_CENTER_MASTER
    const createMasterSql = `
      CREATE TABLE IF NOT EXISTS stomaster."TBL_COST_CENTER_MASTER" (
        "COST_CENTER_ID" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
        "Company_ID" integer REFERENCES stomaster."tbl_Company_Master"("Company_Id"),
        "COST_CENTER_CODE" varchar(30) NOT NULL,
        "COST_CENTER_NAME" varchar(150) NOT NULL,
        "COST_CENTER_TYPE" varchar(30),
        "DEPARTMENT_ID" integer REFERENCES stomaster."tbl_Department_Master"("Department_Id"),
        "PARENT_COST_CENTER_ID" integer REFERENCES stomaster."TBL_COST_CENTER_MASTER"("COST_CENTER_ID"),
        "HIERARCHY_LEVEL" integer DEFAULT 1,
        "HIERARCHY_PATH" varchar(500),
        "MANAGER_EMPLOYEE_ID" integer REFERENCES stomaster."tbl_Employee_Master"("Employee_Id"),
        "APPROVER_EMPLOYEE_ID" integer REFERENCES stomaster."tbl_Employee_Master"("Employee_Id"),
        "ANNUAL_BUDGET" numeric(30, 5) DEFAULT 0,
        "BUDGET_CURRENCY_ID" integer REFERENCES stomaster."TBL_CURRENCY_MASTER"("CURRENCY_ID"),
        "BUDGET_ALERT_THRESHOLD" integer DEFAULT 80,
        "EXPENSE_LEDGER_ID" integer REFERENCES stomaster."TBL_ACCOUNTS_LEDGER_MASTER"("LEDGER_ID"),
        "IS_ACTIVE" boolean DEFAULT true,
        "EFFECTIVE_FROM" date,
        "EFFECTIVE_TO" date,
        "REMARKS" varchar(1000),
        "STATUS_MASTER" varchar(20) DEFAULT 'Active',
        "CREATED_BY" varchar(50),
        "CREATED_DATE" timestamp DEFAULT now(),
        "CREATED_MAC_ADDRESS" varchar(50),
        "MODIFIED_BY" varchar(50),
        "MODIFIED_DATE" timestamp,
        "MODIFIED_MAC_ADDRESS" varchar(50)
      );
    `;

    // 2. TBL_COST_CENTER_ALLOCATION
    const createAllocationSql = `
      CREATE TABLE IF NOT EXISTS stomaster."TBL_COST_CENTER_ALLOCATION" (
        "ALLOCATION_ID" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
        "Company_ID" integer REFERENCES stomaster."tbl_Company_Master"("Company_Id"),
        "COST_CENTER_ID" integer REFERENCES stomaster."TBL_COST_CENTER_MASTER"("COST_CENTER_ID"),
        "SOURCE_TABLE" varchar(50) NOT NULL,
        "SOURCE_REF_NO" varchar(50) NOT NULL,
        "SOURCE_LINE_SNO" integer,
        "EXPENSE_DATE" date,
        "EXPENSE_CATEGORY" varchar(50),
        "CURRENCY_ID" integer REFERENCES stomaster."TBL_CURRENCY_MASTER"("CURRENCY_ID"),
        "EXPENSE_AMOUNT" numeric(30, 5),
        "LC_AMOUNT" numeric(30, 5),
        "ALLOCATION_PERCENTAGE" numeric(5, 2) DEFAULT 100,
        "ALLOCATED_AMOUNT" numeric(30, 5),
        "APPROVAL_STATUS" varchar(20) DEFAULT 'PENDING',
        "APPROVED_BY" varchar(50),
        "APPROVED_DATE" timestamp,
        "APPROVAL_REMARKS" varchar(500),
        "REMARKS" varchar(500),
        "STATUS_ENTRY" varchar(20) DEFAULT 'Active',
        "CREATED_BY" varchar(50),
        "CREATED_DATE" timestamp DEFAULT now(),
        "CREATED_MAC_ADDRESS" varchar(50),
        "MODIFIED_BY" varchar(50),
        "MODIFIED_DATE" timestamp,
        "MODIFIED_MAC_ADDRESS" varchar(50)
      );
    `;

    // 3. TBL_COST_CENTER_BUDGET
    const createBudgetSql = `
      CREATE TABLE IF NOT EXISTS stomaster."TBL_COST_CENTER_BUDGET" (
        "BUDGET_ID" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
        "Company_ID" integer REFERENCES stomaster."tbl_Company_Master"("Company_Id"),
        "COST_CENTER_ID" integer REFERENCES stomaster."TBL_COST_CENTER_MASTER"("COST_CENTER_ID"),
        "FINANCIAL_YEAR" varchar(10),
        "BUDGET_PERIOD" varchar(20),
        "PERIOD_START_DATE" date,
        "PERIOD_END_DATE" date,
        "BUDGET_AMOUNT" numeric(30, 5),
        "CURRENCY_ID" integer REFERENCES stomaster."TBL_CURRENCY_MASTER"("CURRENCY_ID"),
        "BUDGET_BY_CATEGORY" jsonb,
        "ACTUAL_EXPENSE" numeric(30, 5) DEFAULT 0,
        "COMMITTED_AMOUNT" numeric(30, 5) DEFAULT 0,
        "AVAILABLE_BUDGET" numeric(30, 5),
        "VARIANCE_AMOUNT" numeric(30, 5),
        "VARIANCE_PERCENTAGE" numeric(5, 2),
        "VARIANCE_TYPE" varchar(20),
        "IS_LOCKED" boolean DEFAULT false,
        "LOCKED_DATE" date,
        "LOCKED_BY" varchar(50),
        "REMARKS" varchar(1000),
        "STATUS_MASTER" varchar(20) DEFAULT 'Active',
        "CREATED_BY" varchar(50),
        "CREATED_DATE" timestamp DEFAULT now(),
        "CREATED_MAC_ADDRESS" varchar(50),
        "MODIFIED_BY" varchar(50),
        "MODIFIED_DATE" timestamp,
        "MODIFIED_MAC_ADDRESS" varchar(50)
      );
    `;

    // 4. TBL_COST_CENTER_MONTHLY_SUMMARY
    const createSummarySql = `
      CREATE TABLE IF NOT EXISTS stomaster."TBL_COST_CENTER_MONTHLY_SUMMARY" (
        "SUMMARY_ID" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
        "Company_ID" integer REFERENCES stomaster."tbl_Company_Master"("Company_Id"),
        "COST_CENTER_ID" integer REFERENCES stomaster."TBL_COST_CENTER_MASTER"("COST_CENTER_ID"),
        "YEAR_MONTH" varchar(7),
        "FINANCIAL_YEAR" varchar(10),
        "TOTAL_EXPENSE" numeric(30, 5) DEFAULT 0,
        "TOTAL_BUDGET" numeric(30, 5) DEFAULT 0,
        "TRAVEL_EXPENSE" numeric(30, 5) DEFAULT 0,
        "SUPPLIES_EXPENSE" numeric(30, 5) DEFAULT 0,
        "SALARY_EXPENSE" numeric(30, 5) DEFAULT 0,
        "RENT_EXPENSE" numeric(30, 5) DEFAULT 0,
        "UTILITIES_EXPENSE" numeric(30, 5) DEFAULT 0,
        "MAINTENANCE_EXPENSE" numeric(30, 5) DEFAULT 0,
        "SOFTWARE_EXPENSE" numeric(30, 5) DEFAULT 0,
        "MARKETING_EXPENSE" numeric(30, 5) DEFAULT 0,
        "TRAINING_EXPENSE" numeric(30, 5) DEFAULT 0,
        "PROFESSIONAL_EXPENSE" numeric(30, 5) DEFAULT 0,
        "OTHER_EXPENSE" numeric(30, 5) DEFAULT 0,
        "TRANSACTION_COUNT" integer DEFAULT 0,
        "CALCULATED_DATE" timestamp,
        "CREATED_BY" varchar(50),
        "CREATED_DATE" timestamp DEFAULT now(),
        "MODIFIED_BY" varchar(50),
        "MODIFIED_DATE" timestamp
      );
    `;

    // 5. TBL_BUDGET_ALERT_LOG
    const createAlertSql = `
      CREATE TABLE IF NOT EXISTS stomaster."TBL_BUDGET_ALERT_LOG" (
        "ALERT_ID" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
        "Company_ID" integer REFERENCES stomaster."tbl_Company_Master"("Company_Id"),
        "COST_CENTER_ID" integer REFERENCES stomaster."TBL_COST_CENTER_MASTER"("COST_CENTER_ID"),
        "ALERT_DATE" timestamp DEFAULT now(),
        "ALERT_TYPE" varchar(30),
        "THRESHOLD_PERCENT" integer,
        "CURRENT_USAGE_PERCENT" numeric(5, 2),
        "BUDGETED_AMOUNT" numeric(30, 5),
        "ACTUAL_EXPENSE" numeric(30, 5),
        "COMMITTED_AMOUNT" numeric(30, 5),
        "NOTIFICATION_SENT" boolean DEFAULT false,
        "NOTIFICATION_SENT_DATE" timestamp,
        "NOTIFIED_PERSONS" varchar(500),
        "RESOLVED_STATUS" varchar(20) DEFAULT 'PENDING',
        "RESOLVED_BY" varchar(50),
        "RESOLVED_DATE" timestamp,
        "RESOLUTION_REMARKS" varchar(500),
        "REMARKS" varchar(500),
        "CREATED_BY" varchar(50),
        "CREATED_DATE" timestamp DEFAULT now()
      );
    `;

    console.log('Creating TBL_COST_CENTER_MASTER...');
    await client.query(createMasterSql);
    
    console.log('Creating TBL_COST_CENTER_ALLOCATION...');
    await client.query(createAllocationSql);
    
    console.log('Creating TBL_COST_CENTER_BUDGET...');
    await client.query(createBudgetSql);

    console.log('Creating TBL_COST_CENTER_MONTHLY_SUMMARY...');
    await client.query(createSummarySql);

    console.log('Creating TBL_BUDGET_ALERT_LOG...');
    await client.query(createAlertSql);



    // --- Profit Center Tables ---

    const createProfitMasterSql = `
      CREATE TABLE IF NOT EXISTS stomaster."TBL_PROFIT_CENTER_MASTER" (
        "PROFIT_CENTER_ID" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
        "Company_ID" integer REFERENCES stomaster."tbl_Company_Master"("Company_Id"),
        "PROFIT_CENTER_CODE" varchar(30) NOT NULL,
        "PROFIT_CENTER_NAME" varchar(150) NOT NULL,
        "PROFIT_CENTER_TYPE" varchar(30),
        "PARENT_PROFIT_CENTER_ID" integer REFERENCES stomaster."TBL_PROFIT_CENTER_MASTER"("PROFIT_CENTER_ID"),
        "HIERARCHY_LEVEL" integer DEFAULT 1,
        "HIERARCHY_PATH" varchar(500),
        "MANAGER_EMPLOYEE_ID" integer REFERENCES stomaster."tbl_Employee_Master"("Employee_Id"),
        "ANNUAL_REVENUE_TARGET" numeric(30, 5) DEFAULT 0,
        "TARGET_CURRENCY_ID" integer REFERENCES stomaster."TBL_CURRENCY_MASTER"("CURRENCY_ID"),
        "REVENUE_LEDGER_ID" integer REFERENCES stomaster."TBL_ACCOUNTS_LEDGER_MASTER"("LEDGER_ID"),
        "IS_ACTIVE" boolean DEFAULT true,
        "EFFECTIVE_FROM" date,
        "EFFECTIVE_TO" date,
        "REMARKS" varchar(1000),
        "STATUS_MASTER" varchar(20) DEFAULT 'Active',
        "CREATED_BY" varchar(50),
        "CREATED_DATE" timestamp DEFAULT now(),
        "CREATED_MAC_ADDRESS" varchar(50),
        "MODIFIED_BY" varchar(50),
        "MODIFIED_DATE" timestamp,
        "MODIFIED_MAC_ADDRESS" varchar(50)
      );
    `;

    const createProfitAllocationSql = `
      CREATE TABLE IF NOT EXISTS stomaster."TBL_PROFIT_CENTER_ALLOCATION" (
        "ALLOCATION_ID" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
        "Company_ID" integer REFERENCES stomaster."tbl_Company_Master"("Company_Id"),
        "PROFIT_CENTER_ID" integer REFERENCES stomaster."TBL_PROFIT_CENTER_MASTER"("PROFIT_CENTER_ID"),
        "SOURCE_TABLE" varchar(50) NOT NULL,
        "SOURCE_REF_NO" varchar(50) NOT NULL,
        "SOURCE_LINE_SNO" integer,
        "REVENUE_DATE" date,
        "REVENUE_CATEGORY" varchar(50),
        "CURRENCY_ID" integer REFERENCES stomaster."TBL_CURRENCY_MASTER"("CURRENCY_ID"),
        "REVENUE_AMOUNT" numeric(30, 5),
        "LC_AMOUNT" numeric(30, 5),
        "ALLOCATION_PERCENTAGE" numeric(5, 2) DEFAULT 100,
        "ALLOCATED_AMOUNT" numeric(30, 5),
        "STATUS_ENTRY" varchar(20) DEFAULT 'Active',
        "CREATED_BY" varchar(50),
        "CREATED_DATE" timestamp DEFAULT now(),
        "CREATED_MAC_ADDRESS" varchar(50)
      );
    `;

    const createProfitTargetSql = `
      CREATE TABLE IF NOT EXISTS stomaster."TBL_PROFIT_CENTER_TARGET" (
        "TARGET_ID" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
        "Company_ID" integer REFERENCES stomaster."tbl_Company_Master"("Company_Id"),
        "PROFIT_CENTER_ID" integer REFERENCES stomaster."TBL_PROFIT_CENTER_MASTER"("PROFIT_CENTER_ID"),
        "FINANCIAL_YEAR" varchar(10),
        "PERIOD_START_DATE" date,
        "PERIOD_END_DATE" date,
        "TARGET_AMOUNT" numeric(30, 5),
        "ACTUAL_REVENUE" numeric(30, 5) DEFAULT 0,
        "REMARKS" varchar(1000),
        "STATUS_MASTER" varchar(20) DEFAULT 'Active',
        "CREATED_BY" varchar(50),
        "CREATED_DATE" timestamp DEFAULT now()
      );
    `;

    console.log('Creating Profit Center tables...');
    await client.query(createProfitMasterSql);
    await client.query(createProfitAllocationSql);
    await client.query(createProfitTargetSql);

    // --- Multi-Currency Tables ---

    const createMultiCurrencyTransactionSql = `
      CREATE TABLE IF NOT EXISTS stomaster."TBL_MULTI_CURRENCY_TRANSACTIONS" (
        "TRANSACTION_ID" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
        "Company_ID" integer REFERENCES stomaster."tbl_Company_Master"("Company_Id"),
        "DOCUMENT_TYPE" varchar(30),
        "DOCUMENT_NUMBER" varchar(50),
        "DOCUMENT_DATE" date,
        "TRANSACTION_CURRENCY_ID" integer REFERENCES stomaster."TBL_CURRENCY_MASTER"("CURRENCY_ID"),
        "TRANSACTION_AMOUNT" numeric(30, 5),
        "BASE_CURRENCY_ID" integer REFERENCES stomaster."TBL_CURRENCY_MASTER"("CURRENCY_ID"),
        "BASE_AMOUNT" numeric(30, 5),
        "EXCHANGE_RATE_USED" numeric(30, 8),
        "EXCHANGE_RATE_SNO" integer,
        "ORIGINAL_BASE_AMOUNT" numeric(30, 5),
        "SETTLED_AMOUNT" numeric(30, 5) DEFAULT 0,
        "STATUS" varchar(20) DEFAULT 'PENDING',
        "REMARKS" varchar(500),
        "CREATED_BY" varchar(50),
        "CREATED_DATE" timestamp DEFAULT now(),
        "CREATED_MAC_ADDRESS" varchar(50),
        "MODIFIED_BY" varchar(50),
        "MODIFIED_DATE" timestamp,
        "MODIFIED_MAC_ADDRESS" varchar(50)
      );
    `;

    const createExchangeRateUsageLogSql = `
      CREATE TABLE IF NOT EXISTS stomaster."TBL_EXCHANGE_RATE_USAGE_LOG" (
        "LOG_ID" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
        "Company_ID" integer REFERENCES stomaster."tbl_Company_Master"("Company_Id"),
        "EXCHANGE_RATE_SNO" integer REFERENCES stomaster."TBL_EXCHANGE_RATE_MASTER"("SNO"),
        "TRANSACTION_ID" integer REFERENCES stomaster."TBL_MULTI_CURRENCY_TRANSACTIONS"("TRANSACTION_ID"),
        "RATE_VALUE_AT_USAGE" numeric(30, 8),
        "APPLIED_DATE" date,
        "USAGE_TYPE" varchar(30),
        "CREATED_BY" varchar(50),
        "CREATED_DATE" timestamp DEFAULT now()
      );
    `;

    const createUnrealizedGainLossSql = `
      CREATE TABLE IF NOT EXISTS stomaster."TBL_UNREALIZED_GAIN_LOSS" (
        "GL_ID" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
        "Company_ID" integer REFERENCES stomaster."tbl_Company_Master"("Company_Id"),
        "TRANSACTION_ID" integer REFERENCES stomaster."TBL_MULTI_CURRENCY_TRANSACTIONS"("TRANSACTION_ID"),
        "ACCOUNT_TYPE" varchar(30),
        "REVALUATION_DATE" date,
        "OLD_BASE_AMOUNT" numeric(30, 5),
        "NEW_BASE_AMOUNT" numeric(30, 5),
        "UNREALIZED_GAIN_LOSS" numeric(30, 5),
        "GL_TYPE" varchar(10),
        "JOURNAL_VOUCHER_NO" varchar(50),
        "REVERSAL_JOURNAL_VOUCHER_NO" varchar(50),
        "IS_REVERSED" boolean DEFAULT false,
        "STATUS" varchar(20) DEFAULT 'ACTIVE',
        "CREATED_BY" varchar(50),
        "CREATED_DATE" timestamp DEFAULT now()
      );
    `;

    const createRealizedGainLossSql = `
      CREATE TABLE IF NOT EXISTS stomaster."TBL_REALIZED_GAIN_LOSS" (
        "GL_ID" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
        "Company_ID" integer REFERENCES stomaster."tbl_Company_Master"("Company_Id"),
        "TRANSACTION_ID" integer REFERENCES stomaster."TBL_MULTI_CURRENCY_TRANSACTIONS"("TRANSACTION_ID"),
        "SETTLEMENT_DATE" date,
        "SETTLEMENT_AMOUNT" numeric(30, 5),
        "SETTLEMENT_RATE" numeric(30, 8),
        "SETTLEMENT_BASE_AMOUNT" numeric(30, 5),
        "ORIGINAL_BASE_AMOUNT" numeric(30, 5),
        "REALIZED_GAIN_LOSS" numeric(30, 5),
        "GL_TYPE" varchar(10),
        "JOURNAL_VOUCHER_NO" varchar(50),
        "CREATED_BY" varchar(50),
        "CREATED_DATE" timestamp DEFAULT now()
      );
    `;

    const createCompanyBaseCurrencySql = `
      CREATE TABLE IF NOT EXISTS stomaster."TBL_COMPANY_BASE_CURRENCY" (
        "ID" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
        "Company_ID" integer UNIQUE REFERENCES stomaster."tbl_Company_Master"("Company_Id"),
        "BASE_CURRENCY_ID" integer REFERENCES stomaster."TBL_CURRENCY_MASTER"("CURRENCY_ID"),
        "UNREALIZED_GAIN_ACCOUNT_CODE" varchar(50),
        "UNREALIZED_LOSS_ACCOUNT_CODE" varchar(50),
        "REALIZED_GAIN_ACCOUNT_CODE" varchar(50),
        "REALIZED_LOSS_ACCOUNT_CODE" varchar(50),
        "AUTO_REVALUATION_FREQUENCY" varchar(20) DEFAULT 'MONTHLY',
        "CREATED_BY" varchar(50),
        "CREATED_DATE" timestamp DEFAULT now(),
        "MODIFIED_BY" varchar(50),
        "MODIFIED_DATE" timestamp
      );
    `;

    const createCostCenterMasterSql = `
      CREATE TABLE IF NOT EXISTS stomaster."TBL_COST_CENTER_MASTER" (
        "COST_CENTER_ID" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
        "Company_ID" integer REFERENCES stomaster."tbl_Company_Master"("Company_Id"),
        "COST_CENTER_CODE" varchar(50) UNIQUE,
        "COST_CENTER_NAME" varchar(150),
        "COST_CENTER_TYPE" varchar(50),
        "DESCRIPTION" varchar(500),
        "BUDGET_ALERT_THRESHOLD" integer DEFAULT 80,
        "STATUS" varchar(20) DEFAULT 'Active',
        "CREATED_BY" varchar(50),
        "CREATED_DATE" timestamp,
        "CREATED_MAC_ADDRESS" varchar(50)
      );
    `;

    const createCostCenterAllocationSql = `
      CREATE TABLE IF NOT EXISTS stomaster."TBL_COST_CENTER_ALLOCATION" (
        "ALLOCATION_ID" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
        "Company_ID" integer REFERENCES stomaster."tbl_Company_Master"("Company_Id"),
        "COST_CENTER_ID" integer REFERENCES stomaster."TBL_COST_CENTER_MASTER"("COST_CENTER_ID"),
        "SOURCE_TABLE" varchar(50),
        "SOURCE_REF_NO" varchar(50),
        "SOURCE_LINE_SNO" integer,
        "EXPENSE_DATE" timestamp,
        "EXPENSE_CATEGORY" varchar(100),
        "CURRENCY_ID" integer REFERENCES stomaster."TBL_CURRENCY_MASTER"("CURRENCY_ID"),
        "EXPENSE_AMOUNT" numeric(30, 5),
        "LC_AMOUNT" numeric(30, 5),
        "ALLOCATION_PERCENTAGE" numeric(5, 2),
        "ALLOCATED_AMOUNT" numeric(30, 5),
        "APPROVAL_STATUS" varchar(20) DEFAULT 'PENDING',
        "STATUS_ENTRY" varchar(20) DEFAULT 'Active',
        "REMARKS" varchar(500),
        "CREATED_BY" varchar(50),
        "CREATED_DATE" timestamp
      );
    `;

    const createCostCenterBudgetSql = `
      CREATE TABLE IF NOT EXISTS stomaster."TBL_COST_CENTER_BUDGET" (
        "BUDGET_ID" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
        "Company_ID" integer REFERENCES stomaster."tbl_Company_Master"("Company_Id"),
        "COST_CENTER_ID" integer REFERENCES stomaster."TBL_COST_CENTER_MASTER"("COST_CENTER_ID"),
        "FINANCIAL_YEAR" varchar(20),
        "PERIOD_START_DATE" date,
        "PERIOD_END_DATE" date,
        "BUDGET_AMOUNT" numeric(30, 5),
        "ACTUAL_EXPENSE" numeric(30, 5) DEFAULT 0,
        "COMMITTED_AMOUNT" numeric(30, 5) DEFAULT 0,
        "AVAILABLE_BUDGET" numeric(30, 5),
        "VARIANCE_AMOUNT" numeric(30, 5),
        "VARIANCE_PERCENTAGE" numeric(5, 2),
        "STATUS" varchar(20) DEFAULT 'Active'
      );
    `;

    const createBudgetAlertLogSql = `
      CREATE TABLE IF NOT EXISTS stomaster."TBL_BUDGET_ALERT_LOG" (
        "ALERT_ID" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
        "Company_ID" integer REFERENCES stomaster."tbl_Company_Master"("Company_Id"),
        "COST_CENTER_ID" integer REFERENCES stomaster."TBL_COST_CENTER_MASTER"("COST_CENTER_ID"),
        "ALERT_TYPE" varchar(50),
        "THRESHOLD_PERCENT" integer,
        "CURRENT_USAGE_PERCENT" numeric(5, 2),
        "BUDGETED_AMOUNT" numeric(30, 5),
        "ACTUAL_EXPENSE" numeric(30, 5),
        "COMMITTED_AMOUNT" numeric(30, 5),
        "ALERT_DATE" timestamp,
        "IS_NOTIFIED" boolean DEFAULT false,
        "CREATED_BY" varchar(50),
        "CREATED_DATE" timestamp
      );
    `;

    const createProfitCenterMasterSql = `
      CREATE TABLE IF NOT EXISTS stomaster."TBL_PROFIT_CENTER_MASTER" (
        "PROFIT_CENTER_ID" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
        "Company_ID" integer REFERENCES stomaster."tbl_Company_Master"("Company_Id"),
        "PROFIT_CENTER_CODE" varchar(50) UNIQUE,
        "PROFIT_CENTER_NAME" varchar(150),
        "MANAGER_NAME" varchar(100),
        "STATUS" varchar(20) DEFAULT 'Active',
        "CREATED_BY" varchar(50),
        "CREATED_DATE" timestamp,
        "CREATED_MAC_ADDRESS" varchar(50)
      );
    `;

    const createProfitCenterTargetSql = `
      CREATE TABLE IF NOT EXISTS stomaster."TBL_PROFIT_CENTER_TARGET" (
        "TARGET_ID" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
        "Company_ID" integer REFERENCES stomaster."tbl_Company_Master"("Company_Id"),
        "PROFIT_CENTER_ID" integer REFERENCES stomaster."TBL_PROFIT_CENTER_MASTER"("PROFIT_CENTER_ID"),
        "FINANCIAL_YEAR" varchar(20),
        "PERIOD_NAME" varchar(50),
        "PERIOD_START_DATE" date,
        "PERIOD_END_DATE" date,
        "TARGET_AMOUNT" numeric(30, 5),
        "ACTUAL_REVENUE" numeric(30, 5) DEFAULT 0,
        "ACHIEVEMENT_PERCENT" numeric(5, 2)
      );
    `;

    const createProfitCenterAllocationSql = `
      CREATE TABLE IF NOT EXISTS stomaster."TBL_PROFIT_CENTER_ALLOCATION" (
        "ALLOCATION_ID" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
        "Company_ID" integer REFERENCES stomaster."tbl_Company_Master"("Company_Id"),
        "PROFIT_CENTER_ID" integer REFERENCES stomaster."TBL_PROFIT_CENTER_MASTER"("PROFIT_CENTER_ID"),
        "SOURCE_TABLE" varchar(50),
        "SOURCE_REF_NO" varchar(50),
        "SOURCE_LINE_SNO" integer,
        "REVENUE_DATE" timestamp,
        "REVENUE_CATEGORY" varchar(100),
        "CURRENCY_ID" integer REFERENCES stomaster."TBL_CURRENCY_MASTER"("CURRENCY_ID"),
        "REVENUE_AMOUNT" numeric(30, 5),
        "LC_AMOUNT" numeric(30, 5),
        "ALLOCATION_PERCENTAGE" numeric(5, 2),
        "ALLOCATED_AMOUNT" numeric(30, 5),
        "STATUS_ENTRY" varchar(20) DEFAULT 'Active',
        "CREATED_BY" varchar(50),
        "CREATED_DATE" timestamp
      );
    `;

    console.log('Creating Cost Center and Profit Center tables...');
    await client.query(createCostCenterMasterSql);
    await client.query(createCostCenterAllocationSql);
    await client.query(createCostCenterBudgetSql);
    await client.query(createBudgetAlertLogSql);
    await client.query(createProfitCenterMasterSql);
    await client.query(createProfitCenterTargetSql);
    await client.query(createProfitCenterAllocationSql);

    console.log('Creating Multi-Currency tables...');
    await client.query(createMultiCurrencyTransactionSql);
    await client.query(createExchangeRateUsageLogSql);
    await client.query(createUnrealizedGainLossSql);
    await client.query(createRealizedGainLossSql);
    await client.query(createCompanyBaseCurrencySql);

    console.log('Synchronizing transaction headers with financial allocation columns...');
    await client.query('ALTER TABLE stoentries."TBL_PURCHASE_INVOICE_HDR" ADD COLUMN IF NOT EXISTS "COST_CENTER_ID" INTEGER REFERENCES stomaster."TBL_COST_CENTER_MASTER"("COST_CENTER_ID");');
    await client.query('ALTER TABLE stoentries."TBL_TAX_INVOICE_HDR" ADD COLUMN IF NOT EXISTS "PROFIT_CENTER_ID" INTEGER REFERENCES stomaster."TBL_PROFIT_CENTER_MASTER"("PROFIT_CENTER_ID");');
    await client.query('ALTER TABLE stoentries."TBL_EXPENSE_HDR" ADD COLUMN IF NOT EXISTS "COST_CENTER_ID" INTEGER REFERENCES stomaster."TBL_COST_CENTER_MASTER"("COST_CENTER_ID");');
    
    // Add STATUS_ENTRY to allocation tables if they exist without it
    await client.query('ALTER TABLE stomaster."TBL_COST_CENTER_ALLOCATION" ADD COLUMN IF NOT EXISTS "STATUS_ENTRY" VARCHAR(20) DEFAULT \'Active\';');
    await client.query('ALTER TABLE stomaster."TBL_PROFIT_CENTER_ALLOCATION" ADD COLUMN IF NOT EXISTS "STATUS_ENTRY" VARCHAR(20) DEFAULT \'Active\';');

    console.log('All Cost, Profit, and Multi-Currency tables pushed and synchronized successfully!');
    process.exit(0);
  } catch (err) {
    console.error('Error creating database tables:', err);
    process.exit(1);
  } finally {
    await client.end();
  }
}

pushCostCenterTables();
