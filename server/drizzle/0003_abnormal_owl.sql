CREATE TABLE "stomaster"."tbl_Employee_Master" (
	"Employee_Id" serial PRIMARY KEY NOT NULL,
	"Card_Id" varchar(50),
	"Name" varchar(150) NOT NULL,
	"Role" varchar(100),
	"Department" integer,
	"Phone" varchar(50),
	"Email" varchar(150),
	"Remarks" varchar(1000),
	"Status_Master" varchar(20) DEFAULT 'Active',
	"Created_By" varchar(50),
	"Created_Date" timestamp,
	"Created_Mac_Address" varchar(50),
	"Modified_By" varchar(50),
	"Modified_Date" timestamp,
	"Modified_Mac_Address" varchar(50)
);
--> statement-breakpoint
CREATE TABLE "stomaster"."tbl_Tax_Master" (
	"Tax_Id" serial PRIMARY KEY NOT NULL,
	"Name" varchar(100) NOT NULL,
	"Rate" numeric(5, 2) NOT NULL,
	"Description" varchar(255),
	"Status_Master" varchar(20) DEFAULT 'Active',
	"Created_By" varchar(50),
	"Created_Date" timestamp DEFAULT now(),
	"Created_Mac_Address" varchar(50),
	"Modified_By" varchar(50),
	"Modified_Date" timestamp,
	"Modified_Mac_Address" varchar(50)
);
--> statement-breakpoint
CREATE TABLE "stoentries"."TBL_JOURNAL_DTL" (
	"SNO" serial PRIMARY KEY NOT NULL,
	"JOURNAL_REF_NO" varchar(50),
	"LEDGER_ID" integer,
	"DEBIT" numeric(30, 2) DEFAULT '0',
	"CREDIT" numeric(30, 2) DEFAULT '0',
	"REMARKS" varchar(255)
);
--> statement-breakpoint
CREATE TABLE "stoentries"."TBL_JOURNAL_HDR" (
	"SNO" serial NOT NULL,
	"JOURNAL_REF_NO" varchar(50) PRIMARY KEY NOT NULL,
	"JOURNAL_DATE" timestamp NOT NULL,
	"COMPANY_ID" integer,
	"MODULE_NAME" varchar(50),
	"MODULE_REF_NO" varchar(50),
	"NARRATION" text,
	"STATUS_ENTRY" varchar(20),
	"CREATED_BY" varchar(50),
	"CREATED_DATE" timestamp DEFAULT now(),
	"CREATED_IP_ADDRESS" varchar(50),
	"MODIFIED_BY" varchar(50),
	"MODIFIED_DATE" timestamp,
	"MODIFIED_IP_ADDRESS" varchar(50)
);
--> statement-breakpoint
ALTER TABLE "stomaster"."tbl_country_master" ALTER COLUMN "Batch_No" SET DATA TYPE varchar(50);--> statement-breakpoint
ALTER TABLE "stomaster"."tbl_Employee_Master" ADD CONSTRAINT "tbl_Employee_Master_Department_tbl_Department_Master_Department_Id_fk" FOREIGN KEY ("Department") REFERENCES "stomaster"."tbl_Department_Master"("Department_Id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "stoentries"."TBL_JOURNAL_DTL" ADD CONSTRAINT "TBL_JOURNAL_DTL_JOURNAL_REF_NO_TBL_JOURNAL_HDR_JOURNAL_REF_NO_fk" FOREIGN KEY ("JOURNAL_REF_NO") REFERENCES "stoentries"."TBL_JOURNAL_HDR"("JOURNAL_REF_NO") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "stoentries"."TBL_JOURNAL_DTL" ADD CONSTRAINT "TBL_JOURNAL_DTL_LEDGER_ID_TBL_ACCOUNTS_LEDGER_MASTER_LEDGER_ID_fk" FOREIGN KEY ("LEDGER_ID") REFERENCES "stomaster"."TBL_ACCOUNTS_LEDGER_MASTER"("LEDGER_ID") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "stoentries"."TBL_JOURNAL_HDR" ADD CONSTRAINT "TBL_JOURNAL_HDR_COMPANY_ID_tbl_Company_Master_Company_Id_fk" FOREIGN KEY ("COMPANY_ID") REFERENCES "stomaster"."tbl_Company_Master"("Company_Id") ON DELETE no action ON UPDATE no action;