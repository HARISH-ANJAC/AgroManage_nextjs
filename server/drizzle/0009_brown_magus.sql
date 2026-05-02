CREATE TABLE "stomaster"."TBL_BILLING_LOCATION_WISE_PRODUCT_PRICE" (
	"SNO" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "stomaster"."TBL_BILLING_LOCATION_WISE_PRODUCT_PRICE_SNO_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"Billing_Location_Id" integer,
	"Main_Category_Id" integer,
	"Sub_Category_Id" integer,
	"Product_Id" integer,
	"Unit_Price" numeric(30, 2),
	"Effective_From" timestamp,
	"Effective_To" timestamp,
	"Remarks" varchar(2000),
	"Status_Master" varchar(50) DEFAULT 'Active',
	"Created_By" varchar(100),
	"Created_Date" timestamp DEFAULT now(),
	"Created_Mac_Address" varchar(100),
	"Modified_By" varchar(100),
	"Modified_Date" timestamp,
	"Modified_Mac_Address" varchar(100)
);
--> statement-breakpoint
ALTER TABLE "stomaster"."TBL_BILLING_LOCATION_WISE_PRODUCT_PRICE" ADD CONSTRAINT "TBL_BILLING_LOCATION_WISE_PRODUCT_PRICE_Billing_Location_Id_tbl_Billing_Location_Master_Billing_Location_Id_fk" FOREIGN KEY ("Billing_Location_Id") REFERENCES "stomaster"."tbl_Billing_Location_Master"("Billing_Location_Id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "stomaster"."TBL_BILLING_LOCATION_WISE_PRODUCT_PRICE" ADD CONSTRAINT "TBL_BILLING_LOCATION_WISE_PRODUCT_PRICE_Product_Id_TBL_PRODUCT_MASTER_PRODUCT_ID_fk" FOREIGN KEY ("Product_Id") REFERENCES "stomaster"."TBL_PRODUCT_MASTER"("PRODUCT_ID") ON DELETE no action ON UPDATE no action;