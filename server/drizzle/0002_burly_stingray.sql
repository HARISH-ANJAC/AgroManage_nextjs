CREATE TABLE "Stomaster"."TBL_FINANCIAL_YEAR_MASTER" (
	"FY_ID" serial PRIMARY KEY NOT NULL,
	"FY_NAME" varchar(50),
	"START_DATE" timestamp,
	"END_DATE" timestamp,
	"REMARKS" varchar(2000),
	"STATUS_MASTER" varchar(20),
	"CREATED_BY" varchar(50),
	"CREATED_DATE" timestamp,
	"CREATED_MAC_ADDRESS" varchar(50),
	"MODIFIED_BY" varchar(50),
	"MODIFIED_DATE" timestamp,
	"MODIFIED_MAC_ADDRESS" varchar(50),
	CONSTRAINT "TBL_FINANCIAL_YEAR_MASTER_FY_NAME_unique" UNIQUE("FY_NAME")
);
