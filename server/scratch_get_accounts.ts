import pg from 'pg';
import 'dotenv/config';

async function seedCompanyBankAccounts() {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    console.error('DATABASE_URL is missing');
    process.exit(1);
  }

  const client = new pg.Client({ connectionString });
  
  try {
    await client.connect();
    console.log('Connected to database successfully.');

    // 1. Get banks
    const finalBanks = await client.query('SELECT * FROM stomaster."TBL_BANK_MASTER"');
    
    // 2. Get currencies
    const finalCurrencies = await client.query('SELECT * FROM stomaster."TBL_CURRENCY_MASTER"');
    
    // 3. Get companies
    const resCompanies = await client.query('SELECT * FROM stomaster."tbl_Company_Master"');
    console.log('Companies count:', resCompanies.rows.length);

    // Clean existing bank accounts
    await client.query('DELETE FROM stomaster."tbl_Company_Bank_Account_Master"');

    const bankId1 = finalBanks.rows[0]?.BANK_ID || 1;
    const bankId2 = finalBanks.rows[1]?.BANK_ID || bankId1;
    const currencyId = finalCurrencies.rows[0]?.CURRENCY_ID || 1;

    for (const company of resCompanies.rows) {
      const companyId = company.Company_Id || company.Company_id;
      console.log(`Seeding accounts for Company [${company.Company_Name}] (ID: ${companyId})`);

      // Insert Account 1
      await client.query(`
        INSERT INTO stomaster."tbl_Company_Bank_Account_Master" (
          "Company_id", "Bank_Id", "Account_Name", "Account_Number", "Swift_Code", "Branch_Address", "Bank_Branch_Name", "Currency_Id", "Status_Master"
        ) VALUES (
          $1, $2, $3, $4, 'CRDBTZTZ', 'Sam Nujoma Road Branch, Dar es Salaam', 'Corporate Branch', $5, 'Active'
        )
      `, [companyId, bankId1, `${company.Company_Name.trim()} CRDB Corp`, `01502446788${companyId}`, currencyId]);

      // Insert Account 2
      await client.query(`
        INSERT INTO stomaster."tbl_Company_Bank_Account_Master" (
          "Company_id", "Bank_Id", "Account_Name", "Account_Number", "Swift_Code", "Branch_Address", "Bank_Branch_Name", "Currency_Id", "Status_Master"
        ) VALUES (
          $1, $2, $3, $4, 'NBCATZTZ', 'Julius Nyerere Road Branch, Dar es Salaam', 'Main Branch', $5, 'Active'
        )
      `, [companyId, bankId2, `${company.Company_Name.trim()} NBC Ops`, `0111030099${companyId}`, currencyId]);
    }

    console.log('✅ Successfully seeded two company bank accounts for EVERY company in the database!');
    process.exit(0);
  } catch (err) {
    console.error('Error during seeding:', err);
    process.exit(1);
  } finally {
    await client.end();
  }
}

seedCompanyBankAccounts();
