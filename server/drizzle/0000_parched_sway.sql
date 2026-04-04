CREATE SCHEMA "stomaster";
--> statement-breakpoint
CREATE SCHEMA "stoentries";
--> statement-breakpoint
CREATE TABLE "stomaster"."CUSTOMER_CREDIT_LIMIT_FILE_UPLOAD" (
	"SNO" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "stomaster"."CUSTOMER_CREDIT_LIMIT_FILE_UPLOAD_SNO_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"CREDIT_LIMIT_ID" integer,
	"DESCRIPTION_DETAILS" varchar(100),
	"FILE_NAME" varchar(150),
	"CONTENT_TYPE" varchar(50),
	"CONTENT_DATA" "bytea",
	"STATUS_MASTER" varchar(20),
	"CREATED_BY" varchar(50),
	"CREATED_DATE" timestamp,
	"CREATED_MAC_ADDRESS" varchar(50),
	"MODIFIED_BY" varchar(50),
	"MODIFIED_DATE" timestamp,
	"MODIFIED_MAC_ADDRESS" varchar(50),
	"DOCUMENT_TYPE" varchar(60)
);
--> statement-breakpoint
CREATE TABLE "stomaster"."TBL_ACCOUNTS_HEAD_MASTER" (
	"ACCOUNT_HEAD_ID" serial PRIMARY KEY NOT NULL,
	"ACCOUNT_HEAD_NAME" varchar(50),
	"REMARKS" varchar(1000),
	"STATUS_ENTRY" varchar(50),
	"CREATED_BY" varchar(50),
	"CREATED_DATE" timestamp,
	"CREATED_MAC_ADDRESS" varchar(50),
	"MODIFIED_BY" varchar(50),
	"MODIFIED_DATE" timestamp,
	"MODIFIED_MAC_ADDRESS" varchar(50),
	CONSTRAINT "TBL_ACCOUNTS_HEAD_MASTER_ACCOUNT_HEAD_NAME_unique" UNIQUE("ACCOUNT_HEAD_NAME")
);
--> statement-breakpoint
CREATE TABLE "stomaster"."TBL_ACCOUNTS_LEDGER_GROUP_MASTER" (
	"LEDGER_GROUP_ID" serial PRIMARY KEY NOT NULL,
	"LEDGER_GROUP_NAME" varchar(50),
	"REMARKS" varchar(1000),
	"STATUS_ENTRY" varchar(50),
	"CREATED_BY" varchar(50),
	"CREATED_DATE" timestamp,
	"CREATED_MAC_ADDRESS" varchar(50),
	"MODIFIED_BY" varchar(50),
	"MODIFIED_DATE" timestamp,
	"MODIFIED_MAC_ADDRESS" varchar(50),
	CONSTRAINT "TBL_ACCOUNTS_LEDGER_GROUP_MASTER_LEDGER_GROUP_NAME_unique" UNIQUE("LEDGER_GROUP_NAME")
);
--> statement-breakpoint
CREATE TABLE "stomaster"."TBL_ACCOUNTS_LEDGER_MASTER" (
	"LEDGER_ID" serial PRIMARY KEY NOT NULL,
	"Company_id" integer,
	"LEDGER_TYPE" varchar(50),
	"LEDGER_GROUP_ID" integer,
	"LEDGER_NAME" varchar(100),
	"LEDGER_DESC" varchar(100),
	"REMARKS" varchar(100),
	"STATUS_MASTER" varchar(20),
	"CREATED_BY" varchar(50),
	"CREATED_DATE" timestamp,
	"CREATED_MAC_ADDRESS" varchar(50),
	"MODIFIED_BY" varchar(50),
	"MODIFIED_DATE" timestamp,
	"MODIFIED_MAC_ADDRESS" varchar(50)
);
--> statement-breakpoint
CREATE TABLE "stomaster"."TBL_ADDITIONAL_COST_TYPE_MASTER" (
	"ADDITIONAL_COST_TYPE_ID" serial PRIMARY KEY NOT NULL,
	"ADDITIONAL_COST_TYPE_NAME" varchar(50),
	"REMARKS" varchar(1000),
	"STATUS_ENTRY" varchar(50),
	"CREATED_BY" varchar(50),
	"CREATED_DATE" timestamp,
	"CREATED_MAC_ADDRESS" varchar(50),
	"MODIFIED_BY" varchar(50),
	"MODIFIED_DATE" timestamp,
	"MODIFIED_MAC_ADDRESS" varchar(50),
	CONSTRAINT "TBL_ADDITIONAL_COST_TYPE_MASTER_ADDITIONAL_COST_TYPE_NAME_unique" UNIQUE("ADDITIONAL_COST_TYPE_NAME")
);
--> statement-breakpoint
CREATE TABLE "stomaster"."TBL_BANK_MASTER" (
	"BANK_ID" serial PRIMARY KEY NOT NULL,
	"BANK_NAME" varchar(50),
	"ADDRESS" varchar(50),
	"REMARKS" varchar(1000),
	"STATUS_MASTER" varchar(20),
	"CREATED_BY" varchar(50),
	"CREATED_DATE" timestamp,
	"CREATED_MAC_ADDRESS" varchar(50),
	"MODIFIED_BY" varchar(50),
	"MODIFIED_DATE" timestamp,
	"MODIFIED_MAC_ADDRESS" varchar(50),
	CONSTRAINT "TBL_BANK_MASTER_BANK_NAME_unique" UNIQUE("BANK_NAME")
);
--> statement-breakpoint
CREATE TABLE "stomaster"."tbl_Billing_Location_Master" (
	"Billing_Location_Id" serial PRIMARY KEY NOT NULL,
	"Billing_Location_Name" varchar(100),
	"Billing_Location_Description" varchar(100),
	"Remarks" varchar(2000),
	"Status_Master" varchar(20),
	"Created_By" varchar(50),
	"Created_Date" timestamp,
	"Created_Mac_Address" varchar(50),
	"Modified_By" varchar(50),
	"Modified_Date" timestamp,
	"Modified_Mac_Address" varchar(50),
	CONSTRAINT "tbl_Billing_Location_Master_Billing_Location_Name_unique" UNIQUE("Billing_Location_Name")
);
--> statement-breakpoint
CREATE TABLE "stomaster"."tbl_Change_Password_Log" (
	"Sno" serial PRIMARY KEY NOT NULL,
	"login_id" integer,
	"User_Name" varchar(50),
	"Old_Password" varchar(50),
	"New_Password" varchar(50),
	"Reason" varchar(1000),
	"status_entry" varchar(50),
	"Created_by" varchar(50),
	"Created_Date" timestamp,
	"Created_Mac_Address" varchar(50),
	"Modified_by" varchar(50),
	"Modified_Date" timestamp,
	"Modified_Mac_Address" varchar(50)
);
--> statement-breakpoint
CREATE TABLE "stomaster"."tbl_Company_Bank_Account_Master" (
	"Account_Id" serial PRIMARY KEY NOT NULL,
	"Company_id" integer,
	"Bank_Id" integer,
	"Account_Name" varchar(100),
	"Account_Number" varchar(100),
	"Swift_Code" varchar(50),
	"Branch_Address" varchar(200),
	"Bank_Branch_Name" varchar(50),
	"Currency_Id" integer,
	"Remarks" varchar(2000),
	"Status_Master" varchar(20),
	"Created_By" varchar(50),
	"Created_Date" timestamp,
	"Created_Mac_Address" varchar(50),
	"Modified_By" varchar(50),
	"Modified_Date" timestamp,
	"Modified_Mac_Address" varchar(50),
	CONSTRAINT "tbl_Company_Bank_Account_Master_Account_Name_unique" UNIQUE("Account_Name"),
	CONSTRAINT "tbl_Company_Bank_Account_Master_Account_Number_unique" UNIQUE("Account_Number")
);
--> statement-breakpoint
CREATE TABLE "stomaster"."tbl_Company_Master" (
	"Company_Id" serial PRIMARY KEY NOT NULL,
	"Company_Name" varchar(100),
	"TIN_Number" varchar(50),
	"Address" varchar(2000),
	"Contact_Person" varchar(50),
	"Contact_Number" varchar(50),
	"Email" varchar(50),
	"Short_Code" varchar(4),
	"Finance_Start_Month" varchar(50),
	"Finance_End_Month" varchar(50),
	"Year_Code" varchar(50),
	"Company_Full_Name" varchar(150),
	"Currency_ID" integer,
	"TimeZone" varchar(50),
	"No_Of_User" integer,
	"WebSite" varchar(50),
	"Comp_Big_Logo" "bytea",
	"Comp_Small_Logo" "bytea",
	"Comp_Letter_Head" "bytea",
	"Comp_Stamp_LOGO" "bytea",
	"Remarks" varchar(2000),
	"Status_Master" varchar(20),
	"Created_By" varchar(50),
	"Created_Date" timestamp,
	"Created_Mac_Address" varchar(50),
	"Modified_By" varchar(50),
	"Modified_Date" timestamp,
	"Modified_Mac_Address" varchar(50),
	CONSTRAINT "tbl_Company_Master_Company_Name_unique" UNIQUE("Company_Name"),
	CONSTRAINT "tbl_Company_Master_TIN_Number_unique" UNIQUE("TIN_Number")
);
--> statement-breakpoint
CREATE TABLE "stomaster"."tbl_country_master" (
	"Country_Id" serial PRIMARY KEY NOT NULL,
	"Country_Name" varchar(100),
	"nicename" varchar(80),
	"iso3" varchar(50),
	"numcode" integer,
	"phonecode" integer,
	"Batch_No" varchar(2),
	"Remarks" varchar(1000),
	"Status_Master" varchar(50),
	"Created_User" varchar(50),
	"Created_Date" timestamp,
	"Created_Mac_Address" varchar(50),
	"Modified_User" varchar(50),
	"Modified_Date" timestamp,
	"Modified_Mac_Address" varchar(50),
	CONSTRAINT "tbl_country_master_Country_Name_unique" UNIQUE("Country_Name")
);
--> statement-breakpoint
CREATE TABLE "stomaster"."TBL_CURRENCY_MASTER" (
	"CURRENCY_ID" serial PRIMARY KEY NOT NULL,
	"CURRENCY_NAME" varchar(50),
	"ADDRESS" varchar(50),
	"Exchange_Rate" numeric(15, 5),
	"REMARKS" varchar(1000),
	"STATUS_MASTER" varchar(20),
	"CREATED_BY" varchar(50),
	"CREATED_DATE" timestamp,
	"CREATED_MAC_ADDRESS" varchar(50),
	"MODIFIED_BY" varchar(50),
	"MODIFIED_DATE" timestamp,
	"MODIFIED_MAC_ADDRESS" varchar(50),
	CONSTRAINT "TBL_CURRENCY_MASTER_CURRENCY_NAME_unique" UNIQUE("CURRENCY_NAME")
);
--> statement-breakpoint
CREATE TABLE "stomaster"."tbl_Customer_Address_Details" (
	"Sno" serial PRIMARY KEY NOT NULL,
	"Customer_Id" integer,
	"ADDRESS_TYPE" varchar(50),
	"Address" varchar(5000),
	"LOCATION_AREA" varchar(200),
	"Remarks" varchar(2000),
	"Status_Master" varchar(20),
	"Created_By" varchar(50),
	"Created_Date" timestamp,
	"Created_Mac_Address" varchar(50),
	"Modified_By" varchar(50),
	"Modified_Date" timestamp,
	"Modified_Mac_Address" varchar(50)
);
--> statement-breakpoint
CREATE TABLE "stomaster"."TBL_CUSTOMER_COMPANY_WISE_BILLING_LOCATION_MAPPING" (
	"SNO" serial PRIMARY KEY NOT NULL,
	"Customer_Id" integer,
	"Company_id" integer,
	"Billing_Location_Id" integer,
	"EFFECTIVE_FROM" timestamp,
	"EFFECTIVE_TO" timestamp,
	"REMARKS" varchar(500),
	"STATUS_MASTER" varchar(50),
	"CREATED_BY" varchar(50),
	"CREATED_DATE" timestamp,
	"CREATED_MAC_ADDRESS" varchar(50),
	"MODIFIED_BY" varchar(50),
	"MODIFIED_DATE" timestamp,
	"MODIFIED_MAC_ADDRESS" varchar(50)
);
--> statement-breakpoint
CREATE TABLE "stomaster"."tbl_Customer_Credit_Limit_Details" (
	"Sno" serial PRIMARY KEY NOT NULL,
	"Company_id" integer,
	"Customer_Id" integer,
	"Currency_id" integer,
	"Valid_Type" varchar(50),
	"Requested_Credit_Limit_Days" integer,
	"Requested_Credit_Limit_Amount" numeric(15, 2),
	"Requested_Payment_Mode_Id" integer,
	"Requested_By" varchar(50),
	"Requested_Date" timestamp,
	"Total_Outstanding_Amount" numeric(15, 2),
	"Over_Due_Outstanding_Amount" numeric(15, 2),
	"Approved_Credit_Limit_Days" integer,
	"Approved_Credit_Limit_Amount" numeric(15, 2),
	"Approved_PAYMENT_MODE_ID" integer,
	"Effective_From" timestamp,
	"Effective_To" timestamp,
	"Finance_Head_1_Response_By" varchar(50),
	"Finance_Head_1_Response_Date" timestamp,
	"Finance_Head_1_Response_Status" varchar(50),
	"Finance_Head_1_Response_IP_Address" varchar(50),
	"Finance_Head_1_Response_Remarks" varchar(500),
	"Respond_by" varchar(50),
	"Respond_Status" varchar(50),
	"Respond_Date" timestamp,
	"Respond_Mac_address" varchar(50),
	"Response_Remarks" varchar(1000),
	"Remarks" varchar(2000),
	"Status_Master" varchar(20),
	"Created_By" varchar(50),
	"Created_Date" timestamp,
	"Created_Mac_Address" varchar(50),
	"Modified_By" varchar(50),
	"Modified_Date" timestamp,
	"Modified_Mac_Address" varchar(50)
);
--> statement-breakpoint
CREATE TABLE "stomaster"."tbl_Customer_Master" (
	"Customer_Id" serial PRIMARY KEY NOT NULL,
	"Customer_Name" varchar(250),
	"TIN_Number" varchar(100),
	"VAT_Number" varchar(50),
	"Contact_Person" varchar(50),
	"Contact_Number" varchar(50),
	"Location" varchar(100),
	"Nature_Of_Business" varchar(50),
	"Billing_Location_Id" integer,
	"Country_Id" integer,
	"Region_Id" integer,
	"District_Id" integer,
	"currency_id" integer,
	"CREDIT_ALLOWED" varchar(50),
	"Address" varchar(1500),
	"Email_Address" varchar(100),
	"PHONE_NUMBER_2" varchar(50),
	"LAT" numeric(15, 9),
	"LNG" numeric(15, 9),
	"TIER" varchar(50),
	"Company_Head_Contact_Person" varchar(250),
	"Company_Head_Phone_No" varchar(250),
	"Company_Head_Email" varchar(250),
	"Accounts_Contact_Person" varchar(250),
	"Accounts_Phone_No" varchar(250),
	"Accounts_Email" varchar(250),
	"Remarks" varchar(2000),
	"Status_Master" varchar(20),
	"Created_By" varchar(50),
	"Created_Date" timestamp,
	"Created_Mac_Address" varchar(50),
	"Modified_By" varchar(50),
	"Modified_Date" timestamp,
	"Modified_Mac_Address" varchar(50),
	CONSTRAINT "tbl_Customer_Master_Customer_Name_unique" UNIQUE("Customer_Name")
);
--> statement-breakpoint
CREATE TABLE "stomaster"."TBL_CUSTOMER_MASTER_FILES_UPLOAD" (
	"SNO" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "stomaster"."TBL_CUSTOMER_MASTER_FILES_UPLOAD_SNO_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"Customer_Id" integer,
	"DOCUMENT_TYPE" varchar(50),
	"DESCRIPTIONS" varchar(100),
	"FILE_NAME" varchar(150),
	"CONTENT_TYPE" varchar(50),
	"CONTENT_DATA" "bytea",
	"STATUS_MASTER" varchar(20),
	"CREATED_BY" varchar(50),
	"CREATED_DATE" timestamp,
	"CREATED_MAC_ADDRESS" varchar(50),
	"MODIFIED_BY" varchar(50),
	"MODIFIED_DATE" timestamp,
	"MODIFIED_MAC_ADDRESS" varchar(50)
);
--> statement-breakpoint
CREATE TABLE "stomaster"."TBL_CUSTOMER_PAYMENT_MODE_MASTER" (
	"PAYMENT_MODE_ID" serial PRIMARY KEY NOT NULL,
	"PAYMENT_MODE_NAME" varchar(50),
	"SHORT_CODE" varchar(20),
	"REMARKS" varchar(1000),
	"STATUS_MASTER" varchar(20),
	"CREATED_BY" varchar(50),
	"CREATED_DATE" timestamp,
	"CREATED_MAC_ADDRESS" varchar(50),
	"MODIFIED_BY" varchar(50),
	"MODIFIED_DATE" timestamp,
	"MODIFIED_MAC_ADDRESS" varchar(50)
);
--> statement-breakpoint
CREATE TABLE "stomaster"."TBL_CUSTOMER_PRODUCT_VAT_PERCENTAGE_SETTINGS" (
	"SNO" serial PRIMARY KEY NOT NULL,
	"Company_id" integer,
	"Customer_Id" integer,
	"Main_Category_Id" integer,
	"Sub_Category_Id" integer,
	"Product_Id" integer,
	"VAT_PERCENTAGE" numeric(10, 2),
	"EFFECTIVE_FROM" timestamp,
	"EFFECTIVE_TO" timestamp,
	"REQUEST_STATUS" varchar(50),
	"REMARKS" varchar(100),
	"CREATED_BY" varchar(50),
	"CREATED_DATE" timestamp,
	"CREATED_MAC_ADDRESS" varchar(50),
	"MODIFIED_BY" varchar(50),
	"MODIFIED_DATE" timestamp,
	"MODIFIED_MAC_ADDRESS" varchar(50)
);
--> statement-breakpoint
CREATE TABLE "stomaster"."tbl_Customer_Wise_Product_Price_Settings" (
	"Sno" serial PRIMARY KEY NOT NULL,
	"Company_id" integer,
	"Customer_Id" integer,
	"Main_Category_Id" integer,
	"Sub_Category_Id" integer,
	"Product_Id" integer,
	"UNIT_PRICE" numeric(15, 2),
	"VAT_Percentage" numeric(15, 2),
	"Valid_Type" varchar(50),
	"currency_id" integer,
	"Effective_From" timestamp,
	"Effective_To" timestamp,
	"Requested_By" varchar(50),
	"Requested_Date" timestamp,
	"Requested_Product_Amount" numeric(15, 4),
	"Approved_Product_Amount" numeric(15, 4),
	"Respond_By" varchar(50),
	"Response_Status" varchar(50),
	"REspond_Date" timestamp,
	"Respond_Mac_Address" varchar(50),
	"Response_Remarks" varchar(1000),
	"Accounts_Response_Person" varchar(50),
	"Accounts_Response_Date" timestamp,
	"Accounts_Response_Status" varchar(50),
	"Accounts_Response_Remarks" varchar(500),
	"Remarks" varchar(2000),
	"Status_Master" varchar(20),
	"Created_By" varchar(50),
	"Created_Date" timestamp,
	"Created_Mac_Address" varchar(50),
	"Modified_By" varchar(50),
	"Modified_Date" timestamp,
	"Modified_Mac_Address" varchar(50)
);
--> statement-breakpoint
CREATE TABLE "stomaster"."tbl_District_Master" (
	"District_id" serial PRIMARY KEY NOT NULL,
	"Country_Id" integer,
	"Region_Id" integer,
	"District_Name" varchar(50),
	"Total_Population" numeric(18, 2),
	"Zone_Name" varchar(50),
	"Distance_From_Arusha" numeric(18, 2),
	"Status_Master" varchar(20),
	"Created_By" varchar(50),
	"Created_Date" timestamp,
	"Created_Mac_Address" varchar(50),
	"Modified_By" varchar(50),
	"Modified_Date" timestamp,
	"Modified_Mac_Address" varchar(50)
);
--> statement-breakpoint
CREATE TABLE "stomaster"."TBL_EXCHANGE_RATE_MASTER" (
	"SNO" serial PRIMARY KEY NOT NULL,
	"Company_ID" integer,
	"CURRENCY_ID" integer,
	"Exchange_Rate" numeric(15, 5),
	"REMARKS" varchar(1000),
	"STATUS_MASTER" varchar(20),
	"CREATED_BY" varchar(50),
	"CREATED_DATE" timestamp,
	"CREATED_MAC_ADDRESS" varchar(50),
	"MODIFIED_BY" varchar(50),
	"MODIFIED_DATE" timestamp,
	"MODIFIED_MAC_ADDRESS" varchar(50)
);
--> statement-breakpoint
CREATE TABLE "stomaster"."tbl_field_dtl" (
	"activity_id_fld_dtl" bigserial PRIMARY KEY NOT NULL,
	"field_id_fld_dtl" bigint,
	"activity_name_fld_dtl" text,
	"activity_desc_fld_dtl" text,
	"status_fld_dtl" varchar(10),
	"remarks_fld_dtl" varchar(1000),
	"created_user_fld_dtl" varchar(50),
	"created_date_fld_dtl" timestamp,
	"created_mac_addr_fld_dtl" varchar(50),
	"modified_user_fld_dtl" varchar(50),
	"modified_date_fld_dtl" timestamp,
	"modified_mac_addr_fld_dtl" varchar(50)
);
--> statement-breakpoint
CREATE TABLE "stomaster"."tbl_field_hdr" (
	"field_id_fld_hdr" bigserial PRIMARY KEY NOT NULL,
	"project_name_fld_hdr" varchar(50),
	"field_category_fld_hdr" varchar(50),
	"field_desc_fld_hdr" varchar(150),
	"status_fld_hdr" varchar(20),
	"remarks_fld_hdr" varchar(1000),
	"created_user_fld_hdr" varchar(50),
	"created_date_fld_hdr" timestamp,
	"created_mac_addr_fld_hdr" varchar(50),
	"modified_user_fld_hdr" varchar(50),
	"modified_date_fld_hdr" timestamp,
	"modified_mac_addr_fld_hdr" varchar(50),
	CONSTRAINT "tbl_field_hdr_field_category_fld_hdr_unique" UNIQUE("field_category_fld_hdr")
);
--> statement-breakpoint
CREATE TABLE "stomaster"."tbl_Location_Master" (
	"Location_Id" serial PRIMARY KEY NOT NULL,
	"Location_Name" varchar(100),
	"Location_Description" varchar(100),
	"Remarks" varchar(2000),
	"Status_Master" varchar(20),
	"Created_By" varchar(50),
	"Created_Date" timestamp,
	"Created_Mac_Address" varchar(50),
	"Modified_By" varchar(50),
	"Modified_Date" timestamp,
	"Modified_Mac_Address" varchar(50),
	CONSTRAINT "tbl_Location_Master_Location_Name_unique" UNIQUE("Location_Name")
);
--> statement-breakpoint
CREATE TABLE "stomaster"."TBL_PAYMENT_MODE_MASTER" (
	"PAYMENT_MODE_ID" serial PRIMARY KEY NOT NULL,
	"PAYMENT_MODE_NAME" varchar(50),
	"PAYMENT_MODE_PERCENTAGE" numeric(15, 2),
	"REMARKS" varchar(1000),
	"STATUS_ENTRY" varchar(50),
	"CREATED_BY" varchar(50),
	"CREATED_DATE" timestamp,
	"CREATED_MAC_ADDRESS" varchar(50),
	"MODIFIED_BY" varchar(50),
	"MODIFIED_DATE" timestamp,
	"MODIFIED_MAC_ADDRESS" varchar(50),
	CONSTRAINT "TBL_PAYMENT_MODE_MASTER_PAYMENT_MODE_NAME_unique" UNIQUE("PAYMENT_MODE_NAME")
);
--> statement-breakpoint
CREATE TABLE "stomaster"."TBL_PAYMENT_TERM_MASTER" (
	"PAYMENT_TERM_ID" serial PRIMARY KEY NOT NULL,
	"PAYMENT_TERM_NAME" varchar(50),
	"REMARKS" varchar(1000),
	"STATUS_ENTRY" varchar(50),
	"CREATED_BY" varchar(50),
	"CREATED_DATE" timestamp,
	"CREATED_MAC_ADDRESS" varchar(50),
	"MODIFIED_BY" varchar(50),
	"MODIFIED_DATE" timestamp,
	"MODIFIED_MAC_ADDRESS" varchar(50),
	CONSTRAINT "TBL_PAYMENT_TERM_MASTER_PAYMENT_TERM_NAME_unique" UNIQUE("PAYMENT_TERM_NAME")
);
--> statement-breakpoint
CREATE TABLE "stomaster"."tbl_Product_Company_Main_Category_Mapping" (
	"Sno" serial PRIMARY KEY NOT NULL,
	"Company_Id" integer,
	"Main_Category_Id" integer,
	"Remarks" varchar(2000),
	"Status_Master" varchar(20),
	"Created_By" varchar(50),
	"Created_Date" timestamp,
	"Created_Mac_Address" varchar(50),
	"Modified_By" varchar(50),
	"Modified_Date" timestamp,
	"Modified_Mac_Address" varchar(50)
);
--> statement-breakpoint
CREATE TABLE "stomaster"."TBL_PRODUCT_MAIN_CATEGORY_MASTER" (
	"MAIN_CATEGORY_ID" serial PRIMARY KEY NOT NULL,
	"MAIN_CATEGORY_NAME" varchar(100),
	"REMARKS" varchar(2000),
	"STATUS_MASTER" varchar(20),
	"CREATED_BY" varchar(50),
	"CREATED_DATE" timestamp,
	"CREATED_MAC_ADDRESS" varchar(50),
	"MODIFIED_BY" varchar(50),
	"MODIFIED_DATE" timestamp,
	"MODIFIED_MAC_ADDRESS" varchar(50),
	CONSTRAINT "TBL_PRODUCT_MAIN_CATEGORY_MASTER_MAIN_CATEGORY_NAME_unique" UNIQUE("MAIN_CATEGORY_NAME")
);
--> statement-breakpoint
CREATE TABLE "stomaster"."TBL_PRODUCT_MASTER" (
	"PRODUCT_ID" serial PRIMARY KEY NOT NULL,
	"PRODUCT_NAME" varchar(150),
	"MAIN_CATEGORY_ID" integer,
	"SUB_CATEGORY_ID" integer,
	"UOM" varchar(50),
	"QTY_PER_PACKING" numeric(15, 2),
	"ALTERNATE_UOM" varchar(50),
	"FILE_NAME" varchar(150),
	"CONTENT_TYPE" varchar(50),
	"CONTENT_DATA" "bytea",
	"REMARKS" varchar(2000),
	"STATUS_MASTER" varchar(20),
	"CREATED_BY" varchar(50),
	"CREATED_DATE" timestamp,
	"CREATED_MAC_ADDRESS" varchar(50),
	"MODIFIED_BY" varchar(50),
	"MODIFIED_DATE" timestamp,
	"MODIFIED_MAC_ADDRESS" varchar(50),
	CONSTRAINT "TBL_PRODUCT_MASTER_PRODUCT_NAME_unique" UNIQUE("PRODUCT_NAME")
);
--> statement-breakpoint
CREATE TABLE "stomaster"."TBL_PRODUCT_OPENING_STOCK" (
	"SNO" serial PRIMARY KEY NOT NULL,
	"OPENING_STOCK_DATE" timestamp,
	"COMPANY_ID" integer,
	"STORE_ID" integer,
	"MAIN_CATEGORY_ID" integer,
	"SUB_CATEGORY_ID" integer,
	"PRODUCT_ID" integer,
	"TOTAL_QTY" numeric(15, 2),
	"REMARKS" varchar(2000),
	"STATUS_MASTER" varchar(20),
	"CREATED_BY" varchar(50),
	"CREATED_DATE" timestamp,
	"CREATED_MAC_ADDRESS" varchar(50),
	"MODIFIED_BY" varchar(50),
	"MODIFIED_DATE" timestamp,
	"MODIFIED_MAC_ADDRESS" varchar(50)
);
--> statement-breakpoint
CREATE TABLE "stomaster"."TBL_PRODUCT_SUB_CATEGORY_MASTER" (
	"SUB_CATEGORY_ID" serial PRIMARY KEY NOT NULL,
	"SUB_CATEGORY_NAME" varchar(50),
	"MAIN_CATEGORY_ID" integer,
	"REMARKS" varchar(2000),
	"STATUS_MASTER" varchar(20),
	"CREATED_BY" varchar(50),
	"CREATED_DATE" timestamp,
	"CREATED_MAC_ADDRESS" varchar(50),
	"MODIFIED_BY" varchar(50),
	"MODIFIED_DATE" timestamp,
	"MODIFIED_MAC_ADDRESS" varchar(50),
	CONSTRAINT "TBL_PRODUCT_SUB_CATEGORY_MASTER_SUB_CATEGORY_NAME_unique" UNIQUE("SUB_CATEGORY_NAME")
);
--> statement-breakpoint
CREATE TABLE "stomaster"."TBL_REGION_MASTER" (
	"REGION_ID" serial PRIMARY KEY NOT NULL,
	"REGION_NAME" varchar(50),
	"COUNTRY_ID" integer,
	"CAPITAL" varchar(50),
	"NO_OF_DISTRICTS" integer,
	"TOTAL_POPULATION" numeric(18, 2),
	"ZONE_NAME" varchar(50),
	"DISTANCE_FROM_ARUSHA" numeric(18, 2),
	"STATUS_MASTER" varchar(20),
	"CREATED_BY" varchar(50),
	"CREATED_DATE" timestamp,
	"CREATED_MAC_ADDRESS" varchar(50),
	"MODIFIED_BY" varchar(50),
	"MODIFIED_DATE" timestamp,
	"MODIFIED_MAC_ADDRESS" varchar(50),
	CONSTRAINT "TBL_REGION_MASTER_REGION_NAME_unique" UNIQUE("REGION_NAME")
);
--> statement-breakpoint
CREATE TABLE "stomaster"."TBL_ROLE_MASTER" (
	"ROLE_ID" serial PRIMARY KEY NOT NULL,
	"ROLE_NAME" varchar(50),
	"ROLE_DESCRIPTION" varchar(50),
	"REMARKS" varchar(1000),
	"STATUS_MASTER" varchar(20),
	"CREATED_BY" varchar(50),
	"CREATED_DATE" timestamp,
	"CREATED_MAC_ADDRESS" varchar(50),
	"MODIFIED_BY" varchar(50),
	"MODIFIED_DATE" timestamp,
	"MODIFIED_MAC_ADDRESS" varchar(50),
	CONSTRAINT "TBL_ROLE_MASTER_ROLE_NAME_unique" UNIQUE("ROLE_NAME")
);
--> statement-breakpoint
CREATE TABLE "stomaster"."TBL_SALES_PERSON_MASTER" (
	"Sales_Person_ID" serial PRIMARY KEY NOT NULL,
	"Emp_Id" integer,
	"PERSON_NAME" varchar(50),
	"Designation_Name" varchar(50),
	"Sales_Contact_Person_Phone" varchar(60),
	"Sales_Person_Email_Addres" varchar(60),
	"Reporting_Manager_Card_No" integer,
	"Reporting_Manager_Name" varchar(100),
	"Reporting_Manager_Email_Address" varchar(100),
	"Sales_Person_Designation" varchar(100),
	"REMARKS" varchar(50),
	"STATUS_MASTER" varchar(50),
	"CREATED_BY" varchar(50),
	"CREATED_DATE" timestamp,
	"CREATED_MAC_ADDRESS" varchar(50),
	"MODIFIED_BY" varchar(50),
	"MODIFIED_DATE" timestamp,
	"MODIFIED_MAC_ADDRESS" varchar(50)
);
--> statement-breakpoint
CREATE TABLE "stomaster"."tbl_Store_Master" (
	"Store_Id" serial PRIMARY KEY NOT NULL,
	"Store_Name" varchar(100),
	"Location_Id" integer,
	"Manager_Name" varchar(50),
	"Store_Short_Code" varchar(5),
	"Store_Short_Name" varchar(100),
	"Email_Address" varchar(1000),
	"CC_Email_Address" text,
	"BCC_Email_Address" varchar(50),
	"Response_Directors_Name" varchar(1000),
	"Remarks" varchar(2000),
	"Status_Master" varchar(20),
	"Created_By" varchar(50),
	"Created_Date" timestamp,
	"Created_Mac_Address" varchar(50),
	"Modified_By" varchar(50),
	"Modified_Date" timestamp,
	"Modified_Mac_Address" varchar(50),
	CONSTRAINT "tbl_Store_Master_Store_Name_unique" UNIQUE("Store_Name")
);
--> statement-breakpoint
CREATE TABLE "stomaster"."tbl_Store_Product_Minimum_Stock" (
	"Sno" serial PRIMARY KEY NOT NULL,
	"Company_id" integer,
	"Store_Id" integer,
	"Main_Category_Id" integer,
	"Sub_Category_Id" integer,
	"Product_Id" integer,
	"Minimum_Stock_Pcs" integer,
	"Purchase_Alert_Qty" numeric(15, 2),
	"Requested_By" varchar(50),
	"Effective_From" timestamp,
	"Effective_To" timestamp,
	"Remarks" varchar(2000),
	"Status_Master" varchar(20),
	"Created_By" varchar(50),
	"Created_Date" timestamp,
	"Created_Mac_Address" varchar(50),
	"Modified_By" varchar(50),
	"Modified_Date" timestamp,
	"Modified_Mac_Address" varchar(50)
);
--> statement-breakpoint
CREATE TABLE "stomaster"."tbl_Supplier_Master" (
	"Supplier_Id" serial PRIMARY KEY NOT NULL,
	"Supplier_Type" varchar(50),
	"Supplier_Name" varchar(250),
	"TIN_Number" varchar(100),
	"Vat_Register_No" varchar(50),
	"SH_Nick_Name" varchar(50),
	"Shipment_Mode" varchar(100),
	"Country_Id" integer,
	"Region_Id" integer,
	"District_Id" integer,
	"Address" varchar(2500),
	"Contact_Person" varchar(50),
	"Phone_number" varchar(50),
	"Mail_Id" varchar(50),
	"Fax" varchar(50),
	"vat_Percentage" numeric(15, 2),
	"Withholding_vat_percentage" numeric(15, 2),
	"Remarks" varchar(150),
	"Status_Master" varchar(20),
	"Created_User" varchar(50),
	"Created_Date" timestamp,
	"Created_Mac_Address" varchar(50),
	"Modified_User" varchar(50),
	"Modified_Date" timestamp,
	"Modified_Mac_Address" varchar(50),
	CONSTRAINT "tbl_Supplier_Master_Supplier_Name_unique" UNIQUE("Supplier_Name")
);
--> statement-breakpoint
CREATE TABLE "stomaster"."TBL_USER_INFO_HDR" (
	"LOGIN_ID_USER_HDR" serial PRIMARY KEY NOT NULL,
	"NEW_CARD_NO_USER_HDR" integer,
	"LOGIN_NAME" varchar(50),
	"PASSWORD_USER_HDR" varchar(100),
	"ROLE_USER_HDR" varchar(100),
	"MOBILE_NO_USER_HDR" varchar(30),
	"MAIL_ID_USER_HDR" varchar(150),
	"STOCK_SHOW_STATUS" varchar(10),
	"OUTSIDE_ACCESS_Y_N" varchar(20),
	"STATUS_USER_HDR" varchar(20),
	"REMARKS_USER_HDR" varchar(1000),
	"CREATED_USER_USER_HDR" varchar(50),
	"CREATED_DATE_USER_HDR" timestamp,
	"CREATED_MAC_ADDR_USER_HDR" varchar(50),
	"MODIFIED_USER_USER_HDR" varchar(50),
	"MODIFIED_DATE_USER_HDR" timestamp,
	"MODIFIED_MAC_ADDR_USER_HDR" varchar(50),
	CONSTRAINT "TBL_USER_INFO_HDR_LOGIN_NAME_unique" UNIQUE("LOGIN_NAME")
);
--> statement-breakpoint
CREATE TABLE "stomaster"."TBL_USER_TO_STORE_MAPPING" (
	"USER_TO_LOCATION_ID_USER_TO_ROLE" serial PRIMARY KEY NOT NULL,
	"USER_ID_USER_TO_ROLE" integer,
	"COMPANY_ID" integer,
	"STORE_ID_USER_TO_ROLE" integer,
	"ROLE_ID_USER_TO_ROLE" integer,
	"STATUS_USER_TO_ROLE" varchar(20),
	"CREATED_USER_USER_TO_ROLE" varchar(50),
	"CREATED_DATE_USER_TO_ROLE" timestamp,
	"CREATED_MAC_ADDR_USER_TO_ROLE" varchar(50),
	"MODIFIED_USER_USER_TO_ROLE" varchar(50),
	"MODIFIED_DATE_USER_TO_ROLE" timestamp,
	"MODIFIED_MAC_ADDR_USER_TO_ROLE" varchar(50)
);
--> statement-breakpoint
CREATE TABLE "stomaster"."TBL_VAT_PERCENTAGE_SETTING" (
	"SNO" serial PRIMARY KEY NOT NULL,
	"COMPANY_ID" integer,
	"VAT_PERCENTAGE" numeric(15, 2),
	"EFFECTIVE_FROM" timestamp,
	"EFFECTIVE_TO" timestamp,
	"REMARKS" varchar(2000),
	"STATUS_MASTER" varchar(20),
	"CREATED_BY" varchar(50),
	"CREATED_DATE" timestamp,
	"CREATED_MAC_ADDRESS" varchar(50),
	"MODIFIED_BY" varchar(50),
	"MODIFIED_DATE" timestamp,
	"MODIFIED_MAC_ADDRESS" varchar(50)
);
--> statement-breakpoint
CREATE TABLE "stoentries"."TBL_CUSTOMER_RECEIPT_FILES_UPLOAD" (
	"SNO" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "stoentries"."TBL_CUSTOMER_RECEIPT_FILES_UPLOAD_SNO_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"RECEIPT_REF_NO" varchar(50),
	"DOCUMENT_TYPE" varchar(50),
	"DESCRIPTION_DETAILS" varchar(100),
	"FILE_NAME" varchar(150),
	"CONTENT_TYPE" varchar(50),
	"CONTENT_DATA" "bytea",
	"REMARKS" varchar(1000),
	"STATUS_MASTER" varchar(20),
	"CREATED_BY" varchar(50),
	"CREATED_DATE" timestamp,
	"CREATED_IP_ADDRESS" varchar(50),
	"MODIFIED_BY" varchar(50),
	"MODIFIED_DATE" timestamp,
	"MODIFIED_IP_ADDRESS" varchar(50)
);
--> statement-breakpoint
CREATE TABLE "stoentries"."TBL_CUSTOMER_RECEIPT_HDR" (
	"SNO" bigserial NOT NULL,
	"RECEIPT_REF_NO" varchar(50) PRIMARY KEY NOT NULL,
	"RECEIPT_DATE" timestamp,
	"PAYMENT_TYPE" varchar(50),
	"COMPANY_ID" integer,
	"CUSTOMER_ID" integer,
	"PAYMENT_MODE_ID" integer,
	"CR_BANK_CASH_ID" integer,
	"CR_ACCOUNT_ID" integer,
	"DR_BANK_CASH_ID" integer,
	"TRANSACTION_REF_NO" varchar(100),
	"TRANSACTION_DATE" timestamp,
	"CURRENCY_ID" integer,
	"RECEIPT_AMOUNT" numeric(15, 2),
	"EXCHANGE_RATE" numeric(15, 2),
	"RECEIPT_AMOUNT_LC" numeric(15, 2),
	"REMARKS" varchar(1000),
	"STATUS_ENTRY" varchar(20),
	"CREATED_BY" varchar(50),
	"CREATED_DATE" timestamp,
	"CREATED_MAC_ADDRESS" varchar(50),
	"MODIFIED_BY" varchar(50),
	"MODIFIED_DATE" timestamp,
	"MODIFIED_MAC_ADDRESS" varchar(50),
	"Submitted_By" varchar(50),
	"Submitted_Date" timestamp,
	"Submitted_IP_Address" varchar(50),
	"Tally_Ref_No" varchar(50),
	"Tally_Sync_Status" varchar(20),
	"Tally_Sync_Date" timestamp,
	"Tally_Sync_Person_Name" varchar(50)
);
--> statement-breakpoint
CREATE TABLE "stoentries"."TBL_CUSTOMER_RECEIPT_INVOICE_DTL" (
	"SNO" bigserial PRIMARY KEY NOT NULL,
	"RECEIPT_REF_NO" varchar(50),
	"TAX_INVOICE_REF_NO" varchar(50),
	"ACTUAL_INVOICE_AMOUNT" numeric(15, 2),
	"ALREADY_PAID_AMOUNT" numeric(15, 2),
	"OUTSTANDING_INVOICE_AMOUNT" numeric(15, 2),
	"RECEIPT_INVOICE_ADJUST_AMOUNT" numeric(15, 2),
	"REMARKS" varchar(1000),
	"STATUS_ENTRY" varchar(20),
	"CREATED_BY" varchar(50),
	"CREATED_DATE" timestamp,
	"CREATED_MAC_ADDRESS" varchar(50),
	"MODIFIED_BY" varchar(50),
	"MODIFIED_DATE" timestamp,
	"MODIFIED_MAC_ADDRESS" varchar(50)
);
--> statement-breakpoint
CREATE TABLE "stoentries"."TBL_DELIVERY_FILES_UPLOAD" (
	"SNO" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "stoentries"."TBL_DELIVERY_FILES_UPLOAD_SNO_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"DELIVERY_NOTE_REF_NO" varchar(50),
	"DOCUMENT_TYPE" varchar(50),
	"DESCRIPTION_DETAILS" varchar(100),
	"FILE_NAME" varchar(150),
	"CONTENT_TYPE" varchar(50),
	"CONTENT_DATA" "bytea",
	"REMARKS" varchar(1000),
	"STATUS_MASTER" varchar(20),
	"CREATED_BY" varchar(50),
	"CREATED_DATE" timestamp,
	"CREATED_IP_ADDRESS" varchar(50),
	"MODIFIED_BY" varchar(50),
	"MODIFIED_DATE" timestamp,
	"MODIFIED_IP_ADDRESS" varchar(50)
);
--> statement-breakpoint
CREATE TABLE "stoentries"."TBL_DELIVERY_NOTE_DTL" (
	"SNO" serial PRIMARY KEY NOT NULL,
	"DELIVERY_NOTE_REF_NO" varchar(50),
	"SALES_ORDER_DTL_SNO" integer,
	"PO_DTL_SNO" integer,
	"PO_REF_NO" varchar(50),
	"MAIN_CATEGORY_ID" integer,
	"SUB_CATEGORY_ID" integer,
	"PRODUCT_ID" integer,
	"SALES_RATE_PER_QTY" numeric(15, 6),
	"QTY_PER_PACKING" numeric(15, 2),
	"REQUEST_QTY" numeric(15, 4),
	"DELIVERY_QTY" numeric(15, 4),
	"UOM" varchar(50),
	"TOTAL_PACKING" numeric(15, 4),
	"ALTERNATE_UOM" varchar(500),
	"TOTAL_PRODUCT_AMOUNT" numeric(15, 4),
	"VAT_PERCENTAGE" numeric(15, 2),
	"VAT_AMOUNT" numeric(15, 4),
	"FINAL_SALES_AMOUNT" numeric(15, 4),
	"TOTAL_PRODUCT_AMOUNT_LC" numeric(15, 4),
	"FINAL_SALES_AMOUNT_LC" numeric(15, 4),
	"STORE_STOCK_PCS" numeric(15, 2),
	"REMARKS" varchar(2000),
	"STATUS_ENTRY" varchar(20),
	"CREATED_BY" varchar(50),
	"CREATED_DATE" timestamp,
	"CREATED_MAC_ADDRESS" varchar(50),
	"MODIFIED_BY" varchar(50),
	"MODIFIED_DATE" timestamp,
	"MODIFIED_MAC_ADDRESS" varchar(50)
);
--> statement-breakpoint
CREATE TABLE "stoentries"."TBL_DELIVERY_NOTE_HDR" (
	"SNO" serial NOT NULL,
	"DELIVERY_NOTE_REF_NO" varchar(50) PRIMARY KEY NOT NULL,
	"DELIVERY_DATE" timestamp,
	"COMPANY_ID" integer,
	"FROM_STORE_ID" integer,
	"DELIVERY_SOURCE_TYPE" varchar(50),
	"DELIVERY_SOURCE_REF_NO" varchar(50),
	"TO_STORE_ID" integer,
	"CUSTOMER_ID" integer,
	"TRUCK_NO" varchar(50),
	"TRAILER_NO" varchar(50),
	"DRIVER_NAME" varchar(50),
	"DRIVER_CONTACT_NUMBER" varchar(50),
	"SEAL_NO" varchar(50),
	"CURRENCY_ID" integer,
	"EXCHANGE_RATE" numeric(15, 2),
	"TOTAL_PRODUCT_AMOUNT" numeric(15, 4),
	"VAT_AMOUNT" numeric(15, 4),
	"FINAL_SALES_AMOUNT" numeric(15, 4),
	"TOTAL_PRODUCT_AMOUNT_LC" numeric(15, 4),
	"FINAL_SALES_AMOUNT_LC" numeric(15, 4),
	"TEST_DESC" varchar(50),
	"REMARKS" varchar(2000),
	"STATUS_ENTRY" varchar(20),
	"CREATED_BY" varchar(50),
	"CREATED_DATE" timestamp,
	"CREATED_MAC_ADDRESS" varchar(50),
	"MODIFIED_BY" varchar(50),
	"MODIFIED_DATE" timestamp,
	"MODIFIED_MAC_ADDRESS" varchar(50),
	"SUBMITTED_BY" varchar(50),
	"SUBMITTED_DATE" timestamp,
	"SUBMITTED_MAC_ADDRESS" varchar(50)
);
--> statement-breakpoint
CREATE TABLE "stoentries"."TBL_EXPENSE_DTL" (
	"SNO" serial PRIMARY KEY NOT NULL,
	"EXPENSE_REF_NO" varchar(50),
	"PO_REF_NO" varchar(50),
	"PO_DTL_SNO" integer,
	"PRODUCT_ID" integer,
	"EXPENSE_AMOUNT" numeric(18, 2),
	"EXPENSE_AMOUNT_LC" numeric(18, 2),
	"REMARKS" varchar(2000),
	"STATUS_ENTRY" varchar(20),
	"CREATED_BY" varchar(50),
	"CREATED_DATE" timestamp,
	"CREATED_IP_ADDRESS" varchar(50),
	"MODIFIED_BY" varchar(50),
	"MODIFIED_DATE" timestamp,
	"MODIFIED_IP_ADDRESS" varchar(50)
);
--> statement-breakpoint
CREATE TABLE "stoentries"."TBL_EXPENSE_FILES_UPLOAD" (
	"SNO" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "stoentries"."TBL_EXPENSE_FILES_UPLOAD_SNO_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"EXPENSE_REF_NO" varchar(50),
	"DOCUMENT_TYPE" varchar(50),
	"DESCRIPTION_DETAILS" varchar(100),
	"FILE_NAME" varchar(150),
	"CONTENT_TYPE" varchar(50),
	"CONTENT_DATA" "bytea",
	"REMARKS" varchar(1000),
	"STATUS_MASTER" varchar(20),
	"CREATED_BY" varchar(50),
	"CREATED_DATE" timestamp,
	"CREATED_IP_ADDRESS" varchar(50),
	"MODIFIED_BY" varchar(50),
	"MODIFIED_DATE" timestamp,
	"MODIFIED_IP_ADDRESS" varchar(50)
);
--> statement-breakpoint
CREATE TABLE "stoentries"."TBL_EXPENSE_HDR" (
	"SNO" serial NOT NULL,
	"EXPENSE_REF_NO" varchar(50) PRIMARY KEY NOT NULL,
	"EXPENSE_DATE" timestamp,
	"COMPANY_ID" integer,
	"EXPENSE_AGAINST" varchar(50),
	"PO_REF_NO" varchar(50),
	"ACCOUNT_HEAD_ID" integer,
	"EXPENSE_SUPPLIER_ID" integer,
	"EXPENSE_TYPE" varchar(100),
	"TRA_EFD_RECEIPT_NO" varchar(100),
	"CURRENCY_ID" integer,
	"EXCHANGE_RATE" numeric(15, 2),
	"TOTAL_EXPENSE_AMOUNT" numeric(18, 2),
	"TOTAL_EXPENSE_AMOUNT_LC" numeric(18, 2),
	"REMARKS" varchar(2000),
	"STATUS_ENTRY" varchar(20),
	"CREATED_BY" varchar(50),
	"CREATED_DATE" timestamp,
	"CREATED_IP_ADDRESS" varchar(50),
	"MODIFIED_BY" varchar(50),
	"MODIFIED_DATE" timestamp,
	"MODIFIED_IP_ADDRESS" varchar(50),
	"SUBMITTED_BY" varchar(50),
	"SUBMITTED_DATE" timestamp,
	"SUBMITTED_IP_ADDRESS" varchar(50)
);
--> statement-breakpoint
CREATE TABLE "stoentries"."TBL_GOODS_FILES_UPLOAD" (
	"SNO" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "stoentries"."TBL_GOODS_FILES_UPLOAD_SNO_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"GRN_REF_NO" varchar(50),
	"DOCUMENT_TYPE" varchar(50),
	"DESCRIPTION_DETAILS" varchar(100),
	"FILE_NAME" varchar(150),
	"CONTENT_TYPE" varchar(50),
	"CONTENT_DATA" "bytea",
	"REMARKS" varchar(1000),
	"STATUS_MASTER" varchar(20),
	"CREATED_BY" varchar(50),
	"CREATED_DATE" timestamp,
	"CREATED_IP_ADDRESS" varchar(50),
	"MODIFIED_BY" varchar(50),
	"MODIFIED_DATE" timestamp,
	"MODIFIED_IP_ADDRESS" varchar(50)
);
--> statement-breakpoint
CREATE TABLE "stoentries"."TBL_GOODS_INWARD_GRN_DTL" (
	"SNO" serial PRIMARY KEY NOT NULL,
	"GRN_REF_NO" varchar(50),
	"PO_DTL_SNO" integer,
	"MAIN_CATEGORY_ID" integer,
	"SUB_CATEGORY_ID" integer,
	"PRODUCT_ID" integer,
	"QTY_PER_PACKING" numeric(15, 2),
	"TOTAL_QTY" numeric(15, 4),
	"UOM" varchar(50),
	"TOTAL_PACKING" numeric(15, 4),
	"ALTERNATE_UOM" varchar(500),
	"REMARKS" varchar(2000),
	"STATUS_ENTRY" varchar(20),
	"CREATED_BY" varchar(50),
	"CREATED_DATE" timestamp,
	"CREATED_IP_ADDRESS" varchar(50),
	"MODIFIED_BY" varchar(50),
	"MODIFIED_DATE" timestamp,
	"MODIFIED_IP_ADDRESS" varchar(50)
);
--> statement-breakpoint
CREATE TABLE "stoentries"."TBL_GOODS_INWARD_GRN_HDR" (
	"SNO" serial NOT NULL,
	"GRN_REF_NO" varchar(50) PRIMARY KEY NOT NULL,
	"GRN_DATE" timestamp,
	"COMPANY_ID" integer,
	"SOURCE_STORE_ID" integer,
	"GRN_STORE_ID" integer,
	"GRN_SOURCE" varchar(50),
	"DELIVERY_NOTE_REF_NO" varchar(50),
	"SUPPLIER_ID" integer,
	"PO_REF_NO" varchar(50),
	"PURCHASE_INVOICE_REF_NO" varchar(50),
	"SUPPLIER_INVOICE_NUMBER" varchar(100),
	"CONTAINER_NO" varchar(20),
	"DRIVER_NAME" varchar(50),
	"DRIVER_CONTACT_NUMBER" varchar(50),
	"VEHICLE_NO" varchar(50),
	"SEAL_NO" varchar(50),
	"REMARKS" varchar(2000),
	"STATUS_ENTRY" varchar(20),
	"CREATED_BY" varchar(50),
	"CREATED_DATE" timestamp,
	"CREATED_IP_ADDRESS" varchar(50),
	"MODIFIED_BY" varchar(50),
	"MODIFIED_DATE" timestamp,
	"MODIFIED_IP_ADDRESS" varchar(50)
);
--> statement-breakpoint
CREATE TABLE "stoentries"."TBL_PURCHASE_INVOICE_ADDITIONAL_COST_DETAILS" (
	"SNO" serial PRIMARY KEY NOT NULL,
	"PURCHASE_INVOICE_NO" varchar(50),
	"ADDITIONAL_COST_TYPE_ID" integer,
	"ADDITIONAL_COST_AMOUNT" numeric(15, 4),
	"REMARKS" varchar(1000),
	"STATUS_MASTER" varchar(50),
	"CREATED_BY" varchar(50),
	"CREATED_DATE" timestamp,
	"CREATED_IP_ADDRESS" varchar(50),
	"MODIFIED_BY" varchar(50),
	"MODIFIED_DATE" timestamp,
	"MODIFIED_IP_ADDRESS" varchar(50)
);
--> statement-breakpoint
CREATE TABLE "stoentries"."TBL_PURCHASE_INVOICE_DTL" (
	"SNO" serial PRIMARY KEY NOT NULL,
	"PURCHASE_INVOICE_REF_NO" varchar(50),
	"GRN_REF_NO" varchar(50),
	"MAIN_CATEGORY_ID" integer,
	"SUB_CATEGORY_ID" integer,
	"PRODUCT_ID" integer,
	"QTY_PER_PACKING" numeric(15, 2),
	"TOTAL_QTY" numeric(15, 4),
	"UOM" varchar(50),
	"TOTAL_PACKING" numeric(15, 4),
	"ALTERNATE_UOM" varchar(500),
	"RATE_PER_QTY" numeric(15, 6),
	"PRODUCT_AMOUNT" numeric(15, 4),
	"DISCOUNT_PERCENTAGE" numeric(15, 2),
	"DISCOUNT_AMOUNT" numeric(15, 4),
	"TOTAL_PRODUCT_AMOUNT" numeric(15, 4),
	"VAT_PERCENTAGE" numeric(15, 2),
	"VAT_AMOUNT" numeric(15, 4),
	"FINAL_PRODUCT_AMOUNT" numeric(15, 4),
	"TOTAL_PRODUCT_AMOUNT_LC" numeric(15, 4),
	"FINAL_PRODUCT_AMOUNT_LC" numeric(15, 4),
	"REMARKS" varchar(2000),
	"STATUS_ENTRY" varchar(20),
	"CREATED_BY" varchar(50),
	"CREATED_DATE" timestamp,
	"CREATED_IP_ADDRESS" varchar(50),
	"MODIFIED_BY" varchar(50),
	"MODIFIED_DATE" timestamp,
	"MODIFIED_IP_ADDRESS" varchar(50)
);
--> statement-breakpoint
CREATE TABLE "stoentries"."TBL_PURCHASE_INVOICE_FILES_UPLOAD" (
	"SNO" serial PRIMARY KEY NOT NULL,
	"PURCHASE_INVOICE_REF_NO" varchar(50),
	"DOCUMENT_TYPE" varchar(50),
	"DESCRIPTION_DETAILS" varchar(100),
	"FILE_NAME" varchar(150),
	"CONTENT_TYPE" varchar(50),
	"CONTENT_DATA" "bytea",
	"REMARKS" varchar(1000),
	"STATUS_MASTER" varchar(20),
	"CREATED_BY" varchar(50),
	"CREATED_DATE" timestamp,
	"CREATED_IP_ADDRESS" varchar(50),
	"MODIFIED_BY" varchar(50),
	"MODIFIED_DATE" timestamp,
	"MODIFIED_IP_ADDRESS" varchar(50)
);
--> statement-breakpoint
CREATE TABLE "stoentries"."TBL_PURCHASE_INVOICE_HDR" (
	"SNO" serial NOT NULL,
	"PURCHASE_INVOICE_REF_NO" varchar(50) PRIMARY KEY NOT NULL,
	"COMPANY_ID" integer,
	"INVOICE_NO" varchar(100),
	"INVOICE_DATE" timestamp,
	"PO_REF_NO" varchar(50),
	"PURCHASE_TYPE" varchar(20),
	"SUPPLIER_ID" integer,
	"STORE_ID" integer,
	"PAYMENT_TERM_ID" integer,
	"MODE_OF_PAYMENT" varchar(25),
	"CURRENCY_ID" integer,
	"PRICE_TERMS" varchar(150),
	"PRODUCT_HDR_AMOUNT" numeric(15, 4),
	"TOTAL_ADDITIONAL_COST_AMOUNT" numeric(15, 4),
	"TOTAL_PRODUCT_HDR_AMOUNT" numeric(15, 4),
	"TOTAL_VAT_HDR_AMOUNT" numeric(15, 2),
	"FINAL_INVOICE_HDR_AMOUNT" numeric(15, 2),
	"EXCHANGE_RATE" numeric(10, 2),
	"PRODUCT_HDR_AMOUNT_LC" numeric(15, 4),
	"TOTAL_ADDITIONAL_COST_AMOUNT_LC" numeric(15, 4),
	"TOTAL_PRODUCT_HDR_AMOUNT_LC" numeric(15, 4),
	"TOTAL_VAT_HDR_AMOUNT_LC" numeric(15, 2),
	"FINAL_PURCHASE_INVOICE_AMOUNT_LC" numeric(15, 2),
	"SUBMITTED_BY" varchar(50),
	"SUBMITTED_DATE" timestamp,
	"SUBMITTED_IP_ADDRESS" varchar(50),
	"RESPONSE_1_PERSON" varchar(50),
	"RESPONSE_1_DATE" timestamp,
	"RESPONSE_1_STATUS" varchar(50),
	"RESPONSE_1_REMARKS" varchar(5000),
	"RESPONSE_1_IP_ADDRESS" varchar(50),
	"RESPONSE_2_PERSON" varchar(50),
	"RESPONSE_2_DATE" timestamp,
	"RESPONSE_2_STATUS" varchar(50),
	"RESPONSE_2_REMARKS" varchar(5000),
	"RESPONSE_2_IP_ADDRESS" varchar(50),
	"FINAL_RESPONSE_PERSON" varchar(50),
	"FINAL_RESPONSE_DATE" timestamp,
	"FINAL_RESPONSE_STATUS" varchar(50),
	"FINAL_RESPONSE_REMARKS" varchar(5000),
	"REMARKS" varchar(2000),
	"STATUS_ENTRY" varchar(20),
	"CREATED_BY" varchar(50),
	"CREATED_DATE" timestamp,
	"CREATED_IP_ADDRESS" varchar(50),
	"MODIFIED_BY" varchar(50),
	"MODIFIED_DATE" timestamp,
	"MODIFIED_IP_ADDRESS" varchar(50)
);
--> statement-breakpoint
CREATE TABLE "stoentries"."TBL_PURCHASE_ORDER_ADDITIONAL_COST_DETAILS" (
	"SNO" serial PRIMARY KEY NOT NULL,
	"PO_REF_NO" varchar(50),
	"ADDITIONAL_COST_TYPE_ID" integer,
	"ADDITIONAL_COST_AMOUNT" numeric(15, 4),
	"REMARKS" varchar(1000),
	"STATUS_MASTER" varchar(50),
	"CREATED_BY" varchar(50),
	"CREATED_DATE" timestamp,
	"CREATED_IP_ADDRESS" varchar(50),
	"MODIFIED_BY" varchar(50),
	"MODIFIED_DATE" timestamp,
	"MODIFIED_IP_ADDRESS" varchar(50)
);
--> statement-breakpoint
CREATE TABLE "stoentries"."TBL_PURCHASE_ORDER_CONVERSATION_DTL" (
	"SNO" serial PRIMARY KEY NOT NULL,
	"PO_REF_NO" varchar(50),
	"RESPOND_PERSON" varchar(50),
	"DISCUSSION_DETAILS" text,
	"RESPONSE_STATUS" varchar(50),
	"STATUS_ENTRY" varchar(50),
	"REMARKS" varchar(50),
	"CREATED_BY" varchar(50),
	"CREATED_DATE" timestamp,
	"CREATED_IP_ADDRESS" varchar(50),
	"MODIFIED_BY" varchar(50),
	"MODIFIED_DATE" timestamp,
	"MODIFIED_IP_ADDRESS" varchar(50)
);
--> statement-breakpoint
CREATE TABLE "stoentries"."TBL_PURCHASE_ORDER_DTL" (
	"SNO" serial PRIMARY KEY NOT NULL,
	"PO_REF_NO" varchar(50),
	"REQUEST_STORE_ID" integer,
	"MAIN_CATEGORY_ID" integer,
	"SUB_CATEGORY_ID" integer,
	"PRODUCT_ID" integer,
	"QTY_PER_PACKING" numeric(15, 2),
	"TOTAL_QTY" numeric(15, 4),
	"UOM" varchar(50),
	"TOTAL_PACKING" numeric(15, 4),
	"ALTERNATE_UOM" varchar(500),
	"RATE_PER_QTY" numeric(15, 6),
	"PRODUCT_AMOUNT" numeric(15, 4),
	"DISCOUNT_PERCENTAGE" numeric(15, 2),
	"DISCOUNT_AMOUNT" numeric(15, 4),
	"TOTAL_PRODUCT_AMOUNT" numeric(15, 4),
	"VAT_PERCENTAGE" numeric(15, 2),
	"VAT_AMOUNT" numeric(15, 4),
	"FINAL_PRODUCT_AMOUNT" numeric(15, 4),
	"TOTAL_PRODUCT_AMOUNT_LC" numeric(15, 4),
	"FINAL_PRODUCT_AMOUNT_LC" numeric(15, 4),
	"REMARKS" varchar(2000),
	"STATUS_ENTRY" varchar(20),
	"CREATED_BY" varchar(50),
	"CREATED_DATE" timestamp,
	"CREATED_IP_ADDRESS" varchar(50),
	"MODIFIED_BY" varchar(50),
	"MODIFIED_DATE" timestamp,
	"MODIFIED_IP_ADDRESS" varchar(50)
);
--> statement-breakpoint
CREATE TABLE "stoentries"."TBL_PURCHASE_ORDER_FILES_UPLOAD" (
	"SNO" serial PRIMARY KEY NOT NULL,
	"PO_REF_NO" varchar(50),
	"DOCUMENT_TYPE" varchar(50),
	"DESCRIPTION_DETAILS" varchar(100),
	"FILE_NAME" varchar(150),
	"CONTENT_TYPE" varchar(50),
	"CONTENT_DATA" "bytea",
	"REMARKS" varchar(1000),
	"STATUS_MASTER" varchar(20),
	"CREATED_BY" varchar(50),
	"CREATED_DATE" timestamp,
	"CREATED_IP_ADDRESS" varchar(50),
	"MODIFIED_BY" varchar(50),
	"MODIFIED_DATE" timestamp,
	"MODIFIED_IP_ADDRESS" varchar(50)
);
--> statement-breakpoint
CREATE TABLE "stoentries"."TBL_PURCHASE_ORDER_HDR" (
	"SNO" serial NOT NULL,
	"PO_REF_NO" varchar(50) PRIMARY KEY NOT NULL,
	"PO_DATE" timestamp,
	"PURCHASE_TYPE" varchar(20),
	"COMPANY_ID" integer,
	"SUPPLIER_ID" integer,
	"PO_STORE_ID" integer,
	"PAYMENT_TERM_ID" integer,
	"MODE_OF_PAYMENT" varchar(25),
	"CURRENCY_ID" integer,
	"SUPLIER_PROFORMA_NUMBER" varchar(100),
	"SHIPMENT_MODE" varchar(100),
	"PRICE_TERMS" varchar(150),
	"ESTIMATED_SHIPMENT_DATE" timestamp,
	"SHIPMENT_REMARKS" varchar(2500),
	"PRODUCT_HDR_AMOUNT" numeric(15, 4),
	"TOTAL_ADDITIONAL_COST_AMOUNT" numeric(15, 4),
	"TOTAL_PRODUCT_HDR_AMOUNT" numeric(15, 4),
	"TOTAL_VAT_HDR_AMOUNT" numeric(15, 2),
	"FINAL_PURCHASE_HDR_AMOUNT" numeric(15, 2),
	"EXCHANGE_RATE" numeric(10, 2),
	"PRODUCT_HDR_AMOUNT_LC" numeric(15, 4),
	"TOTAL_ADDITIONAL_COST_AMOUNT_LC" numeric(15, 4),
	"TOTAL_PRODUCT_HDR_AMOUNT_LC" numeric(15, 4),
	"TOTAL_VAT_HDR_AMOUNT_LC" numeric(15, 2),
	"FINAL_PURCHASE_HDR_AMOUNT_LC" numeric(15, 2),
	"SUBMITTED_BY" varchar(50),
	"SUBMITTED_DATE" timestamp,
	"SUBMITTED_IP_ADDRESS" varchar(50),
	"PURCHASE_HEAD_RESPONSE_PERSON" varchar(50),
	"PURCHASE_HEAD_RESPONSE_DATE" timestamp,
	"PURCHASE_HEAD_RESPONSE_STATUS" varchar(50),
	"PURCHASE_HEAD_RESPONSE_REMARKS" varchar(500),
	"PURCHASE_HEAD_RESPONSE_IP_ADDRESS" varchar(50),
	"RESPONSE_1_PERSON" varchar(50),
	"RESPONSE_1_DATE" timestamp,
	"RESPONSE_1_STATUS" varchar(50),
	"RESPONSE_1_REMARKS" varchar(5000),
	"RESPONSE_1_IP_ADDRESS" varchar(50),
	"RESPONSE_2_PERSON" varchar(50),
	"RESPONSE_2_DATE" timestamp,
	"RESPONSE_2_STATUS" varchar(50),
	"RESPONSE_2_REMARKS" varchar(5000),
	"RESPONSE_2_IP_ADDRESS" varchar(50),
	"FINAL_RESPONSE_PERSON" varchar(50),
	"FINAL_RESPONSE_DATE" timestamp,
	"FINAL_RESPONSE_STATUS" varchar(50),
	"FINAL_RESPONSE_REMARKS" varchar(5000),
	"POD_DELIVERY_PERSON" varchar(150),
	"POD_DELIVERY_DATE" timestamp,
	"POD_REMARKS" varchar(2000),
	"REMARKS" varchar(2000),
	"STATUS_ENTRY" varchar(20),
	"CREATED_BY" varchar(50),
	"CREATED_DATE" timestamp,
	"CREATED_IP_ADDRESS" varchar(50),
	"MODIFIED_BY" varchar(50),
	"MODIFIED_DATE" timestamp,
	"MODIFIED_IP_ADDRESS" varchar(50)
);
--> statement-breakpoint
CREATE TABLE "stoentries"."TBL_SALES_ORDER_DTL" (
	"SNO" serial PRIMARY KEY NOT NULL,
	"SALES_ORDER_REF_NO" varchar(50),
	"MAIN_CATEGORY_ID" integer,
	"SUB_CATEGORY_ID" integer,
	"PRODUCT_ID" integer,
	"STORE_STOCK_PCS" numeric(15, 4),
	"PO_REF_NO" varchar(50),
	"PO_DTL_SNO" integer,
	"PO_DTL_STOCK_QTY" numeric(15, 4),
	"PURCHASE_RATE_PER_QTY" numeric(15, 6),
	"PO_EXPENSE_AMOUNT" numeric(15, 4),
	"SALES_RATE_PER_QTY" numeric(15, 6),
	"QTY_PER_PACKING" numeric(15, 2),
	"TOTAL_QTY" numeric(15, 4),
	"UOM" varchar(50),
	"TOTAL_PACKING" numeric(15, 4),
	"ALTERNATE_UOM" varchar(500),
	"TOTAL_PRODUCT_AMOUNT" numeric(15, 4),
	"VAT_PERCENTAGE" numeric(15, 2),
	"VAT_AMOUNT" numeric(15, 4),
	"FINAL_SALES_AMOUNT" numeric(15, 4),
	"TOTAL_PRODUCT_AMOUNT_LC" numeric(15, 4),
	"FINAL_SALES_AMOUNT_LC" numeric(15, 4),
	"REMARKS" varchar(2000),
	"STATUS_ENTRY" varchar(20),
	"CREATED_BY" varchar(50),
	"CREATED_DATE" timestamp,
	"CREATED_MAC_ADDRESS" varchar(50),
	"MODIFIED_BY" varchar(50),
	"MODIFIED_DATE" timestamp,
	"MODIFIED_MAC_ADDRESS" varchar(50)
);
--> statement-breakpoint
CREATE TABLE "stoentries"."TBL_SALES_ORDER_FILES_UPLOAD" (
	"SNO" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "stoentries"."TBL_SALES_ORDER_FILES_UPLOAD_SNO_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"SALES_ORDER_REF_NO" varchar(50),
	"DOCUMENT_TYPE" varchar(50),
	"DESCRIPTION_DETAILS" varchar(100),
	"FILE_NAME" varchar(150),
	"CONTENT_TYPE" varchar(50),
	"CONTENT_DATA" "bytea",
	"REMARKS" varchar(1000),
	"STATUS_MASTER" varchar(20),
	"CREATED_BY" varchar(50),
	"CREATED_DATE" timestamp,
	"CREATED_IP_ADDRESS" varchar(50),
	"MODIFIED_BY" varchar(50),
	"MODIFIED_DATE" timestamp,
	"MODIFIED_IP_ADDRESS" varchar(50)
);
--> statement-breakpoint
CREATE TABLE "stoentries"."TBL_SALES_ORDER_HDR" (
	"SNO" serial NOT NULL,
	"SALES_ORDER_REF_NO" varchar(50) PRIMARY KEY NOT NULL,
	"SALES_ORDER_DATE" timestamp,
	"COMPANY_ID" integer,
	"STORE_ID" integer,
	"CUSTOMER_ID" integer,
	"BILLING_LOCATION_ID" integer,
	"SALES_PERSON_EMP_ID" integer,
	"CREDIT_LIMIT_AMOUNT" numeric(15, 2),
	"CREDIT_LIMIT_DAYS" numeric(15, 2),
	"OUTSTANDING_AMOUNT" numeric(15, 2),
	"CURRENCY_ID" integer,
	"EXCHANGE_RATE" numeric(15, 2),
	"TOTAL_PRODUCT_AMOUNT" numeric(15, 4),
	"VAT_AMOUNT" numeric(15, 4),
	"FINAL_SALES_AMOUNT" numeric(15, 4),
	"TOTAL_PRODUCT_AMOUNT_LC" numeric(15, 4),
	"FINAL_SALES_AMOUNT_LC" numeric(15, 4),
	"REMARKS" varchar(2000),
	"TEST_DESC" varchar(50),
	"STATUS_ENTRY" varchar(20),
	"CREATED_BY" varchar(50),
	"CREATED_DATE" timestamp,
	"CREATED_MAC_ADDRESS" varchar(50),
	"MODIFIED_BY" varchar(50),
	"MODIFIED_DATE" timestamp,
	"MODIFIED_MAC_ADDRESS" varchar(50),
	"SUBMITTED_BY" varchar(50),
	"SUBMITTED_DATE" timestamp
);
--> statement-breakpoint
CREATE TABLE "stoentries"."TBL_SALES_PROFORMA_DTL" (
	"SNO" serial PRIMARY KEY NOT NULL,
	"SALES_PROFORMA_REF_NO" varchar(50),
	"MAIN_CATEGORY_ID" integer,
	"SUB_CATEGORY_ID" integer,
	"PRODUCT_ID" integer,
	"STORE_STOCK_PCS" numeric(15, 4),
	"PO_REF_NO" varchar(50),
	"PO_DTL_SNO" integer,
	"PO_DTL_STOCK_QTY" numeric(15, 4),
	"PURCHASE_RATE_PER_QTY" numeric(15, 6),
	"PO_EXPENSE_AMOUNT" numeric(15, 4),
	"SALES_RATE_PER_QTY" numeric(15, 6),
	"QTY_PER_PACKING" numeric(15, 2),
	"TOTAL_QTY" numeric(15, 4),
	"UOM" varchar(50),
	"TOTAL_PACKING" numeric(15, 4),
	"ALTERNATE_UOM" varchar(500),
	"TOTAL_PRODUCT_AMOUNT" numeric(15, 4),
	"VAT_PERCENTAGE" numeric(15, 2),
	"VAT_AMOUNT" numeric(15, 4),
	"FINAL_SALES_AMOUNT" numeric(15, 4),
	"TOTAL_PRODUCT_AMOUNT_LC" numeric(15, 4),
	"FINAL_SALES_AMOUNT_LC" numeric(15, 4),
	"REMARKS" varchar(2000),
	"STATUS_ENTRY" varchar(20),
	"CREATED_BY" varchar(50),
	"CREATED_DATE" timestamp,
	"CREATED_MAC_ADDRESS" varchar(50),
	"MODIFIED_BY" varchar(50),
	"MODIFIED_DATE" timestamp,
	"MODIFIED_MAC_ADDRESS" varchar(50)
);
--> statement-breakpoint
CREATE TABLE "stoentries"."TBL_SALES_PROFORMA_FILES_UPLOAD" (
	"SNO" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "stoentries"."TBL_SALES_PROFORMA_FILES_UPLOAD_SNO_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"SALES_PROFORMA_REF_NO" varchar(50),
	"DOCUMENT_TYPE" varchar(50),
	"DESCRIPTION_DETAILS" varchar(100),
	"FILE_NAME" varchar(150),
	"CONTENT_TYPE" varchar(50),
	"CONTENT_DATA" "bytea",
	"REMARKS" varchar(1000),
	"STATUS_MASTER" varchar(20),
	"CREATED_BY" varchar(50),
	"CREATED_DATE" timestamp,
	"CREATED_IP_ADDRESS" varchar(50),
	"MODIFIED_BY" varchar(50),
	"MODIFIED_DATE" timestamp,
	"MODIFIED_IP_ADDRESS" varchar(50)
);
--> statement-breakpoint
CREATE TABLE "stoentries"."TBL_SALES_PROFORMA_HDR" (
	"SNO" serial NOT NULL,
	"SALES_PROFORMA_REF_NO" varchar(50) PRIMARY KEY NOT NULL,
	"SALES_PROFORMA_DATE" timestamp,
	"COMPANY_ID" integer,
	"STORE_ID" integer,
	"CUSTOMER_ID" integer,
	"BILLING_LOCATION_ID" integer,
	"SALES_PERSON_EMP_ID" integer,
	"CURRENCY_ID" integer,
	"EXCHANGE_RATE" numeric(15, 2),
	"TOTAL_PRODUCT_AMOUNT" numeric(15, 4),
	"VAT_AMOUNT" numeric(15, 4),
	"FINAL_SALES_AMOUNT" numeric(15, 4),
	"TOTAL_PRODUCT_AMOUNT_LC" numeric(15, 4),
	"FINAL_SALES_AMOUNT_LC" numeric(15, 4),
	"REMARKS" varchar(2000),
	"TEST_DESC" varchar(50),
	"STATUS_ENTRY" varchar(20),
	"CREATED_BY" varchar(50),
	"CREATED_DATE" timestamp,
	"CREATED_MAC_ADDRESS" varchar(50),
	"MODIFIED_BY" varchar(50),
	"MODIFIED_DATE" timestamp,
	"MODIFIED_MAC_ADDRESS" varchar(50),
	"SUBMITTED_BY" varchar(50),
	"SUBMITTED_DATE" timestamp
);
--> statement-breakpoint
CREATE TABLE "stoentries"."TBL_TAX_INVOICE_DTL" (
	"SNO" serial PRIMARY KEY NOT NULL,
	"TAX_INVOICE_REF_NO" varchar(50),
	"DELIVERY_NOTE_DTL_SNO" integer,
	"PO_DTL_SNO" integer,
	"PO_REF_NO" varchar(50),
	"MAIN_CATEGORY_ID" integer,
	"SUB_CATEGORY_ID" integer,
	"PRODUCT_ID" integer,
	"SALES_RATE_PER_QTY" numeric(15, 6),
	"QTY_PER_PACKING" numeric(15, 2),
	"DELIVERY_QTY" numeric(15, 4),
	"INVOICE_QTY" numeric(15, 4),
	"UOM" varchar(50),
	"TOTAL_PACKING" numeric(15, 4),
	"ALTERNATE_UOM" varchar(500),
	"TOTAL_PRODUCT_AMOUNT" numeric(15, 4),
	"VAT_PERCENTAGE" numeric(15, 2),
	"VAT_AMOUNT" numeric(15, 4),
	"FINAL_SALES_AMOUNT" numeric(15, 4),
	"TOTAL_PRODUCT_AMOUNT_LC" numeric(15, 4),
	"FINAL_SALES_AMOUNT_LC" numeric(15, 4),
	"REMARKS" varchar(2000),
	"STATUS_ENTRY" varchar(20),
	"CREATED_BY" varchar(50),
	"CREATED_DATE" timestamp,
	"CREATED_MAC_ADDRESS" varchar(50),
	"MODIFIED_BY" varchar(50),
	"MODIFIED_DATE" timestamp,
	"MODIFIED_MAC_ADDRESS" varchar(50)
);
--> statement-breakpoint
CREATE TABLE "stoentries"."TBL_TAX_INVOICE_FILES_UPLOAD" (
	"SNO" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "stoentries"."TBL_TAX_INVOICE_FILES_UPLOAD_SNO_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"TAX_INVOICE_REF_NO" varchar(50),
	"DOCUMENT_TYPE" varchar(50),
	"DESCRIPTION_DETAILS" varchar(100),
	"FILE_NAME" varchar(150),
	"CONTENT_TYPE" varchar(50),
	"CONTENT_DATA" "bytea",
	"REMARKS" varchar(1000),
	"STATUS_MASTER" varchar(20),
	"CREATED_BY" varchar(50),
	"CREATED_DATE" timestamp,
	"CREATED_IP_ADDRESS" varchar(50),
	"MODIFIED_BY" varchar(50),
	"MODIFIED_DATE" timestamp,
	"MODIFIED_IP_ADDRESS" varchar(50)
);
--> statement-breakpoint
CREATE TABLE "stoentries"."TBL_TAX_INVOICE_HDR" (
	"SNO" serial NOT NULL,
	"TAX_INVOICE_REF_NO" varchar(50) PRIMARY KEY NOT NULL,
	"INVOICE_DATE" timestamp,
	"COMPANY_ID" integer,
	"FROM_STORE_ID" integer,
	"INVOICE_TYPE" varchar(50),
	"DELIVERY_NOTE_REF_NO" varchar(50),
	"CUSTOMER_ID" integer,
	"CURRENCY_ID" integer,
	"EXCHANGE_RATE" numeric(15, 2),
	"TOTAL_PRODUCT_AMOUNT" numeric(15, 4),
	"VAT_AMOUNT" numeric(15, 4),
	"FINAL_SALES_AMOUNT" numeric(15, 4),
	"TOTAL_PRODUCT_AMOUNT_LC" numeric(15, 4),
	"FINAL_SALES_AMOUNT_LC" numeric(15, 4),
	"TEST_DESC" varchar(50),
	"REMARKS" varchar(2000),
	"STATUS_ENTRY" varchar(20),
	"CREATED_BY" varchar(50),
	"CREATED_DATE" timestamp,
	"CREATED_MAC_ADDRESS" varchar(50),
	"MODIFIED_BY" varchar(50),
	"MODIFIED_DATE" timestamp,
	"MODIFIED_MAC_ADDRESS" varchar(50),
	"SUBMITTED_BY" varchar(50),
	"SUBMITTED_DATE" timestamp,
	"SUBMITTED_MAC_ADDRESS" varchar(50)
);
--> statement-breakpoint
ALTER TABLE "stomaster"."CUSTOMER_CREDIT_LIMIT_FILE_UPLOAD" ADD CONSTRAINT "CUSTOMER_CREDIT_LIMIT_FILE_UPLOAD_CREDIT_LIMIT_ID_tbl_Customer_Credit_Limit_Details_Sno_fk" FOREIGN KEY ("CREDIT_LIMIT_ID") REFERENCES "stomaster"."tbl_Customer_Credit_Limit_Details"("Sno") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "stomaster"."TBL_ACCOUNTS_LEDGER_MASTER" ADD CONSTRAINT "TBL_ACCOUNTS_LEDGER_MASTER_Company_id_tbl_Company_Master_Company_Id_fk" FOREIGN KEY ("Company_id") REFERENCES "stomaster"."tbl_Company_Master"("Company_Id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "stomaster"."tbl_Change_Password_Log" ADD CONSTRAINT "tbl_Change_Password_Log_login_id_TBL_USER_INFO_HDR_LOGIN_ID_USER_HDR_fk" FOREIGN KEY ("login_id") REFERENCES "stomaster"."TBL_USER_INFO_HDR"("LOGIN_ID_USER_HDR") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "stomaster"."tbl_Company_Bank_Account_Master" ADD CONSTRAINT "tbl_Company_Bank_Account_Master_Company_id_tbl_Company_Master_Company_Id_fk" FOREIGN KEY ("Company_id") REFERENCES "stomaster"."tbl_Company_Master"("Company_Id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "stomaster"."tbl_Company_Bank_Account_Master" ADD CONSTRAINT "tbl_Company_Bank_Account_Master_Bank_Id_TBL_BANK_MASTER_BANK_ID_fk" FOREIGN KEY ("Bank_Id") REFERENCES "stomaster"."TBL_BANK_MASTER"("BANK_ID") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "stomaster"."tbl_Company_Bank_Account_Master" ADD CONSTRAINT "tbl_Company_Bank_Account_Master_Currency_Id_TBL_CURRENCY_MASTER_CURRENCY_ID_fk" FOREIGN KEY ("Currency_Id") REFERENCES "stomaster"."TBL_CURRENCY_MASTER"("CURRENCY_ID") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "stomaster"."tbl_Company_Master" ADD CONSTRAINT "tbl_Company_Master_Currency_ID_TBL_CURRENCY_MASTER_CURRENCY_ID_fk" FOREIGN KEY ("Currency_ID") REFERENCES "stomaster"."TBL_CURRENCY_MASTER"("CURRENCY_ID") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "stomaster"."tbl_Customer_Address_Details" ADD CONSTRAINT "tbl_Customer_Address_Details_Customer_Id_tbl_Customer_Master_Customer_Id_fk" FOREIGN KEY ("Customer_Id") REFERENCES "stomaster"."tbl_Customer_Master"("Customer_Id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "stomaster"."TBL_CUSTOMER_COMPANY_WISE_BILLING_LOCATION_MAPPING" ADD CONSTRAINT "TBL_CUSTOMER_COMPANY_WISE_BILLING_LOCATION_MAPPING_Customer_Id_tbl_Customer_Master_Customer_Id_fk" FOREIGN KEY ("Customer_Id") REFERENCES "stomaster"."tbl_Customer_Master"("Customer_Id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "stomaster"."TBL_CUSTOMER_COMPANY_WISE_BILLING_LOCATION_MAPPING" ADD CONSTRAINT "TBL_CUSTOMER_COMPANY_WISE_BILLING_LOCATION_MAPPING_Company_id_tbl_Company_Master_Company_Id_fk" FOREIGN KEY ("Company_id") REFERENCES "stomaster"."tbl_Company_Master"("Company_Id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "stomaster"."TBL_CUSTOMER_COMPANY_WISE_BILLING_LOCATION_MAPPING" ADD CONSTRAINT "TBL_CUSTOMER_COMPANY_WISE_BILLING_LOCATION_MAPPING_Billing_Location_Id_tbl_Billing_Location_Master_Billing_Location_Id_fk" FOREIGN KEY ("Billing_Location_Id") REFERENCES "stomaster"."tbl_Billing_Location_Master"("Billing_Location_Id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "stomaster"."tbl_Customer_Credit_Limit_Details" ADD CONSTRAINT "tbl_Customer_Credit_Limit_Details_Company_id_tbl_Company_Master_Company_Id_fk" FOREIGN KEY ("Company_id") REFERENCES "stomaster"."tbl_Company_Master"("Company_Id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "stomaster"."tbl_Customer_Credit_Limit_Details" ADD CONSTRAINT "tbl_Customer_Credit_Limit_Details_Customer_Id_tbl_Customer_Master_Customer_Id_fk" FOREIGN KEY ("Customer_Id") REFERENCES "stomaster"."tbl_Customer_Master"("Customer_Id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "stomaster"."tbl_Customer_Credit_Limit_Details" ADD CONSTRAINT "tbl_Customer_Credit_Limit_Details_Currency_id_TBL_CURRENCY_MASTER_CURRENCY_ID_fk" FOREIGN KEY ("Currency_id") REFERENCES "stomaster"."TBL_CURRENCY_MASTER"("CURRENCY_ID") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "stomaster"."tbl_Customer_Credit_Limit_Details" ADD CONSTRAINT "tbl_Customer_Credit_Limit_Details_Requested_Payment_Mode_Id_TBL_CUSTOMER_PAYMENT_MODE_MASTER_PAYMENT_MODE_ID_fk" FOREIGN KEY ("Requested_Payment_Mode_Id") REFERENCES "stomaster"."TBL_CUSTOMER_PAYMENT_MODE_MASTER"("PAYMENT_MODE_ID") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "stomaster"."tbl_Customer_Credit_Limit_Details" ADD CONSTRAINT "tbl_Customer_Credit_Limit_Details_Approved_PAYMENT_MODE_ID_TBL_CUSTOMER_PAYMENT_MODE_MASTER_PAYMENT_MODE_ID_fk" FOREIGN KEY ("Approved_PAYMENT_MODE_ID") REFERENCES "stomaster"."TBL_CUSTOMER_PAYMENT_MODE_MASTER"("PAYMENT_MODE_ID") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "stomaster"."tbl_Customer_Master" ADD CONSTRAINT "tbl_Customer_Master_Billing_Location_Id_tbl_Billing_Location_Master_Billing_Location_Id_fk" FOREIGN KEY ("Billing_Location_Id") REFERENCES "stomaster"."tbl_Billing_Location_Master"("Billing_Location_Id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "stomaster"."tbl_Customer_Master" ADD CONSTRAINT "tbl_Customer_Master_Country_Id_tbl_country_master_Country_Id_fk" FOREIGN KEY ("Country_Id") REFERENCES "stomaster"."tbl_country_master"("Country_Id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "stomaster"."tbl_Customer_Master" ADD CONSTRAINT "tbl_Customer_Master_Region_Id_TBL_REGION_MASTER_REGION_ID_fk" FOREIGN KEY ("Region_Id") REFERENCES "stomaster"."TBL_REGION_MASTER"("REGION_ID") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "stomaster"."tbl_Customer_Master" ADD CONSTRAINT "tbl_Customer_Master_District_Id_tbl_District_Master_District_id_fk" FOREIGN KEY ("District_Id") REFERENCES "stomaster"."tbl_District_Master"("District_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "stomaster"."tbl_Customer_Master" ADD CONSTRAINT "tbl_Customer_Master_currency_id_TBL_CURRENCY_MASTER_CURRENCY_ID_fk" FOREIGN KEY ("currency_id") REFERENCES "stomaster"."TBL_CURRENCY_MASTER"("CURRENCY_ID") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "stomaster"."TBL_CUSTOMER_MASTER_FILES_UPLOAD" ADD CONSTRAINT "TBL_CUSTOMER_MASTER_FILES_UPLOAD_Customer_Id_tbl_Customer_Master_Customer_Id_fk" FOREIGN KEY ("Customer_Id") REFERENCES "stomaster"."tbl_Customer_Master"("Customer_Id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "stomaster"."TBL_CUSTOMER_PRODUCT_VAT_PERCENTAGE_SETTINGS" ADD CONSTRAINT "TBL_CUSTOMER_PRODUCT_VAT_PERCENTAGE_SETTINGS_Company_id_tbl_Company_Master_Company_Id_fk" FOREIGN KEY ("Company_id") REFERENCES "stomaster"."tbl_Company_Master"("Company_Id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "stomaster"."TBL_CUSTOMER_PRODUCT_VAT_PERCENTAGE_SETTINGS" ADD CONSTRAINT "TBL_CUSTOMER_PRODUCT_VAT_PERCENTAGE_SETTINGS_Customer_Id_tbl_Customer_Master_Customer_Id_fk" FOREIGN KEY ("Customer_Id") REFERENCES "stomaster"."tbl_Customer_Master"("Customer_Id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "stomaster"."TBL_CUSTOMER_PRODUCT_VAT_PERCENTAGE_SETTINGS" ADD CONSTRAINT "TBL_CUSTOMER_PRODUCT_VAT_PERCENTAGE_SETTINGS_Main_Category_Id_TBL_PRODUCT_MAIN_CATEGORY_MASTER_MAIN_CATEGORY_ID_fk" FOREIGN KEY ("Main_Category_Id") REFERENCES "stomaster"."TBL_PRODUCT_MAIN_CATEGORY_MASTER"("MAIN_CATEGORY_ID") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "stomaster"."TBL_CUSTOMER_PRODUCT_VAT_PERCENTAGE_SETTINGS" ADD CONSTRAINT "TBL_CUSTOMER_PRODUCT_VAT_PERCENTAGE_SETTINGS_Sub_Category_Id_TBL_PRODUCT_SUB_CATEGORY_MASTER_SUB_CATEGORY_ID_fk" FOREIGN KEY ("Sub_Category_Id") REFERENCES "stomaster"."TBL_PRODUCT_SUB_CATEGORY_MASTER"("SUB_CATEGORY_ID") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "stomaster"."TBL_CUSTOMER_PRODUCT_VAT_PERCENTAGE_SETTINGS" ADD CONSTRAINT "TBL_CUSTOMER_PRODUCT_VAT_PERCENTAGE_SETTINGS_Product_Id_TBL_PRODUCT_MASTER_PRODUCT_ID_fk" FOREIGN KEY ("Product_Id") REFERENCES "stomaster"."TBL_PRODUCT_MASTER"("PRODUCT_ID") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "stomaster"."tbl_Customer_Wise_Product_Price_Settings" ADD CONSTRAINT "tbl_Customer_Wise_Product_Price_Settings_Company_id_tbl_Company_Master_Company_Id_fk" FOREIGN KEY ("Company_id") REFERENCES "stomaster"."tbl_Company_Master"("Company_Id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "stomaster"."tbl_Customer_Wise_Product_Price_Settings" ADD CONSTRAINT "tbl_Customer_Wise_Product_Price_Settings_Customer_Id_tbl_Customer_Master_Customer_Id_fk" FOREIGN KEY ("Customer_Id") REFERENCES "stomaster"."tbl_Customer_Master"("Customer_Id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "stomaster"."tbl_Customer_Wise_Product_Price_Settings" ADD CONSTRAINT "tbl_Customer_Wise_Product_Price_Settings_Main_Category_Id_TBL_PRODUCT_MAIN_CATEGORY_MASTER_MAIN_CATEGORY_ID_fk" FOREIGN KEY ("Main_Category_Id") REFERENCES "stomaster"."TBL_PRODUCT_MAIN_CATEGORY_MASTER"("MAIN_CATEGORY_ID") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "stomaster"."tbl_Customer_Wise_Product_Price_Settings" ADD CONSTRAINT "tbl_Customer_Wise_Product_Price_Settings_Sub_Category_Id_TBL_PRODUCT_SUB_CATEGORY_MASTER_SUB_CATEGORY_ID_fk" FOREIGN KEY ("Sub_Category_Id") REFERENCES "stomaster"."TBL_PRODUCT_SUB_CATEGORY_MASTER"("SUB_CATEGORY_ID") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "stomaster"."tbl_Customer_Wise_Product_Price_Settings" ADD CONSTRAINT "tbl_Customer_Wise_Product_Price_Settings_Product_Id_TBL_PRODUCT_MASTER_PRODUCT_ID_fk" FOREIGN KEY ("Product_Id") REFERENCES "stomaster"."TBL_PRODUCT_MASTER"("PRODUCT_ID") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "stomaster"."tbl_Customer_Wise_Product_Price_Settings" ADD CONSTRAINT "tbl_Customer_Wise_Product_Price_Settings_currency_id_TBL_CURRENCY_MASTER_CURRENCY_ID_fk" FOREIGN KEY ("currency_id") REFERENCES "stomaster"."TBL_CURRENCY_MASTER"("CURRENCY_ID") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "stomaster"."tbl_District_Master" ADD CONSTRAINT "tbl_District_Master_Country_Id_tbl_country_master_Country_Id_fk" FOREIGN KEY ("Country_Id") REFERENCES "stomaster"."tbl_country_master"("Country_Id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "stomaster"."tbl_District_Master" ADD CONSTRAINT "tbl_District_Master_Region_Id_TBL_REGION_MASTER_REGION_ID_fk" FOREIGN KEY ("Region_Id") REFERENCES "stomaster"."TBL_REGION_MASTER"("REGION_ID") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "stomaster"."TBL_EXCHANGE_RATE_MASTER" ADD CONSTRAINT "TBL_EXCHANGE_RATE_MASTER_Company_ID_tbl_Company_Master_Company_Id_fk" FOREIGN KEY ("Company_ID") REFERENCES "stomaster"."tbl_Company_Master"("Company_Id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "stomaster"."TBL_EXCHANGE_RATE_MASTER" ADD CONSTRAINT "TBL_EXCHANGE_RATE_MASTER_CURRENCY_ID_TBL_CURRENCY_MASTER_CURRENCY_ID_fk" FOREIGN KEY ("CURRENCY_ID") REFERENCES "stomaster"."TBL_CURRENCY_MASTER"("CURRENCY_ID") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "stomaster"."tbl_field_dtl" ADD CONSTRAINT "tbl_field_dtl_field_id_fld_dtl_tbl_field_hdr_field_id_fld_hdr_fk" FOREIGN KEY ("field_id_fld_dtl") REFERENCES "stomaster"."tbl_field_hdr"("field_id_fld_hdr") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "stomaster"."tbl_Product_Company_Main_Category_Mapping" ADD CONSTRAINT "tbl_Product_Company_Main_Category_Mapping_Company_Id_tbl_Company_Master_Company_Id_fk" FOREIGN KEY ("Company_Id") REFERENCES "stomaster"."tbl_Company_Master"("Company_Id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "stomaster"."tbl_Product_Company_Main_Category_Mapping" ADD CONSTRAINT "tbl_Product_Company_Main_Category_Mapping_Main_Category_Id_TBL_PRODUCT_MAIN_CATEGORY_MASTER_MAIN_CATEGORY_ID_fk" FOREIGN KEY ("Main_Category_Id") REFERENCES "stomaster"."TBL_PRODUCT_MAIN_CATEGORY_MASTER"("MAIN_CATEGORY_ID") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "stomaster"."TBL_PRODUCT_MASTER" ADD CONSTRAINT "TBL_PRODUCT_MASTER_MAIN_CATEGORY_ID_TBL_PRODUCT_MAIN_CATEGORY_MASTER_MAIN_CATEGORY_ID_fk" FOREIGN KEY ("MAIN_CATEGORY_ID") REFERENCES "stomaster"."TBL_PRODUCT_MAIN_CATEGORY_MASTER"("MAIN_CATEGORY_ID") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "stomaster"."TBL_PRODUCT_MASTER" ADD CONSTRAINT "TBL_PRODUCT_MASTER_SUB_CATEGORY_ID_TBL_PRODUCT_SUB_CATEGORY_MASTER_SUB_CATEGORY_ID_fk" FOREIGN KEY ("SUB_CATEGORY_ID") REFERENCES "stomaster"."TBL_PRODUCT_SUB_CATEGORY_MASTER"("SUB_CATEGORY_ID") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "stomaster"."TBL_PRODUCT_OPENING_STOCK" ADD CONSTRAINT "TBL_PRODUCT_OPENING_STOCK_COMPANY_ID_tbl_Company_Master_Company_Id_fk" FOREIGN KEY ("COMPANY_ID") REFERENCES "stomaster"."tbl_Company_Master"("Company_Id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "stomaster"."TBL_PRODUCT_OPENING_STOCK" ADD CONSTRAINT "TBL_PRODUCT_OPENING_STOCK_STORE_ID_tbl_Store_Master_Store_Id_fk" FOREIGN KEY ("STORE_ID") REFERENCES "stomaster"."tbl_Store_Master"("Store_Id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "stomaster"."TBL_PRODUCT_OPENING_STOCK" ADD CONSTRAINT "TBL_PRODUCT_OPENING_STOCK_MAIN_CATEGORY_ID_TBL_PRODUCT_MAIN_CATEGORY_MASTER_MAIN_CATEGORY_ID_fk" FOREIGN KEY ("MAIN_CATEGORY_ID") REFERENCES "stomaster"."TBL_PRODUCT_MAIN_CATEGORY_MASTER"("MAIN_CATEGORY_ID") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "stomaster"."TBL_PRODUCT_OPENING_STOCK" ADD CONSTRAINT "TBL_PRODUCT_OPENING_STOCK_SUB_CATEGORY_ID_TBL_PRODUCT_SUB_CATEGORY_MASTER_SUB_CATEGORY_ID_fk" FOREIGN KEY ("SUB_CATEGORY_ID") REFERENCES "stomaster"."TBL_PRODUCT_SUB_CATEGORY_MASTER"("SUB_CATEGORY_ID") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "stomaster"."TBL_PRODUCT_OPENING_STOCK" ADD CONSTRAINT "TBL_PRODUCT_OPENING_STOCK_PRODUCT_ID_TBL_PRODUCT_MASTER_PRODUCT_ID_fk" FOREIGN KEY ("PRODUCT_ID") REFERENCES "stomaster"."TBL_PRODUCT_MASTER"("PRODUCT_ID") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "stomaster"."TBL_PRODUCT_SUB_CATEGORY_MASTER" ADD CONSTRAINT "TBL_PRODUCT_SUB_CATEGORY_MASTER_MAIN_CATEGORY_ID_TBL_PRODUCT_MAIN_CATEGORY_MASTER_MAIN_CATEGORY_ID_fk" FOREIGN KEY ("MAIN_CATEGORY_ID") REFERENCES "stomaster"."TBL_PRODUCT_MAIN_CATEGORY_MASTER"("MAIN_CATEGORY_ID") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "stomaster"."TBL_REGION_MASTER" ADD CONSTRAINT "TBL_REGION_MASTER_COUNTRY_ID_tbl_country_master_Country_Id_fk" FOREIGN KEY ("COUNTRY_ID") REFERENCES "stomaster"."tbl_country_master"("Country_Id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "stomaster"."tbl_Store_Master" ADD CONSTRAINT "tbl_Store_Master_Location_Id_tbl_Location_Master_Location_Id_fk" FOREIGN KEY ("Location_Id") REFERENCES "stomaster"."tbl_Location_Master"("Location_Id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "stomaster"."tbl_Store_Product_Minimum_Stock" ADD CONSTRAINT "tbl_Store_Product_Minimum_Stock_Company_id_tbl_Company_Master_Company_Id_fk" FOREIGN KEY ("Company_id") REFERENCES "stomaster"."tbl_Company_Master"("Company_Id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "stomaster"."tbl_Store_Product_Minimum_Stock" ADD CONSTRAINT "tbl_Store_Product_Minimum_Stock_Store_Id_tbl_Store_Master_Store_Id_fk" FOREIGN KEY ("Store_Id") REFERENCES "stomaster"."tbl_Store_Master"("Store_Id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "stomaster"."tbl_Store_Product_Minimum_Stock" ADD CONSTRAINT "tbl_Store_Product_Minimum_Stock_Main_Category_Id_TBL_PRODUCT_MAIN_CATEGORY_MASTER_MAIN_CATEGORY_ID_fk" FOREIGN KEY ("Main_Category_Id") REFERENCES "stomaster"."TBL_PRODUCT_MAIN_CATEGORY_MASTER"("MAIN_CATEGORY_ID") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "stomaster"."tbl_Store_Product_Minimum_Stock" ADD CONSTRAINT "tbl_Store_Product_Minimum_Stock_Sub_Category_Id_TBL_PRODUCT_SUB_CATEGORY_MASTER_SUB_CATEGORY_ID_fk" FOREIGN KEY ("Sub_Category_Id") REFERENCES "stomaster"."TBL_PRODUCT_SUB_CATEGORY_MASTER"("SUB_CATEGORY_ID") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "stomaster"."tbl_Store_Product_Minimum_Stock" ADD CONSTRAINT "tbl_Store_Product_Minimum_Stock_Product_Id_TBL_PRODUCT_MASTER_PRODUCT_ID_fk" FOREIGN KEY ("Product_Id") REFERENCES "stomaster"."TBL_PRODUCT_MASTER"("PRODUCT_ID") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "stomaster"."tbl_Supplier_Master" ADD CONSTRAINT "tbl_Supplier_Master_Country_Id_tbl_country_master_Country_Id_fk" FOREIGN KEY ("Country_Id") REFERENCES "stomaster"."tbl_country_master"("Country_Id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "stomaster"."TBL_USER_TO_STORE_MAPPING" ADD CONSTRAINT "TBL_USER_TO_STORE_MAPPING_USER_ID_USER_TO_ROLE_TBL_USER_INFO_HDR_LOGIN_ID_USER_HDR_fk" FOREIGN KEY ("USER_ID_USER_TO_ROLE") REFERENCES "stomaster"."TBL_USER_INFO_HDR"("LOGIN_ID_USER_HDR") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "stomaster"."TBL_USER_TO_STORE_MAPPING" ADD CONSTRAINT "TBL_USER_TO_STORE_MAPPING_COMPANY_ID_tbl_Company_Master_Company_Id_fk" FOREIGN KEY ("COMPANY_ID") REFERENCES "stomaster"."tbl_Company_Master"("Company_Id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "stomaster"."TBL_USER_TO_STORE_MAPPING" ADD CONSTRAINT "TBL_USER_TO_STORE_MAPPING_STORE_ID_USER_TO_ROLE_tbl_Store_Master_Store_Id_fk" FOREIGN KEY ("STORE_ID_USER_TO_ROLE") REFERENCES "stomaster"."tbl_Store_Master"("Store_Id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "stomaster"."TBL_USER_TO_STORE_MAPPING" ADD CONSTRAINT "TBL_USER_TO_STORE_MAPPING_ROLE_ID_USER_TO_ROLE_TBL_ROLE_MASTER_ROLE_ID_fk" FOREIGN KEY ("ROLE_ID_USER_TO_ROLE") REFERENCES "stomaster"."TBL_ROLE_MASTER"("ROLE_ID") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "stomaster"."TBL_VAT_PERCENTAGE_SETTING" ADD CONSTRAINT "TBL_VAT_PERCENTAGE_SETTING_COMPANY_ID_tbl_Company_Master_Company_Id_fk" FOREIGN KEY ("COMPANY_ID") REFERENCES "stomaster"."tbl_Company_Master"("Company_Id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "stoentries"."TBL_CUSTOMER_RECEIPT_FILES_UPLOAD" ADD CONSTRAINT "TBL_CUSTOMER_RECEIPT_FILES_UPLOAD_RECEIPT_REF_NO_TBL_CUSTOMER_RECEIPT_HDR_RECEIPT_REF_NO_fk" FOREIGN KEY ("RECEIPT_REF_NO") REFERENCES "stoentries"."TBL_CUSTOMER_RECEIPT_HDR"("RECEIPT_REF_NO") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "stoentries"."TBL_CUSTOMER_RECEIPT_HDR" ADD CONSTRAINT "TBL_CUSTOMER_RECEIPT_HDR_COMPANY_ID_tbl_Company_Master_Company_Id_fk" FOREIGN KEY ("COMPANY_ID") REFERENCES "stomaster"."tbl_Company_Master"("Company_Id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "stoentries"."TBL_CUSTOMER_RECEIPT_HDR" ADD CONSTRAINT "TBL_CUSTOMER_RECEIPT_HDR_CUSTOMER_ID_tbl_Customer_Master_Customer_Id_fk" FOREIGN KEY ("CUSTOMER_ID") REFERENCES "stomaster"."tbl_Customer_Master"("Customer_Id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "stoentries"."TBL_CUSTOMER_RECEIPT_HDR" ADD CONSTRAINT "TBL_CUSTOMER_RECEIPT_HDR_PAYMENT_MODE_ID_TBL_CUSTOMER_PAYMENT_MODE_MASTER_PAYMENT_MODE_ID_fk" FOREIGN KEY ("PAYMENT_MODE_ID") REFERENCES "stomaster"."TBL_CUSTOMER_PAYMENT_MODE_MASTER"("PAYMENT_MODE_ID") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "stoentries"."TBL_CUSTOMER_RECEIPT_HDR" ADD CONSTRAINT "TBL_CUSTOMER_RECEIPT_HDR_CR_BANK_CASH_ID_TBL_BANK_MASTER_BANK_ID_fk" FOREIGN KEY ("CR_BANK_CASH_ID") REFERENCES "stomaster"."TBL_BANK_MASTER"("BANK_ID") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "stoentries"."TBL_CUSTOMER_RECEIPT_HDR" ADD CONSTRAINT "TBL_CUSTOMER_RECEIPT_HDR_CR_ACCOUNT_ID_tbl_Company_Bank_Account_Master_Account_Id_fk" FOREIGN KEY ("CR_ACCOUNT_ID") REFERENCES "stomaster"."tbl_Company_Bank_Account_Master"("Account_Id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "stoentries"."TBL_CUSTOMER_RECEIPT_HDR" ADD CONSTRAINT "TBL_CUSTOMER_RECEIPT_HDR_DR_BANK_CASH_ID_TBL_BANK_MASTER_BANK_ID_fk" FOREIGN KEY ("DR_BANK_CASH_ID") REFERENCES "stomaster"."TBL_BANK_MASTER"("BANK_ID") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "stoentries"."TBL_CUSTOMER_RECEIPT_HDR" ADD CONSTRAINT "TBL_CUSTOMER_RECEIPT_HDR_CURRENCY_ID_TBL_CURRENCY_MASTER_CURRENCY_ID_fk" FOREIGN KEY ("CURRENCY_ID") REFERENCES "stomaster"."TBL_CURRENCY_MASTER"("CURRENCY_ID") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "stoentries"."TBL_CUSTOMER_RECEIPT_INVOICE_DTL" ADD CONSTRAINT "TBL_CUSTOMER_RECEIPT_INVOICE_DTL_RECEIPT_REF_NO_TBL_CUSTOMER_RECEIPT_HDR_RECEIPT_REF_NO_fk" FOREIGN KEY ("RECEIPT_REF_NO") REFERENCES "stoentries"."TBL_CUSTOMER_RECEIPT_HDR"("RECEIPT_REF_NO") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "stoentries"."TBL_CUSTOMER_RECEIPT_INVOICE_DTL" ADD CONSTRAINT "TBL_CUSTOMER_RECEIPT_INVOICE_DTL_TAX_INVOICE_REF_NO_TBL_TAX_INVOICE_HDR_TAX_INVOICE_REF_NO_fk" FOREIGN KEY ("TAX_INVOICE_REF_NO") REFERENCES "stoentries"."TBL_TAX_INVOICE_HDR"("TAX_INVOICE_REF_NO") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "stoentries"."TBL_DELIVERY_FILES_UPLOAD" ADD CONSTRAINT "TBL_DELIVERY_FILES_UPLOAD_DELIVERY_NOTE_REF_NO_TBL_DELIVERY_NOTE_HDR_DELIVERY_NOTE_REF_NO_fk" FOREIGN KEY ("DELIVERY_NOTE_REF_NO") REFERENCES "stoentries"."TBL_DELIVERY_NOTE_HDR"("DELIVERY_NOTE_REF_NO") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "stoentries"."TBL_DELIVERY_NOTE_DTL" ADD CONSTRAINT "TBL_DELIVERY_NOTE_DTL_DELIVERY_NOTE_REF_NO_TBL_DELIVERY_NOTE_HDR_DELIVERY_NOTE_REF_NO_fk" FOREIGN KEY ("DELIVERY_NOTE_REF_NO") REFERENCES "stoentries"."TBL_DELIVERY_NOTE_HDR"("DELIVERY_NOTE_REF_NO") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "stoentries"."TBL_DELIVERY_NOTE_DTL" ADD CONSTRAINT "TBL_DELIVERY_NOTE_DTL_PO_DTL_SNO_TBL_PURCHASE_ORDER_DTL_SNO_fk" FOREIGN KEY ("PO_DTL_SNO") REFERENCES "stoentries"."TBL_PURCHASE_ORDER_DTL"("SNO") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "stoentries"."TBL_DELIVERY_NOTE_DTL" ADD CONSTRAINT "TBL_DELIVERY_NOTE_DTL_PO_REF_NO_TBL_PURCHASE_ORDER_HDR_PO_REF_NO_fk" FOREIGN KEY ("PO_REF_NO") REFERENCES "stoentries"."TBL_PURCHASE_ORDER_HDR"("PO_REF_NO") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "stoentries"."TBL_DELIVERY_NOTE_DTL" ADD CONSTRAINT "TBL_DELIVERY_NOTE_DTL_MAIN_CATEGORY_ID_TBL_PRODUCT_MAIN_CATEGORY_MASTER_MAIN_CATEGORY_ID_fk" FOREIGN KEY ("MAIN_CATEGORY_ID") REFERENCES "stomaster"."TBL_PRODUCT_MAIN_CATEGORY_MASTER"("MAIN_CATEGORY_ID") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "stoentries"."TBL_DELIVERY_NOTE_DTL" ADD CONSTRAINT "TBL_DELIVERY_NOTE_DTL_SUB_CATEGORY_ID_TBL_PRODUCT_SUB_CATEGORY_MASTER_SUB_CATEGORY_ID_fk" FOREIGN KEY ("SUB_CATEGORY_ID") REFERENCES "stomaster"."TBL_PRODUCT_SUB_CATEGORY_MASTER"("SUB_CATEGORY_ID") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "stoentries"."TBL_DELIVERY_NOTE_DTL" ADD CONSTRAINT "TBL_DELIVERY_NOTE_DTL_PRODUCT_ID_TBL_PRODUCT_MASTER_PRODUCT_ID_fk" FOREIGN KEY ("PRODUCT_ID") REFERENCES "stomaster"."TBL_PRODUCT_MASTER"("PRODUCT_ID") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "stoentries"."TBL_DELIVERY_NOTE_HDR" ADD CONSTRAINT "TBL_DELIVERY_NOTE_HDR_COMPANY_ID_tbl_Company_Master_Company_Id_fk" FOREIGN KEY ("COMPANY_ID") REFERENCES "stomaster"."tbl_Company_Master"("Company_Id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "stoentries"."TBL_DELIVERY_NOTE_HDR" ADD CONSTRAINT "TBL_DELIVERY_NOTE_HDR_FROM_STORE_ID_tbl_Store_Master_Store_Id_fk" FOREIGN KEY ("FROM_STORE_ID") REFERENCES "stomaster"."tbl_Store_Master"("Store_Id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "stoentries"."TBL_DELIVERY_NOTE_HDR" ADD CONSTRAINT "TBL_DELIVERY_NOTE_HDR_TO_STORE_ID_tbl_Store_Master_Store_Id_fk" FOREIGN KEY ("TO_STORE_ID") REFERENCES "stomaster"."tbl_Store_Master"("Store_Id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "stoentries"."TBL_DELIVERY_NOTE_HDR" ADD CONSTRAINT "TBL_DELIVERY_NOTE_HDR_CUSTOMER_ID_tbl_Customer_Master_Customer_Id_fk" FOREIGN KEY ("CUSTOMER_ID") REFERENCES "stomaster"."tbl_Customer_Master"("Customer_Id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "stoentries"."TBL_DELIVERY_NOTE_HDR" ADD CONSTRAINT "TBL_DELIVERY_NOTE_HDR_CURRENCY_ID_TBL_CURRENCY_MASTER_CURRENCY_ID_fk" FOREIGN KEY ("CURRENCY_ID") REFERENCES "stomaster"."TBL_CURRENCY_MASTER"("CURRENCY_ID") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "stoentries"."TBL_EXPENSE_DTL" ADD CONSTRAINT "TBL_EXPENSE_DTL_EXPENSE_REF_NO_TBL_EXPENSE_HDR_EXPENSE_REF_NO_fk" FOREIGN KEY ("EXPENSE_REF_NO") REFERENCES "stoentries"."TBL_EXPENSE_HDR"("EXPENSE_REF_NO") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "stoentries"."TBL_EXPENSE_DTL" ADD CONSTRAINT "TBL_EXPENSE_DTL_PO_REF_NO_TBL_PURCHASE_ORDER_HDR_PO_REF_NO_fk" FOREIGN KEY ("PO_REF_NO") REFERENCES "stoentries"."TBL_PURCHASE_ORDER_HDR"("PO_REF_NO") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "stoentries"."TBL_EXPENSE_DTL" ADD CONSTRAINT "TBL_EXPENSE_DTL_PO_DTL_SNO_TBL_PURCHASE_ORDER_DTL_SNO_fk" FOREIGN KEY ("PO_DTL_SNO") REFERENCES "stoentries"."TBL_PURCHASE_ORDER_DTL"("SNO") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "stoentries"."TBL_EXPENSE_DTL" ADD CONSTRAINT "TBL_EXPENSE_DTL_PRODUCT_ID_TBL_PRODUCT_MASTER_PRODUCT_ID_fk" FOREIGN KEY ("PRODUCT_ID") REFERENCES "stomaster"."TBL_PRODUCT_MASTER"("PRODUCT_ID") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "stoentries"."TBL_EXPENSE_FILES_UPLOAD" ADD CONSTRAINT "TBL_EXPENSE_FILES_UPLOAD_EXPENSE_REF_NO_TBL_EXPENSE_HDR_EXPENSE_REF_NO_fk" FOREIGN KEY ("EXPENSE_REF_NO") REFERENCES "stoentries"."TBL_EXPENSE_HDR"("EXPENSE_REF_NO") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "stoentries"."TBL_EXPENSE_HDR" ADD CONSTRAINT "TBL_EXPENSE_HDR_COMPANY_ID_tbl_Company_Master_Company_Id_fk" FOREIGN KEY ("COMPANY_ID") REFERENCES "stomaster"."tbl_Company_Master"("Company_Id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "stoentries"."TBL_EXPENSE_HDR" ADD CONSTRAINT "TBL_EXPENSE_HDR_PO_REF_NO_TBL_PURCHASE_ORDER_HDR_PO_REF_NO_fk" FOREIGN KEY ("PO_REF_NO") REFERENCES "stoentries"."TBL_PURCHASE_ORDER_HDR"("PO_REF_NO") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "stoentries"."TBL_EXPENSE_HDR" ADD CONSTRAINT "TBL_EXPENSE_HDR_ACCOUNT_HEAD_ID_TBL_ACCOUNTS_HEAD_MASTER_ACCOUNT_HEAD_ID_fk" FOREIGN KEY ("ACCOUNT_HEAD_ID") REFERENCES "stomaster"."TBL_ACCOUNTS_HEAD_MASTER"("ACCOUNT_HEAD_ID") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "stoentries"."TBL_EXPENSE_HDR" ADD CONSTRAINT "TBL_EXPENSE_HDR_EXPENSE_SUPPLIER_ID_tbl_Supplier_Master_Supplier_Id_fk" FOREIGN KEY ("EXPENSE_SUPPLIER_ID") REFERENCES "stomaster"."tbl_Supplier_Master"("Supplier_Id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "stoentries"."TBL_EXPENSE_HDR" ADD CONSTRAINT "TBL_EXPENSE_HDR_CURRENCY_ID_TBL_CURRENCY_MASTER_CURRENCY_ID_fk" FOREIGN KEY ("CURRENCY_ID") REFERENCES "stomaster"."TBL_CURRENCY_MASTER"("CURRENCY_ID") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "stoentries"."TBL_GOODS_FILES_UPLOAD" ADD CONSTRAINT "TBL_GOODS_FILES_UPLOAD_GRN_REF_NO_TBL_GOODS_INWARD_GRN_HDR_GRN_REF_NO_fk" FOREIGN KEY ("GRN_REF_NO") REFERENCES "stoentries"."TBL_GOODS_INWARD_GRN_HDR"("GRN_REF_NO") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "stoentries"."TBL_GOODS_INWARD_GRN_DTL" ADD CONSTRAINT "TBL_GOODS_INWARD_GRN_DTL_GRN_REF_NO_TBL_GOODS_INWARD_GRN_HDR_GRN_REF_NO_fk" FOREIGN KEY ("GRN_REF_NO") REFERENCES "stoentries"."TBL_GOODS_INWARD_GRN_HDR"("GRN_REF_NO") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "stoentries"."TBL_GOODS_INWARD_GRN_DTL" ADD CONSTRAINT "TBL_GOODS_INWARD_GRN_DTL_PO_DTL_SNO_TBL_PURCHASE_ORDER_DTL_SNO_fk" FOREIGN KEY ("PO_DTL_SNO") REFERENCES "stoentries"."TBL_PURCHASE_ORDER_DTL"("SNO") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "stoentries"."TBL_GOODS_INWARD_GRN_DTL" ADD CONSTRAINT "TBL_GOODS_INWARD_GRN_DTL_MAIN_CATEGORY_ID_TBL_PRODUCT_MAIN_CATEGORY_MASTER_MAIN_CATEGORY_ID_fk" FOREIGN KEY ("MAIN_CATEGORY_ID") REFERENCES "stomaster"."TBL_PRODUCT_MAIN_CATEGORY_MASTER"("MAIN_CATEGORY_ID") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "stoentries"."TBL_GOODS_INWARD_GRN_DTL" ADD CONSTRAINT "TBL_GOODS_INWARD_GRN_DTL_SUB_CATEGORY_ID_TBL_PRODUCT_SUB_CATEGORY_MASTER_SUB_CATEGORY_ID_fk" FOREIGN KEY ("SUB_CATEGORY_ID") REFERENCES "stomaster"."TBL_PRODUCT_SUB_CATEGORY_MASTER"("SUB_CATEGORY_ID") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "stoentries"."TBL_GOODS_INWARD_GRN_DTL" ADD CONSTRAINT "TBL_GOODS_INWARD_GRN_DTL_PRODUCT_ID_TBL_PRODUCT_MASTER_PRODUCT_ID_fk" FOREIGN KEY ("PRODUCT_ID") REFERENCES "stomaster"."TBL_PRODUCT_MASTER"("PRODUCT_ID") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "stoentries"."TBL_GOODS_INWARD_GRN_HDR" ADD CONSTRAINT "TBL_GOODS_INWARD_GRN_HDR_COMPANY_ID_tbl_Company_Master_Company_Id_fk" FOREIGN KEY ("COMPANY_ID") REFERENCES "stomaster"."tbl_Company_Master"("Company_Id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "stoentries"."TBL_GOODS_INWARD_GRN_HDR" ADD CONSTRAINT "TBL_GOODS_INWARD_GRN_HDR_SOURCE_STORE_ID_tbl_Store_Master_Store_Id_fk" FOREIGN KEY ("SOURCE_STORE_ID") REFERENCES "stomaster"."tbl_Store_Master"("Store_Id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "stoentries"."TBL_GOODS_INWARD_GRN_HDR" ADD CONSTRAINT "TBL_GOODS_INWARD_GRN_HDR_GRN_STORE_ID_tbl_Store_Master_Store_Id_fk" FOREIGN KEY ("GRN_STORE_ID") REFERENCES "stomaster"."tbl_Store_Master"("Store_Id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "stoentries"."TBL_GOODS_INWARD_GRN_HDR" ADD CONSTRAINT "TBL_GOODS_INWARD_GRN_HDR_SUPPLIER_ID_tbl_Supplier_Master_Supplier_Id_fk" FOREIGN KEY ("SUPPLIER_ID") REFERENCES "stomaster"."tbl_Supplier_Master"("Supplier_Id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "stoentries"."TBL_GOODS_INWARD_GRN_HDR" ADD CONSTRAINT "TBL_GOODS_INWARD_GRN_HDR_PO_REF_NO_TBL_PURCHASE_ORDER_HDR_PO_REF_NO_fk" FOREIGN KEY ("PO_REF_NO") REFERENCES "stoentries"."TBL_PURCHASE_ORDER_HDR"("PO_REF_NO") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "stoentries"."TBL_PURCHASE_INVOICE_ADDITIONAL_COST_DETAILS" ADD CONSTRAINT "TBL_PURCHASE_INVOICE_ADDITIONAL_COST_DETAILS_PURCHASE_INVOICE_NO_TBL_PURCHASE_INVOICE_HDR_PURCHASE_INVOICE_REF_NO_fk" FOREIGN KEY ("PURCHASE_INVOICE_NO") REFERENCES "stoentries"."TBL_PURCHASE_INVOICE_HDR"("PURCHASE_INVOICE_REF_NO") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "stoentries"."TBL_PURCHASE_INVOICE_ADDITIONAL_COST_DETAILS" ADD CONSTRAINT "TBL_PURCHASE_INVOICE_ADDITIONAL_COST_DETAILS_ADDITIONAL_COST_TYPE_ID_TBL_ADDITIONAL_COST_TYPE_MASTER_ADDITIONAL_COST_TYPE_ID_fk" FOREIGN KEY ("ADDITIONAL_COST_TYPE_ID") REFERENCES "stomaster"."TBL_ADDITIONAL_COST_TYPE_MASTER"("ADDITIONAL_COST_TYPE_ID") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "stoentries"."TBL_PURCHASE_INVOICE_DTL" ADD CONSTRAINT "TBL_PURCHASE_INVOICE_DTL_PURCHASE_INVOICE_REF_NO_TBL_PURCHASE_INVOICE_HDR_PURCHASE_INVOICE_REF_NO_fk" FOREIGN KEY ("PURCHASE_INVOICE_REF_NO") REFERENCES "stoentries"."TBL_PURCHASE_INVOICE_HDR"("PURCHASE_INVOICE_REF_NO") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "stoentries"."TBL_PURCHASE_INVOICE_DTL" ADD CONSTRAINT "TBL_PURCHASE_INVOICE_DTL_GRN_REF_NO_TBL_GOODS_INWARD_GRN_HDR_GRN_REF_NO_fk" FOREIGN KEY ("GRN_REF_NO") REFERENCES "stoentries"."TBL_GOODS_INWARD_GRN_HDR"("GRN_REF_NO") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "stoentries"."TBL_PURCHASE_INVOICE_DTL" ADD CONSTRAINT "TBL_PURCHASE_INVOICE_DTL_MAIN_CATEGORY_ID_TBL_PRODUCT_MAIN_CATEGORY_MASTER_MAIN_CATEGORY_ID_fk" FOREIGN KEY ("MAIN_CATEGORY_ID") REFERENCES "stomaster"."TBL_PRODUCT_MAIN_CATEGORY_MASTER"("MAIN_CATEGORY_ID") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "stoentries"."TBL_PURCHASE_INVOICE_DTL" ADD CONSTRAINT "TBL_PURCHASE_INVOICE_DTL_SUB_CATEGORY_ID_TBL_PRODUCT_SUB_CATEGORY_MASTER_SUB_CATEGORY_ID_fk" FOREIGN KEY ("SUB_CATEGORY_ID") REFERENCES "stomaster"."TBL_PRODUCT_SUB_CATEGORY_MASTER"("SUB_CATEGORY_ID") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "stoentries"."TBL_PURCHASE_INVOICE_DTL" ADD CONSTRAINT "TBL_PURCHASE_INVOICE_DTL_PRODUCT_ID_TBL_PRODUCT_MASTER_PRODUCT_ID_fk" FOREIGN KEY ("PRODUCT_ID") REFERENCES "stomaster"."TBL_PRODUCT_MASTER"("PRODUCT_ID") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "stoentries"."TBL_PURCHASE_INVOICE_FILES_UPLOAD" ADD CONSTRAINT "TBL_PURCHASE_INVOICE_FILES_UPLOAD_PURCHASE_INVOICE_REF_NO_TBL_PURCHASE_INVOICE_HDR_PURCHASE_INVOICE_REF_NO_fk" FOREIGN KEY ("PURCHASE_INVOICE_REF_NO") REFERENCES "stoentries"."TBL_PURCHASE_INVOICE_HDR"("PURCHASE_INVOICE_REF_NO") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "stoentries"."TBL_PURCHASE_INVOICE_HDR" ADD CONSTRAINT "TBL_PURCHASE_INVOICE_HDR_COMPANY_ID_tbl_Company_Master_Company_Id_fk" FOREIGN KEY ("COMPANY_ID") REFERENCES "stomaster"."tbl_Company_Master"("Company_Id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "stoentries"."TBL_PURCHASE_INVOICE_HDR" ADD CONSTRAINT "TBL_PURCHASE_INVOICE_HDR_PO_REF_NO_TBL_PURCHASE_ORDER_HDR_PO_REF_NO_fk" FOREIGN KEY ("PO_REF_NO") REFERENCES "stoentries"."TBL_PURCHASE_ORDER_HDR"("PO_REF_NO") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "stoentries"."TBL_PURCHASE_INVOICE_HDR" ADD CONSTRAINT "TBL_PURCHASE_INVOICE_HDR_SUPPLIER_ID_tbl_Supplier_Master_Supplier_Id_fk" FOREIGN KEY ("SUPPLIER_ID") REFERENCES "stomaster"."tbl_Supplier_Master"("Supplier_Id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "stoentries"."TBL_PURCHASE_INVOICE_HDR" ADD CONSTRAINT "TBL_PURCHASE_INVOICE_HDR_STORE_ID_tbl_Store_Master_Store_Id_fk" FOREIGN KEY ("STORE_ID") REFERENCES "stomaster"."tbl_Store_Master"("Store_Id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "stoentries"."TBL_PURCHASE_INVOICE_HDR" ADD CONSTRAINT "TBL_PURCHASE_INVOICE_HDR_PAYMENT_TERM_ID_TBL_PAYMENT_TERM_MASTER_PAYMENT_TERM_ID_fk" FOREIGN KEY ("PAYMENT_TERM_ID") REFERENCES "stomaster"."TBL_PAYMENT_TERM_MASTER"("PAYMENT_TERM_ID") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "stoentries"."TBL_PURCHASE_INVOICE_HDR" ADD CONSTRAINT "TBL_PURCHASE_INVOICE_HDR_CURRENCY_ID_TBL_CURRENCY_MASTER_CURRENCY_ID_fk" FOREIGN KEY ("CURRENCY_ID") REFERENCES "stomaster"."TBL_CURRENCY_MASTER"("CURRENCY_ID") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "stoentries"."TBL_PURCHASE_ORDER_ADDITIONAL_COST_DETAILS" ADD CONSTRAINT "TBL_PURCHASE_ORDER_ADDITIONAL_COST_DETAILS_PO_REF_NO_TBL_PURCHASE_ORDER_HDR_PO_REF_NO_fk" FOREIGN KEY ("PO_REF_NO") REFERENCES "stoentries"."TBL_PURCHASE_ORDER_HDR"("PO_REF_NO") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "stoentries"."TBL_PURCHASE_ORDER_ADDITIONAL_COST_DETAILS" ADD CONSTRAINT "TBL_PURCHASE_ORDER_ADDITIONAL_COST_DETAILS_ADDITIONAL_COST_TYPE_ID_TBL_ADDITIONAL_COST_TYPE_MASTER_ADDITIONAL_COST_TYPE_ID_fk" FOREIGN KEY ("ADDITIONAL_COST_TYPE_ID") REFERENCES "stomaster"."TBL_ADDITIONAL_COST_TYPE_MASTER"("ADDITIONAL_COST_TYPE_ID") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "stoentries"."TBL_PURCHASE_ORDER_CONVERSATION_DTL" ADD CONSTRAINT "TBL_PURCHASE_ORDER_CONVERSATION_DTL_PO_REF_NO_TBL_PURCHASE_ORDER_HDR_PO_REF_NO_fk" FOREIGN KEY ("PO_REF_NO") REFERENCES "stoentries"."TBL_PURCHASE_ORDER_HDR"("PO_REF_NO") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "stoentries"."TBL_PURCHASE_ORDER_DTL" ADD CONSTRAINT "TBL_PURCHASE_ORDER_DTL_PO_REF_NO_TBL_PURCHASE_ORDER_HDR_PO_REF_NO_fk" FOREIGN KEY ("PO_REF_NO") REFERENCES "stoentries"."TBL_PURCHASE_ORDER_HDR"("PO_REF_NO") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "stoentries"."TBL_PURCHASE_ORDER_DTL" ADD CONSTRAINT "TBL_PURCHASE_ORDER_DTL_REQUEST_STORE_ID_tbl_Store_Master_Store_Id_fk" FOREIGN KEY ("REQUEST_STORE_ID") REFERENCES "stomaster"."tbl_Store_Master"("Store_Id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "stoentries"."TBL_PURCHASE_ORDER_DTL" ADD CONSTRAINT "TBL_PURCHASE_ORDER_DTL_MAIN_CATEGORY_ID_TBL_PRODUCT_MAIN_CATEGORY_MASTER_MAIN_CATEGORY_ID_fk" FOREIGN KEY ("MAIN_CATEGORY_ID") REFERENCES "stomaster"."TBL_PRODUCT_MAIN_CATEGORY_MASTER"("MAIN_CATEGORY_ID") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "stoentries"."TBL_PURCHASE_ORDER_DTL" ADD CONSTRAINT "TBL_PURCHASE_ORDER_DTL_SUB_CATEGORY_ID_TBL_PRODUCT_SUB_CATEGORY_MASTER_SUB_CATEGORY_ID_fk" FOREIGN KEY ("SUB_CATEGORY_ID") REFERENCES "stomaster"."TBL_PRODUCT_SUB_CATEGORY_MASTER"("SUB_CATEGORY_ID") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "stoentries"."TBL_PURCHASE_ORDER_DTL" ADD CONSTRAINT "TBL_PURCHASE_ORDER_DTL_PRODUCT_ID_TBL_PRODUCT_MASTER_PRODUCT_ID_fk" FOREIGN KEY ("PRODUCT_ID") REFERENCES "stomaster"."TBL_PRODUCT_MASTER"("PRODUCT_ID") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "stoentries"."TBL_PURCHASE_ORDER_FILES_UPLOAD" ADD CONSTRAINT "TBL_PURCHASE_ORDER_FILES_UPLOAD_PO_REF_NO_TBL_PURCHASE_ORDER_HDR_PO_REF_NO_fk" FOREIGN KEY ("PO_REF_NO") REFERENCES "stoentries"."TBL_PURCHASE_ORDER_HDR"("PO_REF_NO") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "stoentries"."TBL_PURCHASE_ORDER_HDR" ADD CONSTRAINT "TBL_PURCHASE_ORDER_HDR_COMPANY_ID_tbl_Company_Master_Company_Id_fk" FOREIGN KEY ("COMPANY_ID") REFERENCES "stomaster"."tbl_Company_Master"("Company_Id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "stoentries"."TBL_PURCHASE_ORDER_HDR" ADD CONSTRAINT "TBL_PURCHASE_ORDER_HDR_SUPPLIER_ID_tbl_Supplier_Master_Supplier_Id_fk" FOREIGN KEY ("SUPPLIER_ID") REFERENCES "stomaster"."tbl_Supplier_Master"("Supplier_Id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "stoentries"."TBL_PURCHASE_ORDER_HDR" ADD CONSTRAINT "TBL_PURCHASE_ORDER_HDR_PO_STORE_ID_tbl_Store_Master_Store_Id_fk" FOREIGN KEY ("PO_STORE_ID") REFERENCES "stomaster"."tbl_Store_Master"("Store_Id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "stoentries"."TBL_PURCHASE_ORDER_HDR" ADD CONSTRAINT "TBL_PURCHASE_ORDER_HDR_PAYMENT_TERM_ID_TBL_PAYMENT_TERM_MASTER_PAYMENT_TERM_ID_fk" FOREIGN KEY ("PAYMENT_TERM_ID") REFERENCES "stomaster"."TBL_PAYMENT_TERM_MASTER"("PAYMENT_TERM_ID") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "stoentries"."TBL_PURCHASE_ORDER_HDR" ADD CONSTRAINT "TBL_PURCHASE_ORDER_HDR_CURRENCY_ID_TBL_CURRENCY_MASTER_CURRENCY_ID_fk" FOREIGN KEY ("CURRENCY_ID") REFERENCES "stomaster"."TBL_CURRENCY_MASTER"("CURRENCY_ID") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "stoentries"."TBL_SALES_ORDER_DTL" ADD CONSTRAINT "TBL_SALES_ORDER_DTL_SALES_ORDER_REF_NO_TBL_SALES_ORDER_HDR_SALES_ORDER_REF_NO_fk" FOREIGN KEY ("SALES_ORDER_REF_NO") REFERENCES "stoentries"."TBL_SALES_ORDER_HDR"("SALES_ORDER_REF_NO") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "stoentries"."TBL_SALES_ORDER_DTL" ADD CONSTRAINT "TBL_SALES_ORDER_DTL_MAIN_CATEGORY_ID_TBL_PRODUCT_MAIN_CATEGORY_MASTER_MAIN_CATEGORY_ID_fk" FOREIGN KEY ("MAIN_CATEGORY_ID") REFERENCES "stomaster"."TBL_PRODUCT_MAIN_CATEGORY_MASTER"("MAIN_CATEGORY_ID") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "stoentries"."TBL_SALES_ORDER_DTL" ADD CONSTRAINT "TBL_SALES_ORDER_DTL_SUB_CATEGORY_ID_TBL_PRODUCT_SUB_CATEGORY_MASTER_SUB_CATEGORY_ID_fk" FOREIGN KEY ("SUB_CATEGORY_ID") REFERENCES "stomaster"."TBL_PRODUCT_SUB_CATEGORY_MASTER"("SUB_CATEGORY_ID") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "stoentries"."TBL_SALES_ORDER_DTL" ADD CONSTRAINT "TBL_SALES_ORDER_DTL_PRODUCT_ID_TBL_PRODUCT_MASTER_PRODUCT_ID_fk" FOREIGN KEY ("PRODUCT_ID") REFERENCES "stomaster"."TBL_PRODUCT_MASTER"("PRODUCT_ID") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "stoentries"."TBL_SALES_ORDER_DTL" ADD CONSTRAINT "TBL_SALES_ORDER_DTL_PO_REF_NO_TBL_PURCHASE_ORDER_HDR_PO_REF_NO_fk" FOREIGN KEY ("PO_REF_NO") REFERENCES "stoentries"."TBL_PURCHASE_ORDER_HDR"("PO_REF_NO") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "stoentries"."TBL_SALES_ORDER_DTL" ADD CONSTRAINT "TBL_SALES_ORDER_DTL_PO_DTL_SNO_TBL_PURCHASE_ORDER_DTL_SNO_fk" FOREIGN KEY ("PO_DTL_SNO") REFERENCES "stoentries"."TBL_PURCHASE_ORDER_DTL"("SNO") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "stoentries"."TBL_SALES_ORDER_FILES_UPLOAD" ADD CONSTRAINT "TBL_SALES_ORDER_FILES_UPLOAD_SALES_ORDER_REF_NO_TBL_SALES_ORDER_HDR_SALES_ORDER_REF_NO_fk" FOREIGN KEY ("SALES_ORDER_REF_NO") REFERENCES "stoentries"."TBL_SALES_ORDER_HDR"("SALES_ORDER_REF_NO") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "stoentries"."TBL_SALES_ORDER_HDR" ADD CONSTRAINT "TBL_SALES_ORDER_HDR_COMPANY_ID_tbl_Company_Master_Company_Id_fk" FOREIGN KEY ("COMPANY_ID") REFERENCES "stomaster"."tbl_Company_Master"("Company_Id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "stoentries"."TBL_SALES_ORDER_HDR" ADD CONSTRAINT "TBL_SALES_ORDER_HDR_STORE_ID_tbl_Store_Master_Store_Id_fk" FOREIGN KEY ("STORE_ID") REFERENCES "stomaster"."tbl_Store_Master"("Store_Id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "stoentries"."TBL_SALES_ORDER_HDR" ADD CONSTRAINT "TBL_SALES_ORDER_HDR_CUSTOMER_ID_tbl_Customer_Master_Customer_Id_fk" FOREIGN KEY ("CUSTOMER_ID") REFERENCES "stomaster"."tbl_Customer_Master"("Customer_Id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "stoentries"."TBL_SALES_ORDER_HDR" ADD CONSTRAINT "TBL_SALES_ORDER_HDR_BILLING_LOCATION_ID_tbl_Billing_Location_Master_Billing_Location_Id_fk" FOREIGN KEY ("BILLING_LOCATION_ID") REFERENCES "stomaster"."tbl_Billing_Location_Master"("Billing_Location_Id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "stoentries"."TBL_SALES_ORDER_HDR" ADD CONSTRAINT "TBL_SALES_ORDER_HDR_SALES_PERSON_EMP_ID_TBL_SALES_PERSON_MASTER_Sales_Person_ID_fk" FOREIGN KEY ("SALES_PERSON_EMP_ID") REFERENCES "stomaster"."TBL_SALES_PERSON_MASTER"("Sales_Person_ID") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "stoentries"."TBL_SALES_ORDER_HDR" ADD CONSTRAINT "TBL_SALES_ORDER_HDR_CURRENCY_ID_TBL_CURRENCY_MASTER_CURRENCY_ID_fk" FOREIGN KEY ("CURRENCY_ID") REFERENCES "stomaster"."TBL_CURRENCY_MASTER"("CURRENCY_ID") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "stoentries"."TBL_SALES_PROFORMA_DTL" ADD CONSTRAINT "TBL_SALES_PROFORMA_DTL_SALES_PROFORMA_REF_NO_TBL_SALES_PROFORMA_HDR_SALES_PROFORMA_REF_NO_fk" FOREIGN KEY ("SALES_PROFORMA_REF_NO") REFERENCES "stoentries"."TBL_SALES_PROFORMA_HDR"("SALES_PROFORMA_REF_NO") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "stoentries"."TBL_SALES_PROFORMA_DTL" ADD CONSTRAINT "TBL_SALES_PROFORMA_DTL_MAIN_CATEGORY_ID_TBL_PRODUCT_MAIN_CATEGORY_MASTER_MAIN_CATEGORY_ID_fk" FOREIGN KEY ("MAIN_CATEGORY_ID") REFERENCES "stomaster"."TBL_PRODUCT_MAIN_CATEGORY_MASTER"("MAIN_CATEGORY_ID") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "stoentries"."TBL_SALES_PROFORMA_DTL" ADD CONSTRAINT "TBL_SALES_PROFORMA_DTL_SUB_CATEGORY_ID_TBL_PRODUCT_SUB_CATEGORY_MASTER_SUB_CATEGORY_ID_fk" FOREIGN KEY ("SUB_CATEGORY_ID") REFERENCES "stomaster"."TBL_PRODUCT_SUB_CATEGORY_MASTER"("SUB_CATEGORY_ID") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "stoentries"."TBL_SALES_PROFORMA_DTL" ADD CONSTRAINT "TBL_SALES_PROFORMA_DTL_PRODUCT_ID_TBL_PRODUCT_MASTER_PRODUCT_ID_fk" FOREIGN KEY ("PRODUCT_ID") REFERENCES "stomaster"."TBL_PRODUCT_MASTER"("PRODUCT_ID") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "stoentries"."TBL_SALES_PROFORMA_DTL" ADD CONSTRAINT "TBL_SALES_PROFORMA_DTL_PO_REF_NO_TBL_PURCHASE_ORDER_HDR_PO_REF_NO_fk" FOREIGN KEY ("PO_REF_NO") REFERENCES "stoentries"."TBL_PURCHASE_ORDER_HDR"("PO_REF_NO") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "stoentries"."TBL_SALES_PROFORMA_DTL" ADD CONSTRAINT "TBL_SALES_PROFORMA_DTL_PO_DTL_SNO_TBL_PURCHASE_ORDER_DTL_SNO_fk" FOREIGN KEY ("PO_DTL_SNO") REFERENCES "stoentries"."TBL_PURCHASE_ORDER_DTL"("SNO") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "stoentries"."TBL_SALES_PROFORMA_FILES_UPLOAD" ADD CONSTRAINT "TBL_SALES_PROFORMA_FILES_UPLOAD_SALES_PROFORMA_REF_NO_TBL_SALES_PROFORMA_HDR_SALES_PROFORMA_REF_NO_fk" FOREIGN KEY ("SALES_PROFORMA_REF_NO") REFERENCES "stoentries"."TBL_SALES_PROFORMA_HDR"("SALES_PROFORMA_REF_NO") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "stoentries"."TBL_SALES_PROFORMA_HDR" ADD CONSTRAINT "TBL_SALES_PROFORMA_HDR_COMPANY_ID_tbl_Company_Master_Company_Id_fk" FOREIGN KEY ("COMPANY_ID") REFERENCES "stomaster"."tbl_Company_Master"("Company_Id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "stoentries"."TBL_SALES_PROFORMA_HDR" ADD CONSTRAINT "TBL_SALES_PROFORMA_HDR_STORE_ID_tbl_Store_Master_Store_Id_fk" FOREIGN KEY ("STORE_ID") REFERENCES "stomaster"."tbl_Store_Master"("Store_Id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "stoentries"."TBL_SALES_PROFORMA_HDR" ADD CONSTRAINT "TBL_SALES_PROFORMA_HDR_CUSTOMER_ID_tbl_Customer_Master_Customer_Id_fk" FOREIGN KEY ("CUSTOMER_ID") REFERENCES "stomaster"."tbl_Customer_Master"("Customer_Id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "stoentries"."TBL_SALES_PROFORMA_HDR" ADD CONSTRAINT "TBL_SALES_PROFORMA_HDR_BILLING_LOCATION_ID_tbl_Billing_Location_Master_Billing_Location_Id_fk" FOREIGN KEY ("BILLING_LOCATION_ID") REFERENCES "stomaster"."tbl_Billing_Location_Master"("Billing_Location_Id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "stoentries"."TBL_SALES_PROFORMA_HDR" ADD CONSTRAINT "TBL_SALES_PROFORMA_HDR_SALES_PERSON_EMP_ID_TBL_SALES_PERSON_MASTER_Sales_Person_ID_fk" FOREIGN KEY ("SALES_PERSON_EMP_ID") REFERENCES "stomaster"."TBL_SALES_PERSON_MASTER"("Sales_Person_ID") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "stoentries"."TBL_SALES_PROFORMA_HDR" ADD CONSTRAINT "TBL_SALES_PROFORMA_HDR_CURRENCY_ID_TBL_CURRENCY_MASTER_CURRENCY_ID_fk" FOREIGN KEY ("CURRENCY_ID") REFERENCES "stomaster"."TBL_CURRENCY_MASTER"("CURRENCY_ID") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "stoentries"."TBL_TAX_INVOICE_DTL" ADD CONSTRAINT "TBL_TAX_INVOICE_DTL_TAX_INVOICE_REF_NO_TBL_TAX_INVOICE_HDR_TAX_INVOICE_REF_NO_fk" FOREIGN KEY ("TAX_INVOICE_REF_NO") REFERENCES "stoentries"."TBL_TAX_INVOICE_HDR"("TAX_INVOICE_REF_NO") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "stoentries"."TBL_TAX_INVOICE_DTL" ADD CONSTRAINT "TBL_TAX_INVOICE_DTL_PO_DTL_SNO_TBL_PURCHASE_ORDER_DTL_SNO_fk" FOREIGN KEY ("PO_DTL_SNO") REFERENCES "stoentries"."TBL_PURCHASE_ORDER_DTL"("SNO") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "stoentries"."TBL_TAX_INVOICE_DTL" ADD CONSTRAINT "TBL_TAX_INVOICE_DTL_PO_REF_NO_TBL_PURCHASE_ORDER_HDR_PO_REF_NO_fk" FOREIGN KEY ("PO_REF_NO") REFERENCES "stoentries"."TBL_PURCHASE_ORDER_HDR"("PO_REF_NO") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "stoentries"."TBL_TAX_INVOICE_DTL" ADD CONSTRAINT "TBL_TAX_INVOICE_DTL_MAIN_CATEGORY_ID_TBL_PRODUCT_MAIN_CATEGORY_MASTER_MAIN_CATEGORY_ID_fk" FOREIGN KEY ("MAIN_CATEGORY_ID") REFERENCES "stomaster"."TBL_PRODUCT_MAIN_CATEGORY_MASTER"("MAIN_CATEGORY_ID") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "stoentries"."TBL_TAX_INVOICE_DTL" ADD CONSTRAINT "TBL_TAX_INVOICE_DTL_SUB_CATEGORY_ID_TBL_PRODUCT_SUB_CATEGORY_MASTER_SUB_CATEGORY_ID_fk" FOREIGN KEY ("SUB_CATEGORY_ID") REFERENCES "stomaster"."TBL_PRODUCT_SUB_CATEGORY_MASTER"("SUB_CATEGORY_ID") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "stoentries"."TBL_TAX_INVOICE_DTL" ADD CONSTRAINT "TBL_TAX_INVOICE_DTL_PRODUCT_ID_TBL_PRODUCT_MASTER_PRODUCT_ID_fk" FOREIGN KEY ("PRODUCT_ID") REFERENCES "stomaster"."TBL_PRODUCT_MASTER"("PRODUCT_ID") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "stoentries"."TBL_TAX_INVOICE_FILES_UPLOAD" ADD CONSTRAINT "TBL_TAX_INVOICE_FILES_UPLOAD_TAX_INVOICE_REF_NO_TBL_TAX_INVOICE_HDR_TAX_INVOICE_REF_NO_fk" FOREIGN KEY ("TAX_INVOICE_REF_NO") REFERENCES "stoentries"."TBL_TAX_INVOICE_HDR"("TAX_INVOICE_REF_NO") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "stoentries"."TBL_TAX_INVOICE_HDR" ADD CONSTRAINT "TBL_TAX_INVOICE_HDR_COMPANY_ID_tbl_Company_Master_Company_Id_fk" FOREIGN KEY ("COMPANY_ID") REFERENCES "stomaster"."tbl_Company_Master"("Company_Id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "stoentries"."TBL_TAX_INVOICE_HDR" ADD CONSTRAINT "TBL_TAX_INVOICE_HDR_FROM_STORE_ID_tbl_Store_Master_Store_Id_fk" FOREIGN KEY ("FROM_STORE_ID") REFERENCES "stomaster"."tbl_Store_Master"("Store_Id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "stoentries"."TBL_TAX_INVOICE_HDR" ADD CONSTRAINT "TBL_TAX_INVOICE_HDR_DELIVERY_NOTE_REF_NO_TBL_DELIVERY_NOTE_HDR_DELIVERY_NOTE_REF_NO_fk" FOREIGN KEY ("DELIVERY_NOTE_REF_NO") REFERENCES "stoentries"."TBL_DELIVERY_NOTE_HDR"("DELIVERY_NOTE_REF_NO") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "stoentries"."TBL_TAX_INVOICE_HDR" ADD CONSTRAINT "TBL_TAX_INVOICE_HDR_CUSTOMER_ID_tbl_Customer_Master_Customer_Id_fk" FOREIGN KEY ("CUSTOMER_ID") REFERENCES "stomaster"."tbl_Customer_Master"("Customer_Id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "stoentries"."TBL_TAX_INVOICE_HDR" ADD CONSTRAINT "TBL_TAX_INVOICE_HDR_CURRENCY_ID_TBL_CURRENCY_MASTER_CURRENCY_ID_fk" FOREIGN KEY ("CURRENCY_ID") REFERENCES "stomaster"."TBL_CURRENCY_MASTER"("CURRENCY_ID") ON DELETE no action ON UPDATE no action;