CREATE TABLE "stomaster"."tbl_Department_Master" (
	"Department_Id" serial PRIMARY KEY NOT NULL,
	"Department_Name" varchar(100),
	"Department_Description" varchar(200),
	"Remarks" varchar(1000),
	"Status_Master" varchar(20),
	"Created_By" varchar(50),
	"Created_Date" timestamp,
	"Created_Mac_Address" varchar(50),
	"Modified_By" varchar(50),
	"Modified_Date" timestamp,
	"Modified_Mac_Address" varchar(50),
	CONSTRAINT "tbl_Department_Master_Department_Name_unique" UNIQUE("Department_Name")
);
