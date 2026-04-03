import { db } from "./index.js";
import {
  TBL_USER_INFO_HDR,
  TBL_ROLE_MASTER,
  TBL_COUNTRY_MASTER,
  TBL_CURRENCY_MASTER,
  TBL_REGION_MASTER,
  TBL_DISTRICT_MASTER,
  TBL_COMPANY_MASTER,
  TBL_LOCATION_MASTER,
  TBL_STORE_MASTER,
  TBL_PRODUCT_MAIN_CATEGORY_MASTER,
  TBL_PRODUCT_SUB_CATEGORY_MASTER,
  TBL_PRODUCT_MASTER,
  TBL_SUPPLIER_MASTER,
  TBL_CUSTOMER_MASTER,
  TBL_BILLING_LOCATION_MASTER,
  TBL_ADDITIONAL_COST_TYPE_MASTER,
  TBL_PAYMENT_TERM_MASTER,
  TBL_CUSTOMER_PAYMENT_MODE_MASTER,
  TBL_BANK_MASTER,
  TBL_ACCOUNTS_LEDGER_GROUP_MASTER,
  TBL_ACCOUNTS_HEAD_MASTER,
  TBL_PAYMENT_MODE_MASTER,
  TBL_COMPANY_BANK_ACCOUNT_MASTER,
  TBL_USER_TO_STORE_MAPPING,
  TBL_VAT_PERCENTAGE_SETTING,
  TBL_EXCHANGE_RATE_MASTER,
  TBL_PRODUCT_OPENING_STOCK,
  TBL_STORE_PRODUCT_MINIMUM_STOCK,
  TBL_CUSTOMER_ADDRESS_DETAILS,
  TBL_CUSTOMER_CREDIT_LIMIT_DETAILS,
  TBL_CUSTOMER_WISE_PRODUCT_PRICE_SETTINGS,
  TBL_SALES_PERSON_MASTER,
  TBL_ACCOUNTS_LEDGER_MASTER,
  TBL_FIELD_HDR,
  TBL_FIELD_DTL,
  TBL_PRODUCT_COMPANY_MAIN_CATEGORY_MAPPING,
  TBL_CHANGE_PASSWORD_LOG,
  TBL_CUSTOMER_MASTER_FILES_UPLOAD,
  TBL_CUSTOMER_COMPANY_WISE_BILLING_LOCATION_MAPPING,
  TBL_CUSTOMER_PRODUCT_VAT_PERCENTAGE_SETTINGS,
  CUSTOMER_CREDIT_LIMIT_FILE_UPLOAD,
} from "./schema/index.js";
import bcrypt from "bcryptjs";

const seedRoles = [
  {
    ROLE_NAME: "Super Admin",
    ROLE_DESCRIPTION: "Full System Access & Configuration",
    REMARKS: "Top level authority",
    STATUS_MASTER: "ACTIVE",
    CREATED_BY: "SYSTEM",
    CREATED_DATE: new Date(),
    CREATED_MAC_ADDRESS: "00:00:00:00:00:00",
  },
  {
    ROLE_NAME: "Admin",
    ROLE_DESCRIPTION: "Administrative User Management",
    REMARKS: "Standard administrative privileges",
    STATUS_MASTER: "ACTIVE",
    CREATED_BY: "SYSTEM",
    CREATED_DATE: new Date(),
    CREATED_MAC_ADDRESS: "00:00:00:00:00:00",
  },
  {
    ROLE_NAME: "Manager",
    ROLE_DESCRIPTION: "Management and Reports Access",
    REMARKS: "Mid-level access",
    STATUS_MASTER: "ACTIVE",
    CREATED_BY: "SYSTEM",
    CREATED_DATE: new Date(),
    CREATED_MAC_ADDRESS: "00:00:00:00:00:00",
  },
  {
    ROLE_NAME: "User",
    ROLE_DESCRIPTION: "Standard Operational Access",
    REMARKS: "Basic tasks",
    STATUS_MASTER: "ACTIVE",
    CREATED_BY: "SYSTEM",
    CREATED_DATE: new Date(),
    CREATED_MAC_ADDRESS: "00:00:00:00:00:00",
  },
];

const seedUsers = [
  {
    LOGIN_NAME: "Sri",
    PASSWORD_USER_HDR: "ana",
    ROLE_USER_HDR: "Super Admin",
    MOBILE_NO_USER_HDR: "255712345678",
    MAIL_ID_USER_HDR: "sri@visioninfotech.co.tz",
    REMARKS_USER_HDR: "Srinivas",
    NEW_CARD_NO_USER_HDR: 1001,
  },
  {
    LOGIN_NAME: "Admin",
    PASSWORD_USER_HDR: "superadmin@123",
    ROLE_USER_HDR: "Super Admin",
    MOBILE_NO_USER_HDR: "255712345679",
    MAIL_ID_USER_HDR: "superadmin@visioninfotech.co.tz",
    REMARKS_USER_HDR: "Super Admin",
    NEW_CARD_NO_USER_HDR: 1002,
  },
  {
    LOGIN_NAME: "Manager",
    PASSWORD_USER_HDR: "manager@123",
    ROLE_USER_HDR: "Manager",
    MOBILE_NO_USER_HDR: "255712345680",
    MAIL_ID_USER_HDR: "manager@visioninfotech.co.tz",
    REMARKS_USER_HDR: "Manager",
    NEW_CARD_NO_USER_HDR: 1003,
  },
  {
    LOGIN_NAME: "User",
    PASSWORD_USER_HDR: "user@123",
    ROLE_USER_HDR: "User",
    MOBILE_NO_USER_HDR: "255712345681",
    MAIL_ID_USER_HDR: "user1@visioninfotech.co.tz",
    REMARKS_USER_HDR: "User1",
    NEW_CARD_NO_USER_HDR: 1004,
  },
  {
    LOGIN_NAME: "Admin2",
    PASSWORD_USER_HDR: "admin2@123",
    ROLE_USER_HDR: "Admin",
    MOBILE_NO_USER_HDR: "255712345682",
    MAIL_ID_USER_HDR: "admin2@visioninfotech.co.tz",
    REMARKS_USER_HDR: "Secondary Admin",
    NEW_CARD_NO_USER_HDR: 1005,
  },
];

