CREATE TABLE "stoentries"."TBL_TRIAL_BALANCE_DTL" (
	"SNO" serial PRIMARY KEY NOT NULL,
	"TB_REF_NO" varchar(50),
	"LEDGER_ID" integer,
	"OPENING_DEBIT" numeric(30, 2) DEFAULT '0',
	"OPENING_CREDIT" numeric(30, 2) DEFAULT '0',
	"PERIOD_DEBIT" numeric(30, 2) DEFAULT '0',
	"PERIOD_CREDIT" numeric(30, 2) DEFAULT '0',
	"CLOSING_DEBIT" numeric(30, 2) DEFAULT '0',
	"CLOSING_CREDIT" numeric(30, 2) DEFAULT '0',
	"REMARKS" varchar(255)
);
--> statement-breakpoint
CREATE TABLE "stoentries"."TBL_TRIAL_BALANCE_HDR" (
	"SNO" serial NOT NULL,
	"TB_REF_NO" varchar(50) PRIMARY KEY NOT NULL,
	"AS_OF_DATE" timestamp NOT NULL,
	"COMPANY_ID" integer,
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
--> statement-breakpoint
ALTER TABLE "stoentries"."TBL_TRIAL_BALANCE_DTL" ADD CONSTRAINT "TBL_TRIAL_BALANCE_DTL_TB_REF_NO_TBL_TRIAL_BALANCE_HDR_TB_REF_NO_fk" FOREIGN KEY ("TB_REF_NO") REFERENCES "stoentries"."TBL_TRIAL_BALANCE_HDR"("TB_REF_NO") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "stoentries"."TBL_TRIAL_BALANCE_DTL" ADD CONSTRAINT "TBL_TRIAL_BALANCE_DTL_LEDGER_ID_TBL_ACCOUNTS_LEDGER_MASTER_LEDGER_ID_fk" FOREIGN KEY ("LEDGER_ID") REFERENCES "stomaster"."TBL_ACCOUNTS_LEDGER_MASTER"("LEDGER_ID") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "stoentries"."TBL_TRIAL_BALANCE_HDR" ADD CONSTRAINT "TBL_TRIAL_BALANCE_HDR_COMPANY_ID_tbl_Company_Master_Company_Id_fk" FOREIGN KEY ("COMPANY_ID") REFERENCES "stomaster"."tbl_Company_Master"("Company_Id") ON DELETE no action ON UPDATE no action;