CREATE TABLE "stomaster"."TBL_FINANCIAL_YEAR_MASTER" (
	"Year_Id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "stomaster"."TBL_FINANCIAL_YEAR_MASTER_Year_Id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"Company_Id" integer,
	"Financial_Year" varchar(50),
	"Start_Date" timestamp,
	"End_Date" timestamp,
	"Is_Current" varchar(20) DEFAULT 'No',
	"Status_Master" varchar(20) DEFAULT 'Active',
	"Created_By" varchar(50),
	"Created_Date" timestamp,
	"Created_Mac_Address" varchar(50),
	"Modified_By" varchar(50),
	"Modified_Date" timestamp,
	"Modified_Mac_Address" varchar(50)
);
--> statement-breakpoint
ALTER TABLE "stomaster"."TBL_FINANCIAL_YEAR_MASTER" ADD CONSTRAINT "TBL_FINANCIAL_YEAR_MASTER_Company_Id_tbl_Company_Master_Company_Id_fk" FOREIGN KEY ("Company_Id") REFERENCES "stomaster"."tbl_Company_Master"("Company_Id") ON DELETE no action ON UPDATE no action;