async function main() {
  console.log("🌱 Seeding Tanzania Master Data...");

  try {
    // 1. Roles
    console.log("Seeding Roles...");
    const insertedRoles = await db
      .insert(TBL_ROLE_MASTER)
      .values(seedRoles)
      .onConflictDoNothing()
      .returning();
    const superAdminRoleId = insertedRoles.find(r => r.ROLE_NAME === "Super Admin")?.ROLE_ID || 1;
    const adminRoleId = insertedRoles.find(r => r.ROLE_NAME === "Admin")?.ROLE_ID || 2;
    const managerRoleId = insertedRoles.find(r => r.ROLE_NAME === "Manager")?.ROLE_ID || 3;
    const userRoleId = insertedRoles.find(r => r.ROLE_NAME === "User")?.ROLE_ID || 4;

    // 2. Users
    console.log("Seeding Users...");
    const salt = await bcrypt.genSalt(10);
    const users = await Promise.all(
      seedUsers.map(async (u) => ({
        LOGIN_NAME: u.LOGIN_NAME,
        PASSWORD_USER_HDR: await bcrypt.hash(u.PASSWORD_USER_HDR, salt),
        ROLE_USER_HDR: u.ROLE_USER_HDR,
        MOBILE_NO_USER_HDR: u.MOBILE_NO_USER_HDR,
        MAIL_ID_USER_HDR: u.MAIL_ID_USER_HDR,
        REMARKS_USER_HDR: u.REMARKS_USER_HDR,
        NEW_CARD_NO_USER_HDR: u.NEW_CARD_NO_USER_HDR,
        STATUS_USER_HDR: "ACTIVE",
        STOCK_SHOW_STATUS: "Y",
        OUTSIDE_ACCESS_Y_N: u.ROLE_USER_HDR.includes("Admin") ? "Y" : "N",
        CREATED_USER_USER_HDR: "SYSTEM",
        CREATED_DATE_USER_HDR: new Date(),
        CREATED_MAC_ADDR_USER_HDR: "00:00:00:00:00:00",
      })),
    );
    const insertedUsers = await db
      .insert(TBL_USER_INFO_HDR)
      .values(users)
      .onConflictDoNothing()
      .returning();
    const sriUserId = insertedUsers.find(u => u.LOGIN_NAME === "Sri")?.LOGIN_ID_USER_HDR || 1;

    // 3. Currencies
    console.log("Seeding Currencies...");
    const currencies = [
      {
        CURRENCY_NAME: "TZS",
        ADDRESS: "TZS",
        Exchange_Rate: "1.0",
        REMARKS: "Local currency",
        STATUS_MASTER: "Active",
        CREATED_BY: "SYSTEM",
        CREATED_DATE: new Date(),
        CREATED_MAC_ADDRESS: "00:00:00:00:00:00",
      },
      {
        CURRENCY_NAME: "$",
        ADDRESS: "USD",
        Exchange_Rate: "2500.0",
        REMARKS: "International currency",
        STATUS_MASTER: "Active",
        CREATED_BY: "SYSTEM",
        CREATED_DATE: new Date(),
        CREATED_MAC_ADDRESS: "00:00:00:00:00:00",
      },
    ];
    const insertedCurrencies = await db
      .insert(TBL_CURRENCY_MASTER)
      .values(currencies)
      .onConflictDoNothing()
      .returning();
    const tzsId = insertedCurrencies.find((c) => c.ADDRESS === "TZS")?.CURRENCY_ID || 1;
    const usdId = insertedCurrencies.find((c) => c.ADDRESS === "USD")?.CURRENCY_ID || 2;

    // 4. Countries
    console.log("Seeding Countries...");
    const tanzania = {
      Country_Name: "Tanzania",
      nicename: "Tanzania",
      iso3: "TZA",
      numcode: 834,
      phonecode: 255,
      Batch_No: "TZ",
      Remarks: "Main country",
      Status_Master: "Active",
      Created_User: "SYSTEM",
      Created_Date: new Date(),
      Created_Mac_Address: "00:00:00:00:00:00",
    };
    const insertedCountry = await db
      .insert(TBL_COUNTRY_MASTER)
      .values(tanzania)
      .onConflictDoNothing()
      .returning();
    const tzId = insertedCountry[0]?.Country_Id || 1;

    // 5. Regions
    console.log("Seeding Regions...");
    const regionsData = [
      {
        REGION_NAME: "Arusha",
        COUNTRY_ID: tzId,
        CAPITAL: "Arusha City",
        NO_OF_DISTRICTS: 7,
        TOTAL_POPULATION: "1700000",
        ZONE_NAME: "Northern",
        DISTANCE_FROM_ARUSHA: "0",
        STATUS_MASTER: "Active",
        CREATED_BY: "SYSTEM",
        CREATED_DATE: new Date(),
        CREATED_MAC_ADDRESS: "00:00:00:00:00:00",
      },
      {
        REGION_NAME: "Dar es Salaam",
        COUNTRY_ID: tzId,
        CAPITAL: "Dar es Salaam",
        NO_OF_DISTRICTS: 5,
        TOTAL_POPULATION: "5400000",
        ZONE_NAME: "Coastal",
        DISTANCE_FROM_ARUSHA: "550",
        STATUS_MASTER: "Active",
        CREATED_BY: "SYSTEM",
        CREATED_DATE: new Date(),
        CREATED_MAC_ADDRESS: "00:00:00:00:00:00",
      },
      {
        REGION_NAME: "Dodoma",
        COUNTRY_ID: tzId,
        CAPITAL: "Dodoma City",
        NO_OF_DISTRICTS: 7,
        TOTAL_POPULATION: "2350000",
        ZONE_NAME: "Central",
        DISTANCE_FROM_ARUSHA: "400",
        STATUS_MASTER: "Active",
        CREATED_BY: "SYSTEM",
        CREATED_DATE: new Date(),
        CREATED_MAC_ADDRESS: "00:00:00:00:00:00",
      },
      {
        REGION_NAME: "Mwanza",
        COUNTRY_ID: tzId,
        CAPITAL: "Mwanza City",
        NO_OF_DISTRICTS: 7,
        TOTAL_POPULATION: "3100000",
        ZONE_NAME: "Lake Zone",
        DISTANCE_FROM_ARUSHA: "800",
        STATUS_MASTER: "Active",
        CREATED_BY: "SYSTEM",
        CREATED_DATE: new Date(),
        CREATED_MAC_ADDRESS: "00:00:00:00:00:00",
      },
      {
        REGION_NAME: "Kilimanjaro",
        COUNTRY_ID: tzId,
        CAPITAL: "Moshi",
        NO_OF_DISTRICTS: 6,
        TOTAL_POPULATION: "1640000",
        ZONE_NAME: "Northern",
        DISTANCE_FROM_ARUSHA: "150",
        STATUS_MASTER: "Active",
        CREATED_BY: "SYSTEM",
        CREATED_DATE: new Date(),
        CREATED_MAC_ADDRESS: "00:00:00:00:00:00",
      },
    ];
    const insertedRegions = await db
      .insert(TBL_REGION_MASTER)
      .values(regionsData)
      .onConflictDoNothing()
      .returning();
    const arushaId = insertedRegions.find((r) => r.REGION_NAME === "Arusha")?.REGION_ID || 1;
    const darId = insertedRegions.find((r) => r.REGION_NAME === "Dar es Salaam")?.REGION_ID || 2;
    const dodomaId = insertedRegions.find((r) => r.REGION_NAME === "Dodoma")?.REGION_ID || 3;
    const mwanzaId = insertedRegions.find((r) => r.REGION_NAME === "Mwanza")?.REGION_ID || 4;
    const kilimanjaroId = insertedRegions.find((r) => r.REGION_NAME === "Kilimanjaro")?.REGION_ID || 5;

    // 6. Districts
    console.log("Seeding Districts...");
    const districtsData = [
      {
        District_Name: "Arusha Urban",
        Country_Id: tzId,
        Region_Id: arushaId,
        Total_Population: "416442",
        Zone_Name: "Northern",
        Distance_From_Arusha: "0",
        Status_Master: "Active",
        Created_By: "SYSTEM",
        Created_Date: new Date(),
        Created_Mac_Address: "00:00:00:00:00:00",
      },
      {
        District_Name: "Arumeru",
        Country_Id: tzId,
        Region_Id: arushaId,
        Total_Population: "642000",
        Zone_Name: "Northern",
        Distance_From_Arusha: "30",
        Status_Master: "Active",
        Created_By: "SYSTEM",
        Created_Date: new Date(),
        Created_Mac_Address: "00:00:00:00:00:00",
      },
      {
        District_Name: "Ilala",
        Country_Id: tzId,
        Region_Id: darId,
        Total_Population: "1364200",
        Zone_Name: "Coastal",
        Distance_From_Arusha: "550",
        Status_Master: "Active",
        Created_By: "SYSTEM",
        Created_Date: new Date(),
        Created_Mac_Address: "00:00:00:00:00:00",
      },
      {
        District_Name: "Kinondoni",
        Country_Id: tzId,
        Region_Id: darId,
        Total_Population: "1811000",
        Zone_Name: "Coastal",
        Distance_From_Arusha: "550",
        Status_Master: "Active",
        Created_By: "SYSTEM",
        Created_Date: new Date(),
        Created_Mac_Address: "00:00:00:00:00:00",
      },
    ];
    const insertedDistricts = await db
      .insert(TBL_DISTRICT_MASTER)
      .values(districtsData)
      .onConflictDoNothing()
      .returning();
    const arushaUrbanId = insertedDistricts.find(d => d.District_Name === "Arusha Urban")?.District_id || 1;
    const ilalaId = insertedDistricts.find(d => d.District_Name === "Ilala")?.District_id || 3;

    // 7. Billing Locations
    console.log("Seeding Billing Locations...");
    const billingLocs = [
      {
        Billing_Location_Name: "Dar Central Billing",
        Billing_Location_Description: "HQ Billing Office",
        Remarks: "Main billing location",
        Status_Master: "Active",
        Created_By: "SYSTEM",
        Created_Date: new Date(),
        Created_Mac_Address: "00:00:00:00:00:00",
      },
      {
        Billing_Location_Name: "Arusha Regional Billing",
        Billing_Location_Description: "Northern Zone Billing",
        Remarks: "Regional billing office",
        Status_Master: "Active",
        Created_By: "SYSTEM",
        Created_Date: new Date(),
        Created_Mac_Address: "00:00:00:00:00:00",
      },
    ];
    const insertedBLocs = await db
      .insert(TBL_BILLING_LOCATION_MASTER)
      .values(billingLocs)
      .onConflictDoNothing()
      .returning();
    const darBillingId = insertedBLocs[0]?.Billing_Location_Id || 1;
    const arushaBillingId = insertedBLocs[1]?.Billing_Location_Id || 2;

    // 8. Companies
    console.log("Seeding Companies...");
    const companies = [
      {
        Company_Name: "AgroManage Tanzania Ltd",
        TIN_Number: "123-456-789",
        Address: "Nyerere Road, Dar es Salaam",
        Contact_Person: "John Doe",
        Contact_Number: "255712345678",
        Email: "info@agromanage.co.tz",
        Short_Code: "AMTZ",
        Finance_Start_Month: "July",
        Finance_End_Month: "June",
        Year_Code: "2024",
        Company_Full_Name: "AgroManage Tanzania Limited",
        Currency_ID: tzsId,
        TimeZone: "Africa/Dar_es_Salaam",
        No_Of_User: 50,
        WebSite: "www.agromanage.co.tz",
        Remarks: "Main company",
        Status_Master: "Active",
        Created_By: "SYSTEM",
        Created_Date: new Date(),
        Created_Mac_Address: "00:00:00:00:00:00",
      },
    ];
    const insertedCompanies = await db
      .insert(TBL_COMPANY_MASTER)
      .values(companies)
      .onConflictDoNothing()
      .returning();
    const compId = insertedCompanies[0]?.Company_Id || 1;

    // 9. Locations
    console.log("Seeding Locations...");
    const locations = [
      {
        Location_Name: "Main HQ",
        Location_Description: "Headquarters location",
        Remarks: "Primary office location",
        Status_Master: "Active",
        Created_By: "SYSTEM",
        Created_Date: new Date(),
        Created_Mac_Address: "00:00:00:00:00:00",
      },
      {
        Location_Name: "Northern Zone",
        Location_Description: "Arusha regional office",
        Remarks: "Regional operations",
        Status_Master: "Active",
        Created_By: "SYSTEM",
        Created_Date: new Date(),
        Created_Mac_Address: "00:00:00:00:00:00",
      },
      {
        Location_Name: "Lake Zone",
        Location_Description: "Mwanza regional office",
        Remarks: "Regional operations",
        Status_Master: "Active",
        Created_By: "SYSTEM",
        Created_Date: new Date(),
        Created_Mac_Address: "00:00:00:00:00:00",
      },
    ];
    const insertedLocs = await db
      .insert(TBL_LOCATION_MASTER)
      .values(locations)
      .onConflictDoNothing()
      .returning();
    const mainLocId = insertedLocs[0]?.Location_Id || 1;
    const northernLocId = insertedLocs[1]?.Location_Id || 2;
    const lakeLocId = insertedLocs[2]?.Location_Id || 3;

    // 10. Stores
    console.log("Seeding Stores...");
    const stores = [
      {
        Store_Name: "Arusha Central Store",
        Location_Id: northernLocId,
        Manager_Name: "James Mwita",
        Store_Short_Code: "ARS",
        Store_Short_Name: "Arusha Store",
        Email_Address: "arusha@agromanage.co.tz",
        CC_Email_Address: "cc.arusha@agromanage.co.tz",
        BCC_Email_Address: "bcc.arusha@agromanage.co.tz",
        Response_Directors_Name: "Director Northern Zone",
        Remarks: "Main store for northern zone",
        Status_Master: "Active",
        Created_By: "SYSTEM",
        Created_Date: new Date(),
        Created_Mac_Address: "00:00:00:00:00:00",
      },
      {
        Store_Name: "Dar es Salaam Central Store",
        Location_Id: mainLocId,
        Manager_Name: "Sarah Mushi",
        Store_Short_Code: "DAR",
        Store_Short_Name: "Dar Store",
        Email_Address: "dar@agromanage.co.tz",
        CC_Email_Address: "cc.dar@agromanage.co.tz",
        Remarks: "Main store for coastal zone",
        Status_Master: "Active",
        Created_By: "SYSTEM",
        Created_Date: new Date(),
        Created_Mac_Address: "00:00:00:00:00:00",
      },
      {
        Store_Name: "Mwanza Lake Store",
        Location_Id: lakeLocId,
        Manager_Name: "Peter Nyamhanga",
        Store_Short_Code: "MWZ",
        Store_Short_Name: "Mwanza Store",
        Email_Address: "mwanza@agromanage.co.tz",
        Remarks: "Main store for lake zone",
        Status_Master: "Active",
        Created_By: "SYSTEM",
        Created_Date: new Date(),
        Created_Mac_Address: "00:00:00:00:00:00",
      },
    ];
    const insertedStores = await db
      .insert(TBL_STORE_MASTER)
      .values(stores)
      .onConflictDoNothing()
      .returning();
    const arushaStoreId = insertedStores.find(s => s.Store_Name === "Arusha Central Store")?.Store_Id || 1;
    const darStoreId = insertedStores.find(s => s.Store_Name === "Dar es Salaam Central Store")?.Store_Id || 2;
    const mwanzaStoreId = insertedStores.find(s => s.Store_Name === "Mwanza Lake Store")?.Store_Id || 3;

    // 11. User to Store Mapping
    console.log("Seeding User to Store Mapping...");
    await db
      .insert(TBL_USER_TO_STORE_MAPPING)
      .values([
        {
          USER_ID_USER_TO_ROLE: sriUserId,
          COMPANY_ID: compId,
          STORE_ID_USER_TO_ROLE: arushaStoreId,
          ROLE_ID_USER_TO_ROLE: superAdminRoleId,
          STATUS_USER_TO_ROLE: "ACTIVE",
          CREATED_USER_USER_TO_ROLE: "SYSTEM",
          CREATED_DATE_USER_TO_ROLE: new Date(),
          CREATED_MAC_ADDR_USER_TO_ROLE: "00:00:00:00:00:00",
        },
        {
          USER_ID_USER_TO_ROLE: sriUserId,
          COMPANY_ID: compId,
          STORE_ID_USER_TO_ROLE: darStoreId,
          ROLE_ID_USER_TO_ROLE: superAdminRoleId,
          STATUS_USER_TO_ROLE: "ACTIVE",
          CREATED_USER_USER_TO_ROLE: "SYSTEM",
          CREATED_DATE_USER_TO_ROLE: new Date(),
          CREATED_MAC_ADDR_USER_TO_ROLE: "00:00:00:00:00:00",
        },
      ])
      .onConflictDoNothing();

    // 12. Payment Terms
    console.log("Seeding Payment Terms...");
    const insertedPaymentTerms = await db
      .insert(TBL_PAYMENT_TERM_MASTER)
      .values([
        {
          PAYMENT_TERM_NAME: "Cash on Delivery",
          REMARKS: "Payment upon delivery",
          STATUS_ENTRY: "Active",
          CREATED_BY: "SYSTEM",
          CREATED_DATE: new Date(),
          CREATED_MAC_ADDRESS: "00:00:00:00:00:00",
        },
        {
          PAYMENT_TERM_NAME: "Credit 30 Days",
          REMARKS: "Net 30 days payment term",
          STATUS_ENTRY: "Active",
          CREATED_BY: "SYSTEM",
          CREATED_DATE: new Date(),
          CREATED_MAC_ADDRESS: "00:00:00:00:00:00",
        },
        {
          PAYMENT_TERM_NAME: "Credit 60 Days",
          REMARKS: "Net 60 days payment term",
          STATUS_ENTRY: "Active",
          CREATED_BY: "SYSTEM",
          CREATED_DATE: new Date(),
          CREATED_MAC_ADDRESS: "00:00:00:00:00:00",
        },
      ])
      .onConflictDoNothing()
      .returning();
    const cashOnDeliveryId = insertedPaymentTerms[0]?.PAYMENT_TERM_ID || 1;

    // 13. Additional Cost Types
    console.log("Seeding Additional Cost Types...");
    await db
      .insert(TBL_ADDITIONAL_COST_TYPE_MASTER)
      .values([
        {
          ADDITIONAL_COST_TYPE_NAME: "Freight Charges",
          REMARKS: "Transportation costs",
          STATUS_ENTRY: "Active",
          CREATED_BY: "SYSTEM",
          CREATED_DATE: new Date(),
          CREATED_MAC_ADDRESS: "00:00:00:00:00:00",
        },
        {
          ADDITIONAL_COST_TYPE_NAME: "Insurance",
          REMARKS: "Insurance coverage",
          STATUS_ENTRY: "Active",
          CREATED_BY: "SYSTEM",
          CREATED_DATE: new Date(),
          CREATED_MAC_ADDRESS: "00:00:00:00:00:00",
        },
        {
          ADDITIONAL_COST_TYPE_NAME: "Handling Charges",
          REMARKS: "Warehouse handling",
          STATUS_ENTRY: "Active",
          CREATED_BY: "SYSTEM",
          CREATED_DATE: new Date(),
          CREATED_MAC_ADDRESS: "00:00:00:00:00:00",
        },
      ])
      .onConflictDoNothing();

    // 14. Payment Mode Master
    console.log("Seeding Payment Modes...");
    const insertedPaymentModes = await db
      .insert(TBL_PAYMENT_MODE_MASTER)
      .values([
        {
          PAYMENT_MODE_NAME: "Cash",
          PAYMENT_MODE_PERCENTAGE: "0",
          REMARKS: "Cash payment",
          STATUS_ENTRY: "Active",
          CREATED_BY: "SYSTEM",
          CREATED_DATE: new Date(),
          CREATED_MAC_ADDRESS: "00:00:00:00:00:00",
        },
        {
          PAYMENT_MODE_NAME: "Bank Transfer",
          PAYMENT_MODE_PERCENTAGE: "0",
          REMARKS: "Bank transfer payment",
          STATUS_ENTRY: "Active",
          CREATED_BY: "SYSTEM",
          CREATED_DATE: new Date(),
          CREATED_MAC_ADDRESS: "00:00:00:00:00:00",
        },
        {
          PAYMENT_MODE_NAME: "M-Pesa",
          PAYMENT_MODE_PERCENTAGE: "0.5",
          REMARKS: "Mobile money payment",
          STATUS_ENTRY: "Active",
          CREATED_BY: "SYSTEM",
          CREATED_DATE: new Date(),
          CREATED_MAC_ADDRESS: "00:00:00:00:00:00",
        },
      ])
      .onConflictDoNothing()
      .returning();
    const cashPaymentId = insertedPaymentModes[0]?.PAYMENT_MODE_ID || 1;

    // 15. Customer Payment Mode Master
    console.log("Seeding Customer Payment Modes...");
    const insertedCustomerPaymentModes = await db
      .insert(TBL_CUSTOMER_PAYMENT_MODE_MASTER)
      .values([
        {
          PAYMENT_MODE_NAME: "Cash",
          SHORT_CODE: "CASH",
          REMARKS: "Cash payment",
          STATUS_MASTER: "Active",
          CREATED_BY: "SYSTEM",
          CREATED_DATE: new Date(),
          CREATED_MAC_ADDRESS: "00:00:00:00:00:00",
        },
        {
          PAYMENT_MODE_NAME: "Bank Transfer",
          SHORT_CODE: "BT",
          REMARKS: "Bank transfer",
          STATUS_MASTER: "Active",
          CREATED_BY: "SYSTEM",
          CREATED_DATE: new Date(),
          CREATED_MAC_ADDRESS: "00:00:00:00:00:00",
        },
        {
          PAYMENT_MODE_NAME: "Cheque",
          SHORT_CODE: "CHQ",
          REMARKS: "Cheque payment",
          STATUS_MASTER: "Active",
          CREATED_BY: "SYSTEM",
          CREATED_DATE: new Date(),
          CREATED_MAC_ADDRESS: "00:00:00:00:00:00",
        },
      ])
      .onConflictDoNothing()
      .returning();
    const customerCashPaymentId = insertedCustomerPaymentModes[0]?.PAYMENT_MODE_ID || 1;

    // 16. Banks
    console.log("Seeding Banks...");
    const insertedBanks = await db
      .insert(TBL_BANK_MASTER)
      .values([
        {
          BANK_NAME: "CRDB Bank",
          ADDRESS: "Dar es Salaam",
          REMARKS: "Commercial bank",
          STATUS_MASTER: "Active",
          CREATED_BY: "SYSTEM",
          CREATED_DATE: new Date(),
          CREATED_MAC_ADDRESS: "00:00:00:00:00:00",
        },
        {
          BANK_NAME: "NMB Bank",
          ADDRESS: "Dar es Salaam",
          REMARKS: "Commercial bank",
          STATUS_MASTER: "Active",
          CREATED_BY: "SYSTEM",
          CREATED_DATE: new Date(),
          CREATED_MAC_ADDRESS: "00:00:00:00:00:00",
        },
        {
          BANK_NAME: "Stanbic Bank",
          ADDRESS: "Dar es Salaam",
          REMARKS: "International bank",
          STATUS_MASTER: "Active",
          CREATED_BY: "SYSTEM",
          CREATED_DATE: new Date(),
          CREATED_MAC_ADDRESS: "00:00:00:00:00:00",
        },
      ])
      .onConflictDoNothing()
      .returning();
    const crdbBankId = insertedBanks[0]?.BANK_ID || 1;

    // 17. Company Bank Accounts
    console.log("Seeding Company Bank Accounts...");
    await db
      .insert(TBL_COMPANY_BANK_ACCOUNT_MASTER)
      .values([
        {
          Company_id: compId,
          Bank_Id: crdbBankId,
          Account_Name: "AgroManage Operating Account",
          Account_Number: "01-23456789",
          Swift_Code: "CRDBTZTZ",
          Branch_Address: "Dar es Salaam",
          Bank_Branch_Name: "Main Branch",
          Currency_Id: tzsId,
          Remarks: "Main operating account",
          Status_Master: "Active",
          Created_By: "SYSTEM",
          Created_Date: new Date(),
          Created_Mac_Address: "00:00:00:00:00:00",
        },
      ])
      .onConflictDoNothing();

    // 18. Product Main Categories
    console.log("Seeding Product Main Categories...");
    const mainCategories = [
      {
        MAIN_CATEGORY_NAME: "Fertilizers",
        REMARKS: "Agricultural fertilizers",
        STATUS_MASTER: "Active",
        CREATED_BY: "SYSTEM",
        CREATED_DATE: new Date(),
        CREATED_MAC_ADDRESS: "00:00:00:00:00:00",
      },
      {
        MAIN_CATEGORY_NAME: "Pesticides",
        REMARKS: "Crop protection products",
        STATUS_MASTER: "Active",
        CREATED_BY: "SYSTEM",
        CREATED_DATE: new Date(),
        CREATED_MAC_ADDRESS: "00:00:00:00:00:00",
      },
      {
        MAIN_CATEGORY_NAME: "Seeds",
        REMARKS: "High quality seeds",
        STATUS_MASTER: "Active",
        CREATED_BY: "SYSTEM",
        CREATED_DATE: new Date(),
        CREATED_MAC_ADDRESS: "00:00:00:00:00:00",
      },
      {
        MAIN_CATEGORY_NAME: "Herbicides",
        REMARKS: "Weed control products",
        STATUS_MASTER: "Active",
        CREATED_BY: "SYSTEM",
        CREATED_DATE: new Date(),
        CREATED_MAC_ADDRESS: "00:00:00:00:00:00",
      },
      {
        MAIN_CATEGORY_NAME: "Fungicides",
        REMARKS: "Fungal disease control",
        STATUS_MASTER: "Active",
        CREATED_BY: "SYSTEM",
        CREATED_DATE: new Date(),
        CREATED_MAC_ADDRESS: "00:00:00:00:00:00",
      },
    ];
    const insertedMainCats = await db
      .insert(TBL_PRODUCT_MAIN_CATEGORY_MASTER)
      .values(mainCategories)
      .onConflictDoNothing()
      .returning();
    const fertMainId = insertedMainCats.find(c => c.MAIN_CATEGORY_NAME === "Fertilizers")?.MAIN_CATEGORY_ID || 1;
    const pesticideMainId = insertedMainCats.find(c => c.MAIN_CATEGORY_NAME === "Pesticides")?.MAIN_CATEGORY_ID || 2;
    const seedsMainId = insertedMainCats.find(c => c.MAIN_CATEGORY_NAME === "Seeds")?.MAIN_CATEGORY_ID || 3;
    const herbicidesMainId = insertedMainCats.find(c => c.MAIN_CATEGORY_NAME === "Herbicides")?.MAIN_CATEGORY_ID || 4;
    const fungicidesMainId = insertedMainCats.find(c => c.MAIN_CATEGORY_NAME === "Fungicides")?.MAIN_CATEGORY_ID || 5;

    // 19. Product Sub Categories
    console.log("Seeding Product Sub Categories...");
    const subCategories = [
      {
        SUB_CATEGORY_NAME: "NPK Fertilizers",
        MAIN_CATEGORY_ID: fertMainId,
        REMARKS: "Nitrogen, Phosphorus, Potassium blends",
        STATUS_MASTER: "Active",
        CREATED_BY: "SYSTEM",
        CREATED_DATE: new Date(),
        CREATED_MAC_ADDRESS: "00:00:00:00:00:00",
      },
      {
        SUB_CATEGORY_NAME: "Urea",
        MAIN_CATEGORY_ID: fertMainId,
        REMARKS: "High nitrogen fertilizer",
        STATUS_MASTER: "Active",
        CREATED_BY: "SYSTEM",
        CREATED_DATE: new Date(),
        CREATED_MAC_ADDRESS: "00:00:00:00:00:00",
      },
      {
        SUB_CATEGORY_NAME: "Insecticides",
        MAIN_CATEGORY_ID: pesticideMainId,
        REMARKS: "Insect control products",
        STATUS_MASTER: "Active",
        CREATED_BY: "SYSTEM",
        CREATED_DATE: new Date(),
        CREATED_MAC_ADDRESS: "00:00:00:00:00:00",
      },
      {
        SUB_CATEGORY_NAME: "Maize Seeds",
        MAIN_CATEGORY_ID: seedsMainId,
        REMARKS: "High yield maize varieties",
        STATUS_MASTER: "Active",
        CREATED_BY: "SYSTEM",
        CREATED_DATE: new Date(),
        CREATED_MAC_ADDRESS: "00:00:00:00:00:00",
      },
      {
        SUB_CATEGORY_NAME: "Rice Seeds",
        MAIN_CATEGORY_ID: seedsMainId,
        REMARKS: "High yield rice varieties",
        STATUS_MASTER: "Active",
        CREATED_BY: "SYSTEM",
        CREATED_DATE: new Date(),
        CREATED_MAC_ADDRESS: "00:00:00:00:00:00",
      },
      {
        SUB_CATEGORY_NAME: "Selective Herbicides",
        MAIN_CATEGORY_ID: herbicidesMainId,
        REMARKS: "Target specific weeds",
        STATUS_MASTER: "Active",
        CREATED_BY: "SYSTEM",
        CREATED_DATE: new Date(),
        CREATED_MAC_ADDRESS: "00:00:00:00:00:00",
      },
      {
        SUB_CATEGORY_NAME: "Systemic Fungicides",
        MAIN_CATEGORY_ID: fungicidesMainId,
        REMARKS: "Systemic disease control",
        STATUS_MASTER: "Active",
        CREATED_BY: "SYSTEM",
        CREATED_DATE: new Date(),
        CREATED_MAC_ADDRESS: "00:00:00:00:00:00",
      },
    ];
    const insertedSubCats = await db
      .insert(TBL_PRODUCT_SUB_CATEGORY_MASTER)
      .values(subCategories)
      .onConflictDoNothing()
      .returning();
    const npkSubId = insertedSubCats.find(c => c.SUB_CATEGORY_NAME === "NPK Fertilizers")?.SUB_CATEGORY_ID || 1;
    const ureaSubId = insertedSubCats.find(c => c.SUB_CATEGORY_NAME === "Urea")?.SUB_CATEGORY_ID || 2;
    const insecticidesSubId = insertedSubCats.find(c => c.SUB_CATEGORY_NAME === "Insecticides")?.SUB_CATEGORY_ID || 3;
    const maizeSubId = insertedSubCats.find(c => c.SUB_CATEGORY_NAME === "Maize Seeds")?.SUB_CATEGORY_ID || 4;

    // 20. Products
    console.log("Seeding Products...");
    const products = [
      {
        PRODUCT_NAME: "Yara Mila Winner 25kg",
        MAIN_CATEGORY_ID: fertMainId,
        SUB_CATEGORY_ID: npkSubId,
        UOM: "BAG",
        QTY_PER_PACKING: "25",
        ALTERNATE_UOM: "KG",
        REMARKS: "NPK 25:5:5 blend",
        STATUS_MASTER: "Active",
        CREATED_BY: "SYSTEM",
        CREATED_DATE: new Date(),
        CREATED_MAC_ADDRESS: "00:00:00:00:00:00",
      },
      {
        PRODUCT_NAME: "Urea 46% 50kg",
        MAIN_CATEGORY_ID: fertMainId,
        SUB_CATEGORY_ID: ureaSubId,
        UOM: "BAG",
        QTY_PER_PACKING: "50",
        ALTERNATE_UOM: "KG",
        REMARKS: "High nitrogen fertilizer",
        STATUS_MASTER: "Active",
        CREATED_BY: "SYSTEM",
        CREATED_DATE: new Date(),
        CREATED_MAC_ADDRESS: "00:00:00:00:00:00",
      },
      {
        PRODUCT_NAME: "Confidor 200SL",
        MAIN_CATEGORY_ID: pesticideMainId,
        SUB_CATEGORY_ID: insecticidesSubId,
        UOM: "BOTTLE",
        QTY_PER_PACKING: "1",
        ALTERNATE_UOM: "L",
        REMARKS: "Systemic insecticide",
        STATUS_MASTER: "Active",
        CREATED_BY: "SYSTEM",
        CREATED_DATE: new Date(),
        CREATED_MAC_ADDRESS: "00:00:00:00:00:00",
      },
      {
        PRODUCT_NAME: "DK 777 Maize Seed",
        MAIN_CATEGORY_ID: seedsMainId,
        SUB_CATEGORY_ID: maizeSubId,
        UOM: "BAG",
        QTY_PER_PACKING: "10",
        ALTERNATE_UOM: "KG",
        REMARKS: "High yield maize variety",
        STATUS_MASTER: "Active",
        CREATED_BY: "SYSTEM",
        CREATED_DATE: new Date(),
        CREATED_MAC_ADDRESS: "00:00:00:00:00:00",
      },
    ];
    const insertedProducts = await db
      .insert(TBL_PRODUCT_MASTER)
      .values(products)
      .onConflictDoNothing()
      .returning();
    const yaraProductId = insertedProducts.find(p => p.PRODUCT_NAME === "Yara Mila Winner 25kg")?.PRODUCT_ID || 1;
    const ureaProductId = insertedProducts.find(p => p.PRODUCT_NAME === "Urea 46% 50kg")?.PRODUCT_ID || 2;

    // 21. Suppliers
    console.log("Seeding Suppliers...");
    const insertedSuppliers = await db
      .insert(TBL_SUPPLIER_MASTER)
      .values([
        {
          Supplier_Type: "Local",
          Supplier_Name: "Tanzania Fertilizer Company",
          TIN_Number: "123-456-789",
          Vat_Register_No: "VAT-001",
          SH_Nick_Name: "TFC",
          Shipment_Mode: "Road",
          Country_Id: tzId,
          Region_Id: darId,
          District_Id: ilalaId,
          Address: "Dar es Salaam",
          Contact_Person: "John Mwangi",
          Phone_number: "255712345678",
          Mail_Id: "info@tfc.co.tz",
          vat_Percentage: "18",
          Withholding_vat_percentage: "6",
          Remarks: "Main fertilizer supplier",
          Status_Master: "Active",
          Created_User: "SYSTEM",
          Created_Date: new Date(),
          Created_Mac_Address: "00:00:00:00:00:00",
        },
        {
          Supplier_Type: "International",
          Supplier_Name: "Yara International",
          TIN_Number: "987-654-321",
          Vat_Register_No: "VAT-002",
          SH_Nick_Name: "Yara",
          Shipment_Mode: "Sea",
          Country_Id: tzId,
          Region_Id: darId,
          District_Id: ilalaId,
          Address: "Dar es Salaam Port",
          Contact_Person: "Peter Hansen",
          Phone_number: "255712345679",
          Mail_Id: "sales@yara.com",
          vat_Percentage: "18",
          Withholding_vat_percentage: "6",
          Status_Master: "Active",
          Created_User: "SYSTEM",
          Created_Date: new Date(),
          Created_Mac_Address: "00:00:00:00:00:00",
        },
      ])
      .onConflictDoNothing()
      .returning();
    const tfcSupplierId = insertedSuppliers[0]?.Supplier_Id || 1;

    // 22. Customers
    console.log("Seeding Customers...");
    const insertedCustomers = await db
      .insert(TBL_CUSTOMER_MASTER)
      .values([
        {
          Customer_Name: "Arusha Farmers Coop",
          TIN_Number: "987-654-321",
          VAT_Number: "VAT-987",
          Contact_Person: "Joseph Mwita",
          Contact_Number: "255712345680",
          Location: "Arusha",
          Nature_Of_Business: "Agriculture",
          Billing_Location_Id: arushaBillingId,
          Country_Id: tzId,
          Region_Id: arushaId,
          District_Id: arushaUrbanId,
          currency_id: tzsId,
          CREDIT_ALLOWED: "Yes",
          Address: "Arusha CBD",
          Email_Address: "info@arushafarmers.co.tz",
          PHONE_NUMBER_2: "255712345681",
          TIER: "Gold",
          Company_Head_Contact_Person: "CEO",
          Company_Head_Phone_No: "255712345682",
          Company_Head_Email: "ceo@arushafarmers.co.tz",
          Accounts_Contact_Person: "Finance Manager",
          Accounts_Phone_No: "255712345683",
          Accounts_Email: "finance@arushafarmers.co.tz",
          Remarks: "Large cooperative",
          Status_Master: "Active",
          Created_By: "SYSTEM",
          Created_Date: new Date(),
          Created_Mac_Address: "00:00:00:00:00:00",
        },
        {
          Customer_Name: "Kilimanjaro Agro Dealers",
          TIN_Number: "456-789-123",
          VAT_Number: "VAT-456",
          Contact_Person: "Grace Moshi",
          Contact_Number: "255712345684",
          Location: "Moshi",
          Nature_Of_Business: "Agricultural inputs",
          Billing_Location_Id: arushaBillingId,
          Country_Id: tzId,
          Region_Id: kilimanjaroId,
          District_Id: arushaUrbanId,
          currency_id: tzsId,
          CREDIT_ALLOWED: "Yes",
          Address: "Moshi Town",
          Email_Address: "info@kilimanjaroagro.co.tz",
          TIER: "Silver",
          Status_Master: "Active",
          Created_By: "SYSTEM",
          Created_Date: new Date(),
          Created_Mac_Address: "00:00:00:00:00:00",
        },
      ])
      .onConflictDoNothing()
      .returning();
    const arushaCustomerId = insertedCustomers[0]?.Customer_Id || 1;

    // 23. Customer Address Details
    console.log("Seeding Customer Address Details...");
    await db
      .insert(TBL_CUSTOMER_ADDRESS_DETAILS)
      .values([
        {
          Customer_Id: arushaCustomerId,
          ADDRESS_TYPE: "Billing",
          Address: "Sokoine Road, Arusha",
          LOCATION_AREA: "Arusha CBD",
          Remarks: "Main office",
          Status_Master: "Active",
          Created_By: "SYSTEM",
          Created_Date: new Date(),
          Created_Mac_Address: "00:00:00:00:00:00",
        },
      ])
      .onConflictDoNothing();

    // 24. VAT Percentage Settings
    console.log("Seeding VAT Percentage Settings...");
    await db
      .insert(TBL_VAT_PERCENTAGE_SETTING)
      .values([
        {
          COMPANY_ID: compId,
          VAT_PERCENTAGE: "18",
          EFFECTIVE_FROM: new Date("2024-01-01"),
          EFFECTIVE_TO: new Date("2025-12-31"),
          REMARKS: "Standard VAT rate",
          STATUS_MASTER: "Active",
          CREATED_BY: "SYSTEM",
          CREATED_DATE: new Date(),
          CREATED_MAC_ADDRESS: "00:00:00:00:00:00",
        },
      ])
      .onConflictDoNothing();

    // 25. Exchange Rate Master
    console.log("Seeding Exchange Rate Master...");
    await db
      .insert(TBL_EXCHANGE_RATE_MASTER)
      .values([
        {
          Company_ID: compId,
          CURRENCY_ID: usdId,
          Exchange_Rate: "2500",
          REMARKS: "USD to TZS exchange rate",
          STATUS_MASTER: "Active",
          CREATED_BY: "SYSTEM",
          CREATED_DATE: new Date(),
          CREATED_MAC_ADDRESS: "00:00:00:00:00:00",
        },
      ])
      .onConflictDoNothing();

    // 26. Product Opening Stock
    console.log("Seeding Product Opening Stock...");
    await db
      .insert(TBL_PRODUCT_OPENING_STOCK)
      .values([
        {
          OPENING_STOCK_DATE: new Date("2024-01-01"),
          COMPANY_ID: compId,
          STORE_ID: arushaStoreId,
          MAIN_CATEGORY_ID: fertMainId,
          SUB_CATEGORY_ID: npkSubId,
          PRODUCT_ID: yaraProductId,
          TOTAL_QTY: "500",
          REMARKS: "Opening stock for Arusha store",
          STATUS_MASTER: "Active",
          CREATED_BY: "SYSTEM",
          CREATED_DATE: new Date(),
          CREATED_MAC_ADDRESS: "00:00:00:00:00:00",
        },
        {
          OPENING_STOCK_DATE: new Date("2024-01-01"),
          COMPANY_ID: compId,
          STORE_ID: darStoreId,
          MAIN_CATEGORY_ID: fertMainId,
          SUB_CATEGORY_ID: ureaSubId,
          PRODUCT_ID: ureaProductId,
          TOTAL_QTY: "1000",
          REMARKS: "Opening stock for Dar store",
          STATUS_MASTER: "Active",
          CREATED_BY: "SYSTEM",
          CREATED_DATE: new Date(),
          CREATED_MAC_ADDRESS: "00:00:00:00:00:00",
        },
      ])
      .onConflictDoNothing();

    // 27. Store Product Minimum Stock
    console.log("Seeding Store Product Minimum Stock...");
    await db
      .insert(TBL_STORE_PRODUCT_MINIMUM_STOCK)
      .values([
        {
          Company_id: compId,
          Store_Id: arushaStoreId,
          Main_Category_Id: fertMainId,
          Sub_Category_Id: npkSubId,
          Product_Id: yaraProductId,
          Minimum_Stock_Pcs: 50,
          Purchase_Alert_Qty: "100",
          Requested_By: "SYSTEM",
          Effective_From: new Date("2024-01-01"),
          Effective_To: new Date("2025-12-31"),
          Remarks: "Minimum stock level",
          Status_Master: "Active",
          Created_By: "SYSTEM",
          Created_Date: new Date(),
          Created_Mac_Address: "00:00:00:00:00:00",
        },
      ])
      .onConflictDoNothing();

    // 28. Accounts Ledger Group Master
    console.log("Seeding Accounts Ledger Group...");
    const insertedLedgerGroups = await db
      .insert(TBL_ACCOUNTS_LEDGER_GROUP_MASTER)
      .values([
        {
          LEDGER_GROUP_NAME: "Assets",
          REMARKS: "Company assets",
          STATUS_ENTRY: "Active",
          CREATED_BY: "SYSTEM",
          CREATED_DATE: new Date(),
          CREATED_MAC_ADDRESS: "00:00:00:00:00:00",
        },
        {
          LEDGER_GROUP_NAME: "Liabilities",
          REMARKS: "Company liabilities",
          STATUS_ENTRY: "Active",
          CREATED_BY: "SYSTEM",
          CREATED_DATE: new Date(),
          CREATED_MAC_ADDRESS: "00:00:00:00:00:00",
        },
        {
          LEDGER_GROUP_NAME: "Income",
          REMARKS: "Income accounts",
          STATUS_ENTRY: "Active",
          CREATED_BY: "SYSTEM",
          CREATED_DATE: new Date(),
          CREATED_MAC_ADDRESS: "00:00:00:00:00:00",
        },
        {
          LEDGER_GROUP_NAME: "Expenses",
          REMARKS: "Expense accounts",
          STATUS_ENTRY: "Active",
          CREATED_BY: "SYSTEM",
          CREATED_DATE: new Date(),
          CREATED_MAC_ADDRESS: "00:00:00:00:00:00",
        },
      ])
      .onConflictDoNothing()
      .returning();
    const assetsGroupId = insertedLedgerGroups[0]?.LEDGER_GROUP_ID || 1;

    // 29. Accounts Head Master
    console.log("Seeding Accounts Head Master...");
    await db
      .insert(TBL_ACCOUNTS_HEAD_MASTER)
      .values([
        {
          ACCOUNT_HEAD_NAME: "Cash Account",
          REMARKS: "Cash in hand",
          STATUS_ENTRY: "Active",
          CREATED_BY: "SYSTEM",
          CREATED_DATE: new Date(),
          CREATED_MAC_ADDRESS: "00:00:00:00:00:00",
        },
        {
          ACCOUNT_HEAD_NAME: "Bank Account",
          REMARKS: "Bank accounts",
          STATUS_ENTRY: "Active",
          CREATED_BY: "SYSTEM",
          CREATED_DATE: new Date(),
          CREATED_MAC_ADDRESS: "00:00:00:00:00:00",
        },
        {
          ACCOUNT_HEAD_NAME: "Sales Revenue",
          REMARKS: "Sales income",
          STATUS_ENTRY: "Active",
          CREATED_BY: "SYSTEM",
          CREATED_DATE: new Date(),
          CREATED_MAC_ADDRESS: "00:00:00:00:00:00",
        },
      ])
      .onConflictDoNothing();

    // 30. Accounts Ledger Master
    console.log("Seeding Accounts Ledger Master...");
    await db
      .insert(TBL_ACCOUNTS_LEDGER_MASTER)
      .values([
        {
          Company_id: compId,
          LEDGER_TYPE: "Asset",
          LEDGER_GROUP_ID: assetsGroupId,
          LEDGER_NAME: "Cash in Hand",
          LEDGER_DESC: "Petty cash",
          REMARKS: "Cash account",
          STATUS_MASTER: "Active",
          CREATED_BY: "SYSTEM",
          CREATED_DATE: new Date(),
          CREATED_MAC_ADDRESS: "00:00:00:00:00:00",
        },
      ])
      .onConflictDoNothing();

    // 31. Sales Person Master
    console.log("Seeding Sales Person Master...");
    await db
      .insert(TBL_SALES_PERSON_MASTER)
      .values([
        {
          Emp_Id: 1001,
          PERSON_NAME: "James Mwita",
          Designation_Name: "Senior Sales Manager",
          Sales_Contact_Person_Phone: "255712345685",
          Sales_Person_Email_Addres: "james.mwita@agromanage.co.tz",
          Reporting_Manager_Card_No: 1002,
          Reporting_Manager_Name: "John Doe",
          Reporting_Manager_Email_Address: "john.doe@agromanage.co.tz",
          Sales_Person_Designation: "Manager",
          REMARKS: "Northern zone",
          STATUS_MASTER: "Active",
          CREATED_BY: "SYSTEM",
          CREATED_DATE: new Date(),
          CREATED_MAC_ADDRESS: "00:00:00:00:00:00",
        },
        {
          Emp_Id: 1002,
          PERSON_NAME: "Sarah Mushi",
          Designation_Name: "Sales Representative",
          Sales_Contact_Person_Phone: "255712345686",
          Sales_Person_Email_Addres: "sarah.mushi@agromanage.co.tz",
          Reporting_Manager_Card_No: 1001,
          Reporting_Manager_Name: "James Mwita",
          Reporting_Manager_Email_Address: "james.mwita@agromanage.co.tz",
          Sales_Person_Designation: "Representative",
          REMARKS: "Coastal zone",
          STATUS_MASTER: "Active",
          CREATED_BY: "SYSTEM",
          CREATED_DATE: new Date(),
          CREATED_MAC_ADDRESS: "00:00:00:00:00:00",
        },
      ])
      .onConflictDoNothing();

    // 32. Customer Credit Limit Details
    console.log("Seeding Customer Credit Limit Details...");
    const insertedCreditLimits = await db
      .insert(TBL_CUSTOMER_CREDIT_LIMIT_DETAILS)
      .values([
        {
          Company_id: compId,
          Customer_Id: arushaCustomerId,
          Currency_id: tzsId,
          Valid_Type: "Annual",
          Requested_Credit_Limit_Days: 30,
          Requested_Credit_Limit_Amount: "5000000",
          Requested_Payment_Mode_Id: customerCashPaymentId,
          Requested_By: "SYSTEM",
          Requested_Date: new Date(),
          Total_Outstanding_Amount: "0",
          Over_Due_Outstanding_Amount: "0",
          Approved_Credit_Limit_Days: 30,
          Approved_Credit_Limit_Amount: "5000000",
          Approved_PAYMENT_MODE_ID: customerCashPaymentId,
          Effective_From: new Date("2024-01-01"),
          Effective_To: new Date("2024-12-31"),
          Finance_Head_1_Response_By: "SYSTEM",
          Finance_Head_1_Response_Date: new Date(),
          Finance_Head_1_Response_Status: "Approved",
          Respond_by: "SYSTEM",
          Respond_Status: "Approved",
          Respond_Date: new Date(),
          Remarks: "Initial credit limit",
          Status_Master: "Active",
          Created_By: "SYSTEM",
          Created_Date: new Date(),
          Created_Mac_Address: "00:00:00:00:00:00",
        },
      ])
      .onConflictDoNothing()
      .returning();
    const creditLimitId = insertedCreditLimits[0]?.Sno || 1;

    // 33. Customer Wise Product Price Settings
    console.log("Seeding Customer Wise Product Price Settings...");
    await db
      .insert(TBL_CUSTOMER_WISE_PRODUCT_PRICE_SETTINGS)
      .values([
        {
          Company_id: compId,
          Customer_Id: arushaCustomerId,
          Main_Category_Id: fertMainId,
          Sub_Category_Id: npkSubId,
          Product_Id: yaraProductId,
          UNIT_PRICE: "45000",
          VAT_Percentage: "18",
          Valid_Type: "Annual",
          currency_id: tzsId,
          Effective_From: new Date("2024-01-01"),
          Effective_To: new Date("2024-12-31"),
          Requested_By: "SYSTEM",
          Requested_Date: new Date(),
          Requested_Product_Amount: "45000",
          Approved_Product_Amount: "45000",
          Respond_By: "SYSTEM",
          Response_Status: "Approved",
          REspond_Date: new Date(),
          Remarks: "Special pricing for cooperative",
          Status_Master: "Active",
          Created_By: "SYSTEM",
          Created_Date: new Date(),
          Created_Mac_Address: "00:00:00:00:00:00",
        },
      ])
      .onConflictDoNothing();

    // 34. Field Header (Dynamic Fields)
    console.log("Seeding Field Headers...");
    const fieldHdrsData = [
      {
        project_name_fld_hdr: "AgroManage",
        field_category_fld_hdr: "CRM",
        field_desc_fld_hdr: "Customer Relationship Management Fields",
        status_fld_hdr: "Active",
        remarks_fld_hdr: "Core CRM metadata",
        created_user_fld_hdr: "SYSTEM",
        created_date_fld_hdr: new Date(),
        created_mac_addr_fld_hdr: "00:00:00:00:00:00",
      },
      {
        project_name_fld_hdr: "AgroManage",
        field_category_fld_hdr: "ERP",
        field_desc_fld_hdr: "Resource Planning Fields",
        status_fld_hdr: "Active",
        remarks_fld_hdr: "Core ERP metadata",
        created_user_fld_hdr: "SYSTEM",
        created_date_fld_hdr: new Date(),
        created_mac_addr_fld_hdr: "00:00:00:00:00:00",
      },
    ];
    const insertedFieldHdrs = await db
      .insert(TBL_FIELD_HDR)
      .values(fieldHdrsData)
      .onConflictDoNothing()
      .returning();
    const crmFieldId = insertedFieldHdrs[0]?.field_id_fld_hdr || 1;

    // 35. Field Details
    console.log("Seeding Field Details...");
    await db
      .insert(TBL_FIELD_DTL)
      .values([
        {
          field_id_fld_dtl: crmFieldId,
          activity_name_fld_dtl: "Lead Source",
          activity_desc_fld_dtl: "Where the customer came from",
          status_fld_dtl: "Active",
          remarks_fld_dtl: "Standard field",
          created_user_fld_dtl: "SYSTEM",
          created_date_fld_dtl: new Date(),
          created_mac_addr_fld_dtl: "00:00:00:00:00:00",
        },
      ])
      .onConflictDoNothing();

    // 36. Product Company Main Category Mapping
    console.log("Seeding Product Company Mapping...");
    await db
      .insert(TBL_PRODUCT_COMPANY_MAIN_CATEGORY_MAPPING)
      .values([
        {
          Company_Id: compId,
          Main_Category_Id: fertMainId,
          Remarks: "Mapping for fertilizers",
          Status_Master: "Active",
          Created_By: "SYSTEM",
          Created_Date: new Date(),
          Created_Mac_Address: "00:00:00:00:00:00",
        },
      ])
      .onConflictDoNothing();

    // 37. Change Password Log
    console.log("Seeding Change Password Log...");
    await db
      .insert(TBL_CHANGE_PASSWORD_LOG)
      .values([
        {
          login_id: sriUserId,
          User_Name: "Sri",
          Old_Password: "N/A",
          New_Password: "ana",
          Reason: "Initial user creation",
          status_entry: "ACTIVE",
          Created_by: "SYSTEM",
          Created_Date: new Date(),
          Created_Mac_Address: "00:00:00:00:00:00",
        },
      ])
      .onConflictDoNothing();

    // 38. Customer Master Files Upload (Stub)
    console.log("Seeding Customer Master Files...");
    await db
      .insert(TBL_CUSTOMER_MASTER_FILES_UPLOAD)
      .values([
        {
          Customer_Id: arushaCustomerId,
          DOCUMENT_TYPE: "TIN Certificate",
          DESCRIPTIONS: "Standard TIN doc",
          FILE_NAME: "tin_cert.pdf",
          CONTENT_TYPE: "application/pdf",
          STATUS_MASTER: "Active",
          CREATED_BY: "SYSTEM",
          CREATED_DATE: new Date(),
          CREATED_MAC_ADDRESS: "00:00:00:00:00:00",
        },
      ])
      .onConflictDoNothing();

    // 39. Customer Company Wise Billing Location Mapping
    console.log("Seeding Customer Billing Mapping...");
    await db
      .insert(TBL_CUSTOMER_COMPANY_WISE_BILLING_LOCATION_MAPPING)
      .values([
        {
          Customer_Id: arushaCustomerId,
          Company_id: compId,
          Billing_Location_Id: arushaBillingId,
          EFFECTIVE_FROM: new Date("2024-01-01"),
          EFFECTIVE_TO: new Date("2025-12-31"),
          REMARKS: "Direct billing mapping",
          STATUS_MASTER: "Active",
          CREATED_BY: "SYSTEM",
          CREATED_DATE: new Date(),
          CREATED_MAC_ADDRESS: "00:00:00:00:00:00",
        },
      ])
      .onConflictDoNothing();

    // 40. Customer Product VAT Percentage Settings
    console.log("Seeding Customer VAT Overrides...");
    await db
      .insert(TBL_CUSTOMER_PRODUCT_VAT_PERCENTAGE_SETTINGS)
      .values([
        {
          Company_id: compId,
          Customer_Id: arushaCustomerId,
          Main_Category_Id: fertMainId,
          VAT_PERCENTAGE: "18",
          EFFECTIVE_FROM: new Date("2024-01-01"),
          EFFECTIVE_TO: new Date("2025-12-31"),
          REQUEST_STATUS: "Approved",
          REMARKS: "Standard category VAT",
          CREATED_BY: "SYSTEM",
          CREATED_DATE: new Date(),
          CREATED_MAC_ADDRESS: "00:00:00:00:00:00",
        },
      ])
      .onConflictDoNothing();

    // 41. Customer Credit Limit File Upload
    console.log("Seeding Credit Limit Files...");
    await db
      .insert(CUSTOMER_CREDIT_LIMIT_FILE_UPLOAD)
      .values([
        {
          CREDIT_LIMIT_ID: creditLimitId,
          DESCRIPTION_DETAILS: "Credit Score Analysis",
          FILE_NAME: "credit_report.pdf",
          CONTENT_TYPE: "application/pdf",
          STATUS_MASTER: "Active",
          CREATED_BY: "SYSTEM",
          CREATED_DATE: new Date(),
          CREATED_MAC_ADDRESS: "00:00:00:00:00:00",
          DOCUMENT_TYPE: "Credit Report",
        },
      ])
      .onConflictDoNothing();

    console.log("✅ Tanzania Seeding Completed Successfully!");
  } catch (error) {
    console.error("❌ Seeding failed:", error);
  } finally {
    process.exit(0);
  }
}

main();