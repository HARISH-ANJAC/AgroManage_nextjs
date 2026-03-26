
--drop database Prime
create database Prime
go
use Prime

go
create Schema Stomaster
go
create Schema StoEntries
go

CREATE TABLE [StoMaster].[TBL_CUSTOMER_PAYMENT_MODE_MASTER](
	[PAYMENT_MODE_ID] [int] IDENTITY(1,1) constraint pk_payment_mode_mas primary key,
	[PAYMENT_MODE_NAME] [varchar](50) NULL,
	[SHORT_CODE] [varchar](20) NULL,
	[REMARKS] [varchar](1000) NULL,
	[STATUS_MASTER] [varchar](20) NULL,
	[CREATED_BY] [varchar](50) NULL,
	[CREATED_DATE] [datetime] NULL,
	[CREATED_MAC_ADDRESS] [varchar](50) NULL,
	[MODIFIED_BY] [varchar](50) NULL,
	[MODIFIED_DATE] [datetime] NULL,
	[MODIFIED_MAC_ADDRESS] [varchar](50) NULL,
	)

	go
CREATE TABLE [StoMaster].[tbl_Billing_Location_Master](
	[Billing_Location_Id] [int] IDENTITY(1,1) constraint pk_bill_loca_id primary key,
	[Billing_Location_Name] [varchar](100) constraint uk_bill_loc_bl unique,
	[Billing_Location_Description] [varchar](100) NULL,
	[Remarks] [varchar](2000) NULL,
	[Status_Master] [varchar](20) NULL,
	[Created_By] [varchar](50) NULL,
	[Created_Date] [datetime] NULL,
	[Created_Mac_Address] [varchar](50) NULL,
	[Modified_By] [varchar](50) NULL,
	[Modified_Date] [datetime] NULL,
	[Modified_Mac_Address] [varchar](50) NULL
	)
go

CREATE TABLE [StoMaster].[TBL_BANK_MASTER](
	[BANK_ID] [int] IDENTITY(1,1) constraint pk_bank_id_mas primary key,
	[BANK_NAME] [varchar](50) constraint uk_bank_name unique,
	[ADDRESS] [varchar](50) NULL,
	[REMARKS] [varchar](1000) NULL,
	[STATUS_MASTER] [varchar](20) NULL,
	[CREATED_BY] [varchar](50) NULL,
	[CREATED_DATE] [datetime] NULL,
	[CREATED_MAC_ADDRESS] [varchar](50) NULL,
	[MODIFIED_BY] [varchar](50) NULL,
	[MODIFIED_DATE] [datetime] NULL,
	[MODIFIED_MAC_ADDRESS] [varchar](50) NULL,
)

go

CREATE TABLE [StoMaster].[TBL_ROLE_MASTER](
	[ROLE_ID] [int] IDENTITY(1,1) constraint Pk_role_mast primary key,
	[ROLE_NAME] [varchar](50) constraint uk_role_nzame unique,
	[ROLE_DESCRIPTION] [varchar](50) NULL,
	[REMARKS] [varchar](1000) NULL,
	[STATUS_MASTER] [varchar](20) NULL,
	[CREATED_BY] [varchar](50) NULL,
	[CREATED_DATE] [datetime] NULL,
	[CREATED_MAC_ADDRESS] [varchar](50) NULL,
	[MODIFIED_BY] [varchar](50) NULL,
	[MODIFIED_DATE] [datetime] NULL,
	[MODIFIED_MAC_ADDRESS] [varchar](50) NULL,
)
 go

CREATE TABLE [StoMaster].[TBL_CURRENCY_MASTER](
	[CURRENCY_ID] [int] IDENTITY(1,1) constraint pk_curre_cuid_currency primary key,
	[CURRENCY_NAME] [varchar](50) constraint uk_curr_nzame unique,
	[ADDRESS] [varchar](50) NULL,
	[Exchange_Rate] [decimal](15, 5) NULL, -- currency exchange rate pick from master last entry
	[REMARKS] [varchar](1000) NULL,
	[STATUS_MASTER] [varchar](20) NULL,
	[CREATED_BY] [varchar](50) NULL,
	[CREATED_DATE] [datetime] NULL,
	[CREATED_MAC_ADDRESS] [varchar](50) NULL,
	[MODIFIED_BY] [varchar](50) NULL,
	[MODIFIED_DATE] [datetime] NULL,
	[MODIFIED_MAC_ADDRESS] [varchar](50) NULL,
)
 go
 
CREATE TABLE [StoMaster].[tbl_Company_Master](
	[Company_Id] [int] IDENTITY(1,1) constraint pk_comp_id_mas_comp primary key,
	[Company_Name] [varchar](100) constraint uk_comp_name_mas unique,
	[TIN_Number] [varchar](50) constraint uk_tin_name_mas unique,
	[Address] [varchar](2000) NULL,
	[Contact_Person] [varchar](50) NULL,
	[Contact_Number] [varchar](50) NULL,
	[Email] [varchar](50) NULL,
	[Short_Code] [varchar](4) NULL,
	[Finance_Start_Month] [varchar](50) NULL,
	[Finance_End_Month] [varchar](50) NULL,
	[Year_Code] [varchar](50) NULL,
	[Company_Full_Name] [varchar](150) NULL,
	[Currency_ID] int  constraint fk_cur_id_comp_mas foreign key references stomaster.tbl_currency_master(currency_id),
	[TimeZone] [varchar](50) NULL,
	[No_Of_User] [int] NULL,
	[WebSite] [varchar](50) NULL,
	[Comp_Big_Logo] [varbinary](max) NULL, -- image
	[Comp_Small_Logo] [varbinary](max) NULL,-- image
	[Comp_Letter_Head] [varbinary](max) NULL,-- image
	[Comp_Stamp_LOGO] [varbinary](max) NULL,-- image
	[Remarks] [varchar](2000) NULL,
	[Status_Master] [varchar](20) NULL,
	[Created_By] [varchar](50) NULL,
	[Created_Date] [datetime] NULL,
	[Created_Mac_Address] [varchar](50) NULL,
	[Modified_By] [varchar](50) NULL,
	[Modified_Date] [datetime] NULL,
	[Modified_Mac_Address] [varchar](50) NULL,
	)
	go


CREATE TABLE [StoMaster].[TBL_EXCHANGE_RATE_MASTER](
	SNO [int] IDENTITY(1,1) CONSTRAINT PK_EXP_ID_EX PRIMARY KEY,
	Company_ID int constraint fk_comp_id_exce foreign key references stomaster.tbl_company_master(company_id),
	[CURRENCY_ID] INT CONSTRAINT FK_CURRE_ID_EXC FOREIGN KEY REFERENCES STOMASTER.TBL_CURRENCY_MASTER(CURRENCY_ID) ,
	[Exchange_Rate] [decimal](15, 5) NULL, -- currency exchange rate pick from master last entry
	[REMARKS] [varchar](1000) NULL,
	[STATUS_MASTER] [varchar](20) NULL,
	[CREATED_BY] [varchar](50) NULL,
	[CREATED_DATE] [datetime] NULL,
	[CREATED_MAC_ADDRESS] [varchar](50) NULL,
	[MODIFIED_BY] [varchar](50) NULL,
	[MODIFIED_DATE] [datetime] NULL,
	[MODIFIED_MAC_ADDRESS] [varchar](50) NULL,
)
 go



CREATE TABLE [STOMASTER].[TBL_USER_INFO_HDR](
[LOGIN_ID_USER_HDR] INT IDENTITY(1,1) CONSTRAINT PK_LOGIN_ID_USER_HDR PRIMARY KEY,
[NEW_CARD_NO_USER_HDR] INT,
LOGIN_NAME VARCHAR(50) CONSTRAINT UK_LOGIN_NAME UNIQUE,
[PASSWORD_USER_HDR] VARCHAR(100),
[ROLE_USER_HDR] VARCHAR(100),
[MOBILE_NO_USER_HDR] VARCHAR(30),
[MAIL_ID_USER_HDR] VARCHAR(150),
[STOCK_SHOW_STATUS] VARCHAR(10),
[OUTSIDE_ACCESS_Y_N] VARCHAR(20),
[STATUS_USER_HDR] VARCHAR(20),
[REMARKS_USER_HDR] VARCHAR(1000),
[CREATED_USER_USER_HDR] VARCHAR(50),
[CREATED_DATE_USER_HDR] DATETIME,
[CREATED_MAC_ADDR_USER_HDR] VARCHAR(50),
[MODIFIED_USER_USER_HDR] VARCHAR(50),
[MODIFIED_DATE_USER_HDR] DATETIME,
[MODIFIED_MAC_ADDR_USER_HDR] VARCHAR(50),
);
go

 

CREATE TABLE [STOMASTER].[TBL_VAT_PERCENTAGE_SETTING](
[SNO] INT IDENTITY(1,1) CONSTRAINT PK_SNO_VAT_SET PRIMARY KEY,
COMPANY_ID INT CONSTRAINT FK_VAT_PERC_SETT FOREIGN KEY REFERENCES STOMASTER.TBL_COMPANY_MASTER(company_id),    
[VAT_PERCENTAGE] DECIMAL(15,2),
[EFFECTIVE_FROM] DATETIME,
[EFFECTIVE_TO] DATETIME,
[REMARKS] VARCHAR(2000),
[STATUS_MASTER] VARCHAR(20),
[CREATED_BY] VARCHAR(50),
[CREATED_DATE] DATETIME,
[CREATED_MAC_ADDRESS] VARCHAR(50),
[MODIFIED_BY] VARCHAR(50),
[MODIFIED_DATE] DATETIME,
[MODIFIED_MAC_ADDRESS] VARCHAR(50)
);
go
 
 
CREATE TABLE [StoMaster].[tbl_Location_Master](
	[Location_Id] [int] IDENTITY(1,1) constraint pk_location_id_mas primary key,
	[Location_Name] [varchar](100) constraint uk_loc_nam_mas unique,
	[Location_Description] [varchar](100) NULL,
	[Remarks] [varchar](2000) NULL,
	[Status_Master] [varchar](20) NULL,
	[Created_By] [varchar](50) NULL,
	[Created_Date] [datetime] NULL,
	[Created_Mac_Address] [varchar](50) NULL,
	[Modified_By] [varchar](50) NULL,
	[Modified_Date] [datetime] NULL,
	[Modified_Mac_Address] [varchar](50)
	)


	go

CREATE TABLE [StoMaster].[tbl_Store_Master](
	[Store_Id] [int] IDENTITY(1,1) constraint pk_store_id_mas primary key,
	[Store_Name] [varchar](100) constraint uk_store_name unique,
	[Location_Id] [int] constraint fk_loc_store_mas foreign key references stomaster.tbl_location_master(location_id),
	[Manager_Name] [varchar](50) NULL,
	[Store_Short_Code] [varchar](5) NULL,
	[Store_Short_Name] [varchar](100) NULL,
	[Email_Address] [varchar](1000) NULL,
	[CC_Email_Address] [varchar](max) NULL,
	[BCC_Email_Address] [varchar](50) NULL,
	[Response_Directors_Name] [varchar](1000) NULL,
	[Remarks] [varchar](2000) NULL,
	[Status_Master] [varchar](20) NULL,
	[Created_By] [varchar](50) NULL,
	[Created_Date] [datetime] NULL,
	[Created_Mac_Address] [varchar](50) NULL,
	[Modified_By] [varchar](50) NULL,
	[Modified_Date] [datetime] NULL,
	[Modified_Mac_Address] [varchar](50) NULL,
)
go

CREATE TABLE [STOMASTER].[TBL_USER_TO_STORE_MAPPING](
[USER_TO_LOCATION_ID_USER_TO_ROLE] INT IDENTITY(1,1) CONSTRAINT PK_USER_TO_ROLE_ID PRIMARY KEY,
[USER_ID_USER_TO_ROLE] INT CONSTRAINT FK_USER_ID_STORE_MAP FOREIGN KEY REFERENCES STOMASTER.[TBL_USER_INFO_HDR]([LOGIN_ID_USER_HDR]),
COMPANY_ID INT CONSTRAINT FK_COMP_ID_USERSTORE FOREIGN KEY REFERENCES STOMASTER.TBL_COMPANY_MASTER(COMPANY_ID),
[STORE_ID_USER_TO_ROLE] int constraint fk_store_id_userstoremap1 foreign key references stomaster.tbl_store_master(store_id),
[ROLE_ID_USER_TO_ROLE] INT constraint fk_role_id_userstoremap2 foreign key references stomaster.tbl_role_master(role_id),
[STATUS_USER_TO_ROLE] VARCHAR(20),
[CREATED_USER_USER_TO_ROLE] VARCHAR(50),
[CREATED_DATE_USER_TO_ROLE] DATETIME,
[CREATED_MAC_ADDR_USER_TO_ROLE] VARCHAR(50),
[MODIFIED_USER_USER_TO_ROLE] VARCHAR(50),
[MODIFIED_DATE_USER_TO_ROLE] DATETIME,
[MODIFIED_MAC_ADDR_USER_TO_ROLE] VARCHAR(50)
);

go
CREATE TABLE [STOMASTER].[TBL_PAYMENT_MODE_MASTER](
[PAYMENT_MODE_ID] INT IDENTITY(1,1) CONSTRAINT PK_PAY_MODE_MAS PRIMARY KEY,
[PAYMENT_MODE_NAME] VARCHAR(50) CONSTRAINT UK_PAYM_MOD_MAS UNIQUE,
[PAYMENT_MODE_PERCENTAGE] DECIMAL(15,2),
[REMARKS] VARCHAR(1000),
[STATUS_ENTRY] VARCHAR(50),
[CREATED_BY] VARCHAR(50),
[CREATED_DATE] DATETIME,
[CREATED_MAC_ADDRESS] VARCHAR(50),
[MODIFIED_BY] VARCHAR(50),
[MODIFIED_DATE] DATETIME,
[MODIFIED_MAC_ADDRESS] VARCHAR(50)
);

go
CREATE TABLE [STOMASTER].TBL_ADDITIONAL_COST_TYPE_MASTER(
[ADDITIONAL_COST_TYPE_ID] INT IDENTITY(1,1) CONSTRAINT PKADD_PAY_MODE_MAS PRIMARY KEY,
[ADDITIONAL_COST_TYPE_NAME] VARCHAR(50) CONSTRAINT UK_ADDMOD_MAS UNIQUE,
[REMARKS] VARCHAR(1000),
[STATUS_ENTRY] VARCHAR(50),
[CREATED_BY] VARCHAR(50),
[CREATED_DATE] DATETIME,
[CREATED_MAC_ADDRESS] VARCHAR(50),
[MODIFIED_BY] VARCHAR(50),
[MODIFIED_DATE] DATETIME,
[MODIFIED_MAC_ADDRESS] VARCHAR(50)
);
go
go
CREATE TABLE [STOMASTER].TBL_PAYMENT_TERM_MASTER(
PAYMENT_TERM_ID INT IDENTITY(1,1) CONSTRAINT PKADD_PAY_TERMMNAME_MAS PRIMARY KEY,
PAYMENT_TERM_NAME VARCHAR(50) CONSTRAINT UK_ADDMOD__TERMMAS UNIQUE,
[REMARKS] VARCHAR(1000),
[STATUS_ENTRY] VARCHAR(50),
[CREATED_BY] VARCHAR(50),
[CREATED_DATE] DATETIME,
[CREATED_MAC_ADDRESS] VARCHAR(50),
[MODIFIED_BY] VARCHAR(50),
[MODIFIED_DATE] DATETIME,
[MODIFIED_MAC_ADDRESS] VARCHAR(50)
);
go

CREATE TABLE [STOMASTER].TBL_ACCOUNTS_LEDGER_GROUP_MASTER(
LEDGER_GROUP_ID INT IDENTITY(1,1) CONSTRAINT PKADD_PAY_ledger_MAS PRIMARY KEY,
LEDGER_GROUP_NAME VARCHAR(50) CONSTRAINT UK_ledger_MAS UNIQUE,
[REMARKS] VARCHAR(1000),
[STATUS_ENTRY] VARCHAR(50),
[CREATED_BY] VARCHAR(50),
[CREATED_DATE] DATETIME,
[CREATED_MAC_ADDRESS] VARCHAR(50),
[MODIFIED_BY] VARCHAR(50),
[MODIFIED_DATE] DATETIME,
[MODIFIED_MAC_ADDRESS] VARCHAR(50)
);
go

CREATE TABLE [STOMASTER].TBL_ACCOUNTS_HEAD_MASTER(
[ACCOUNT_HEAD_ID] INT IDENTITY(1,1) CONSTRAINT PKADD_acc_head_MAS PRIMARY KEY,
[ACCOUNT_HEAD_NAME] VARCHAR(50) CONSTRAINT UK_Acc_hdead_MAS UNIQUE,
[REMARKS] VARCHAR(1000),
[STATUS_ENTRY] VARCHAR(50),
[CREATED_BY] VARCHAR(50),
[CREATED_DATE] DATETIME,
[CREATED_MAC_ADDRESS] VARCHAR(50),
[MODIFIED_BY] VARCHAR(50),
[MODIFIED_DATE] DATETIME,
[MODIFIED_MAC_ADDRESS] VARCHAR(50)
);
go

CREATE TABLE [STOMASTER].[TBL_PRODUCT_MAIN_CATEGORY_MASTER](
[MAIN_CATEGORY_ID] INT IDENTITY(1,1) CONSTRAINT PK_MAIN_CAT_ID PRIMARY KEY,
MAIN_CATEGORY_NAME VARCHAR(100) CONSTRAINT UK_MAIN_cATE_NAME UNIQUE,
[REMARKS] VARCHAR(2000),
[STATUS_MASTER] VARCHAR(20),
[CREATED_BY] VARCHAR(50),
[CREATED_DATE] DATETIME,
[CREATED_MAC_ADDRESS] VARCHAR(50),
[MODIFIED_BY] VARCHAR(50),
[MODIFIED_DATE] DATETIME,
[MODIFIED_MAC_ADDRESS] VARCHAR(50),
);
go

 
CREATE TABLE [STOMASTER].[TBL_PRODUCT_SUB_CATEGORY_MASTER](
[SUB_CATEGORY_ID] INT IDENTITY(1,1) CONSTRAINT PK_SNO_SUB_ID PRIMARY KEY,
SUB_CATEGORY_NAME VARCHAR(50) CONSTRAINT UK_SUUB_cATE_NAME_MAS UNIQUE,
[MAIN_CATEGORY_ID] INT CONSTRAINT FK_SUB_CAT_MAIN FOREIGN KEY REFERENCES [STOMASTER].[TBL_PRODUCT_MAIN_CATEGORY_MASTER]([MAIN_CATEGORY_ID]),
[REMARKS] VARCHAR(2000),
[STATUS_MASTER] VARCHAR(20),
[CREATED_BY] VARCHAR(50),
[CREATED_DATE] DATETIME,
[CREATED_MAC_ADDRESS] VARCHAR(50),
[MODIFIED_BY] VARCHAR(50),
[MODIFIED_DATE] DATETIME,
[MODIFIED_MAC_ADDRESS] VARCHAR(50),
);

go
CREATE TABLE [STOMASTER].[TBL_PRODUCT_MASTER](
[PRODUCT_ID] INT IDENTITY(1,1) CONSTRAINT PK_PRODUCT_ID_PMAS PRIMARY KEY,
PRODUCT_NAME VARCHAR(150) CONSTRAINT UK_PROD_NAME_MAS UNIQUE,
[MAIN_CATEGORY_ID] INT CONSTRAINT FK_MAIN_CAT_PMS FOREIGN KEY REFERENCES [STOMASTER].[TBL_PRODUCT_MAIN_CATEGORY_MASTER]([MAIN_CATEGORY_ID]),
[SUB_CATEGORY_ID] INT CONSTRAINT FK_SUB_CAT_PMS FOREIGN KEY REFERENCES [STOMASTER].[TBL_PRODUCT_SUB_CATEGORY_MASTER]([SUB_CATEGORY_ID]),
UOM VARCHAR(50),
[QTY_PER_PACKING] DECIMAL(15,2),
[ALTERNATE_UOM] VARCHAR(50),
[REMARKS] VARCHAR(2000),
[STATUS_MASTER] VARCHAR(20),
[CREATED_BY] VARCHAR(50),
[CREATED_DATE] DATETIME,
[CREATED_MAC_ADDRESS] VARCHAR(50),
[MODIFIED_BY] VARCHAR(50),
[MODIFIED_DATE] DATETIME,
[MODIFIED_MAC_ADDRESS] VARCHAR(50) 

);
go

CREATE TABLE [StoMaster].[tbl_country_master](
	[Country_Id] [int] IDENTITY(1,1) constraint pk_countr_id_mas primary key ,
	[Country_Name] [varchar](100) constraint uk_country_name_mas unique,
	[nicename] [varchar](80) NULL,
	[iso3] [varchar](50) NULL,
	[numcode] [int] NULL,
	[phonecode] [int] NULL,
	[Batch_No] [varchar](2) NULL,
	[Remarks] [varchar](1000) NULL,
	[Status_Master] [varchar](50) NULL,
	[Created_User] [varchar](50) NULL,
	[Created_Date] [datetime] NULL,
	[Created_Mac_Address] [varchar](50) NULL,
	[Modified_User] [varchar](50) NULL,
	[Modified_Date] [datetime] NULL,
	[Modified_Mac_Address] [varchar](50) NULL,
)
go

CREATE TABLE [STOMASTER].[TBL_REGION_MASTER](
[REGION_ID] INT IDENTITY(1,1) CONSTRAINT PK_REGION_ID_MAS PRIMARY KEY,
REGION_NAME VARCHAR(50) CONSTRAINT UK_UNIQUE_REG UNIQUE,
[COUNTRY_ID] INT CONSTRAINT FK_COUTRY_ID_REG FOREIGN KEY REFERENCES [STOMASTER].[TBL_COUNTRY_MASTER]([COUNTRY_ID]),
[CAPITAL] VARCHAR(50),
[NO_OF_DISTRICTS] INT,
[TOTAL_POPULATION] DECIMAL(18,2),
[ZONE_NAME] VARCHAR(50),
[DISTANCE_FROM_ARUSHA] DECIMAL(18,2),
[STATUS_MASTER] VARCHAR(20),
[CREATED_BY] VARCHAR(50),
[CREATED_DATE] DATETIME,
[CREATED_MAC_ADDRESS] VARCHAR(50),
[MODIFIED_BY] VARCHAR(50),
[MODIFIED_DATE] DATETIME,
[MODIFIED_MAC_ADDRESS] VARCHAR(50)
)
go

CREATE TABLE [STOMASTER].[TBL_PRODUCT_OPENING_STOCK](
[SNO] INT IDENTITY(1,1) CONSTRAINT PK_OPEN_STK PRIMARY KEY,
[OPENING_STOCK_DATE] DATETIME,
[COMPANY_ID] INT CONSTRAINT FK_COMP_ID_POP FOREIGN KEY REFERENCES [STOMASTER].[TBL_COMPANY_MASTER]([COMPANY_ID]),
[STORE_ID] INT CONSTRAINT FK_STORE_ID_OPEN_STK FOREIGN KEY REFERENCES [STOMASTER].[TBL_STORE_MASTER]([STORE_ID]),
[MAIN_CATEGORY_ID] INT CONSTRAINT FK_MAIN_OPEN_STK FOREIGN KEY REFERENCES [STOMASTER].[TBL_PRODUCT_MAIN_CATEGORY_MASTER]([MAIN_CATEGORY_ID]),
[SUB_CATEGORY_ID] INT CONSTRAINT FK_SUB_OPEN_STK FOREIGN KEY REFERENCES [STOMASTER].[TBL_PRODUCT_SUB_CATEGORY_MASTER]([SUB_CATEGORY_ID]),
[PRODUCT_ID] INT CONSTRAINT FK_PRODUCT_OPEN_STK FOREIGN KEY REFERENCES [STOMASTER].[TBL_PRODUCT_MASTER]([PRODUCT_ID]),
[TOTAL_QTY] DECIMAL(15,2),
[REMARKS] VARCHAR(2000),
[STATUS_MASTER] VARCHAR(20),
[CREATED_BY] VARCHAR(50),
[CREATED_DATE] DATETIME,
[CREATED_MAC_ADDRESS] VARCHAR(50),
[MODIFIED_BY] VARCHAR(50),
[MODIFIED_DATE] DATETIME,
[MODIFIED_MAC_ADDRESS] VARCHAR(50)
)
go
 go


CREATE TABLE [StoMaster].[tbl_field_hdr](
	[field_id_fld_hdr] [bigint] IDENTITY(1,1) constraint pk_field_sno primary key,
	[project_name_fld_hdr] [varchar](50) ,
	[field_category_fld_hdr] [varchar](50) constraint uk_field_cate unique,
	[field_desc_fld_hdr] [varchar](150) NULL,
	[status_fld_hdr] [varchar](20) NULL,
	[remarks_fld_hdr] [varchar](1000) NULL,
	[created_user_fld_hdr] [varchar](50) NULL,
	[created_date_fld_hdr] [datetime] NULL,
	[created_mac_addr_fld_hdr] [varchar](50) NULL,
	[modified_user_fld_hdr] [varchar](50) NULL,
	[modified_date_fld_hdr] [datetime] NULL,
	[modified_mac_addr_fld_hdr] [varchar](50) NULL,
  )
   
GO

CREATE TABLE [StoMaster].[tbl_field_dtl](
	[activity_id_fld_dtl] [bigint] IDENTITY(1,1) constraint pk_act_id_mas_dtl primary key,
	[field_id_fld_dtl] [bigint] constraint fk_field_id_dtl foreign key references  [StoMaster].[tbl_field_hdr]([field_id_fld_hdr]),
	[activity_name_fld_dtl] [varchar](max) NULL,
	[activity_desc_fld_dtl] [varchar](max) NULL,
	[status_fld_dtl] [varchar](10) NULL,
	[remarks_fld_dtl] [varchar](1000) NULL,
	[created_user_fld_dtl] [varchar](50) NULL,
	[created_date_fld_dtl] [datetime] NULL,
	[created_mac_addr_fld_dtl] [varchar](50) NULL,
	[modified_user_fld_dtl] [varchar](50) NULL,
	[modified_date_fld_dtl] [datetime] NULL,
	[modified_mac_addr_fld_dtl] [varchar](50) NULL 
)
 
GO
 
CREATE TABLE [StoMaster].[tbl_Product_Company_Main_Category_Mapping](
	[Sno] [int] IDENTITY(1,1) constraint pk_sno_prod_main_cate_map primary key ,
	[Company_Id] [int] constraint fk_comp_id_prod_comp_main foreign key references stomaster.tbl_company_master(company_id),
	[Main_Category_Id] [int] constraint fk_main_cat_id_comp_main foreign key references stomaster.tbl_product_main_category_master(main_category_id),
	[Remarks] [varchar](2000) NULL,
	[Status_Master] [varchar](20) NULL,
	[Created_By] [varchar](50) NULL,
	[Created_Date] [datetime] NULL,
	[Created_Mac_Address] [varchar](50) NULL,
	[Modified_By] [varchar](50) NULL,
	[Modified_Date] [datetime] NULL,
	[Modified_Mac_Address] [varchar](50) NULL,
)
 
GO

CREATE TABLE [StoMaster].[tbl_Store_Product_Minimum_Stock](
	[Sno] [int] IDENTITY(1,1) constraint pk_sno_prod_moq  primary key,
	[Company_id] [int] constraint fk_comp_id_moq foreign key references  stomaster.tbl_company_master(company_id),
	[Store_Id] [int] constraint fk_store_id_moq foreign key references stomaster.tbl_store_master(store_id),
	[Main_Category_Id] [int]  constraint fk_main_cat_id_moq foreign key references stomaster.tbl_product_main_category_master(main_category_id),
	[Sub_Category_Id] [int]  constraint fk_sub_cat_id_moq foreign key references stomaster.tbl_product_sub_category_master(sub_category_id),
	[Product_Id] [int] constraint fk_prod_id_moq foreign key references  stomaster.tbl_product_master(product_id),
	[Minimum_Stock_Pcs] [int] NULL,
	[Purchase_Alert_Qty] [decimal](15, 2) NULL,
	[Requested_By] [varchar](50) NULL,
	[Effective_From] [datetime] NULL,
	[Effective_To] [datetime] NULL,
	[Remarks] [varchar](2000) NULL,
	[Status_Master] [varchar](20) NULL,
	[Created_By] [varchar](50) NULL,
	[Created_Date] [datetime] NULL,
	[Created_Mac_Address] [varchar](50) NULL,
	[Modified_By] [varchar](50) NULL,
	[Modified_Date] [datetime] NULL,
	[Modified_Mac_Address] [varchar](50) NULL,
)

GO


CREATE TABLE [stomaster].[tbl_Supplier_Master](
	[Supplier_Id] [int] IDENTITY(1,1) constraint pk_sno_supp_mas primary key,
	[Supplier_Type] [varchar](50) NULL,
	[Supplier_Name] [varchar](250) constraint uk_supp_name_sup unique,
	[TIN_Number] [varchar](100) NULL,
	[Vat_Register_No] [varchar](50) NULL,
	[SH_Nick_Name] [varchar](50) NULL,
	[Shipment_Mode] [varchar](100) NULL,
	[Country_Id] [int] constraint fk_country_id_supp_ma foreign key references stomaster.tbl_country_master(country_id),
	[Region_Id] [int] NULL,
	[District_Id] [int] NULL,
	[Address] [varchar](2500) NULL,
	[Contact_Person] [varchar](50) NULL,
	[Phone_number] [varchar](50) NULL,
	[Mail_Id] [varchar](50) NULL,
	[Fax] [varchar](50) NULL,
	[vat_Percentage] [decimal](15, 2) NULL,
	[Withholding_vat_percentage] [decimal](15, 2) NULL,
	[Remarks] [varchar](150) NULL,
	[Status_Master] [varchar](20) NULL,
	[Created_User] [varchar](50) NULL,
	[Created_Date] [datetime] NULL,
	[Created_Mac_Address] [varchar](50) NULL,
	[Modified_User] [varchar](50) NULL,
	[Modified_Date] [datetime] NULL,
	[Modified_Mac_Address] [varchar](50) NULL,

	)
	go
	 

CREATE TABLE [StoMaster].[tbl_Company_Bank_Account_Master](
	[Account_Id] [int] IDENTITY(1,1) constraint pk_acc_comp_bank_mas primary key,
	[Company_id] [int] constraint fk_comp_id_bank_acc foreign key references  stomaster.tbl_company_master(company_id),
	[Bank_Id] [int] constraint fk_bank_id_bank_acc foreign key references stomaster.tbl_bank_master(bank_id),
	[Account_Name] [varchar](100) constraint uk_acc_name_comp_bank unique,
	[Account_Number] [varchar](100) constraint uk_acc_no_bank_Acc unique,
	[Swift_Code] [varchar](50) NULL,
	[Branch_Address] [varchar](200) NULL,
	[Bank_Branch_Name] [varchar](50) NULL,
	[Currency_Id] int  constraint fk_currency_id_bank_acc foreign key references stomaster.tbl_currency_master(currency_id),
	[Remarks] [varchar](2000) NULL,
	[Status_Master] [varchar](20) NULL,
	[Created_By] [varchar](50) NULL,
	[Created_Date] [datetime] NULL,
	[Created_Mac_Address] [varchar](50) NULL,
	[Modified_By] [varchar](50) NULL,
	[Modified_Date] [datetime] NULL,
	[Modified_Mac_Address] [varchar](50) NULL
	)
 go
  
CREATE TABLE [StoMaster].[tbl_Change_Password_Log](
	[Sno] [int] IDENTITY(1,1) constraint pk_sno_chalnge_log primary key,
	login_id int constraint fk_user_id_chang_log foreign key references stomaster.tbl_user_info_hdr([LOGIN_ID_USER_HDR]),
	[User_Name] [varchar](50) NULL,
	[Old_Password] [varchar](50) NULL,
	[New_Password] [varchar](50) NULL,
	[Reason] [varchar](1000) NULL,
	[status_entry] [varchar](50) NULL,
	[Created_by] [varchar](50) NULL,
	[Created_Date] [datetime] NULL,
	[Created_Mac_Address] [varchar](50) NULL,
	[Modified_by] [varchar](50) NULL,
	[Modified_Date] [datetime] NULL,
	[Modified_Mac_Address] [varchar](50) NULL
) 
GO


CREATE TABLE [StoMaster].[tbl_District_Master](
	[District_id] [int] IDENTITY(1,1) constraint pk_dist_id_dis primary key,
	[Country_Id] [int] constraint fk_country_id_dist_mas foreign key references stomaster.tbl_country_master(country_id),
	[Region_Id] [int]  constraint fk_reg_id_region_mas foreign key references stomaster.tbl_region_master(region_id),
	[District_Name] [varchar](50) NULL,
	[Total_Population] [decimal](18, 2) NULL,
	[Zone_Name] [varchar](50) NULL,
	[Distance_From_Arusha] [decimal](18, 2) NULL,
	[Status_Master] [varchar](20) NULL,
	[Created_By] [varchar](50) NULL,
	[Created_Date] [datetime] NULL,
	[Created_Mac_Address] [varchar](50) NULL,
	[Modified_By] [varchar](50) NULL,
	[Modified_Date] [datetime] NULL,
	[Modified_Mac_Address] [varchar](50) 
	)
	go

CREATE TABLE [StoMaster].[tbl_Customer_Master](
	[Customer_Id] [int] IDENTITY(1,1) constraint pk_cust_id_cust primary key,
	[Customer_Name] [varchar](250) constraint uk_cust_name_cust unique,
	[TIN_Number] [varchar](100) NULL,
	[VAT_Number] [varchar](50) NULL,
	[Contact_Person] [varchar](50) NULL,
	[Contact_Number] [varchar](50) NULL,
	[Location] [varchar](100) NULL,
	[Nature_Of_Business] [varchar](50) NULL, -- b2b/b2c
	[Billing_Location_Id] [int] constraint fk_bill_loc_id_cust_mas foreign key references stomaster.tbl_billing_location_master(billing_location_id),
	[Country_Id] [int] constraint fk_country_id_cust_mas foreign key references stomaster.tbl_country_master(country_id),
	[Region_Id] [int]  constraint fk_reg_id_cust_mas foreign key references stomaster.tbl_region_master(region_id),
	[District_Id] [int]  constraint fk_dist_id_cust_mas foreign key references stomaster.tbl_district_master(district_id),
	[currency_id] [int] constraint fk_curre_id_custmas foreign key references stomaster.tbl_currency_master(currency_id),
	[CREDIT_ALLOWED] [varchar](50) NULL,-- yes / no
	[Address] [varchar](1500) NULL,
	[Email_Address] [varchar](100) NULL,
	[PHONE_NUMBER_2] [varchar](50) NULL,
	[LAT] [decimal](15, 9) NULL,
	[LNG] [decimal](15, 9) NULL,
	[TIER] [varchar](50) NULL,
	[Company_Head_Contact_Person] [varchar](250) NULL,
	[Company_Head_Phone_No] [varchar](250) NULL,
	[Company_Head_Email] [varchar](250) NULL,
	[Accounts_Contact_Person] [varchar](250) NULL,
	[Accounts_Phone_No] [varchar](250) NULL,
	[Accounts_Email] [varchar](250) NULL,
	[Remarks] [varchar](2000) NULL,
	[Status_Master] [varchar](20) NULL,
	[Created_By] [varchar](50) NULL,
	[Created_Date] [datetime] NULL,
	[Created_Mac_Address] [varchar](50) NULL,
	[Modified_By] [varchar](50) NULL,
	[Modified_Date] [datetime] NULL,
	[Modified_Mac_Address] [varchar](50) NULL,
	

	)

	go

 

CREATE TABLE [StoMaster].[tbl_Customer_Address_Details](
	[Sno] [int] IDENTITY(1,1) constraint pk_sno_cust_add primary key,
	[Customer_Id] [int] constraint fk_cust_id_addre foreign key references stomaster.tbl_customer_master(customer_id),
	[Address_Count] [int] NULL, --- 1,2,3,
	[Contact_Person] [varchar](50) NULL,
	[Contact_Number] [varchar](50) NULL,
	[Address] [varchar](5000) NULL,
	[Remarks] [varchar](2000) NULL,
	[Status_Master] [varchar](20) NULL,
	[Created_By] [varchar](50) NULL,
	[Created_Date] [datetime] NULL,
	[Created_Mac_Address] [varchar](50) NULL,
	[Modified_By] [varchar](50) NULL,
	[Modified_Date] [datetime] NULL,
	[Modified_Mac_Address] [varchar](50) NULL,
  )

  go

  

CREATE TABLE [StoMaster].[TBL_CUSTOMER_MASTER_FILES_UPLOAD](
	[SNO] [int] IDENTITY(1,1) constraint pk_sno_cust_file_upl primary key,
	[Customer_Id] [int] constraint fk_cust_id_cust foreign key references stomaster.tbl_customer_master(customer_id),
	[DOCUMENT_TYPE] [varchar](50) NULL,
	[DESCRIPTIONS] [varchar](100) NULL,
	[FILE_NAME] [varchar](150) NULL,
	[CONTENT_TYPE] [varchar](50) NULL,
	[CONTENT_DATA] [varbinary](max) NULL,
	[STATUS_MASTER] [varchar](20) NULL,
	[CREATED_BY] [varchar](50) NULL,
	[CREATED_DATE] [datetime] NULL,
	[CREATED_MAC_ADDRESS] [varchar](50) NULL,
	[MODIFIED_BY] [varchar](50) NULL,
	[MODIFIED_DATE] [datetime] NULL,
	[MODIFIED_MAC_ADDRESS] [varchar](50) NULL
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
 

CREATE TABLE [StoMaster].[TBL_CUSTOMER_COMPANY_WISE_BILLING_LOCATION_MAPPING](
	[SNO] [int] IDENTITY(1,1) constraint pk_sno_cust_bl_loc primary key,
	[Customer_Id] [int] constraint fk_cust_id_bil foreign key references stomaster.tbl_customer_master(customer_id),
	[Company_id] [int] constraint fk_comp_id_bil foreign key references  stomaster.tbl_company_master(company_id),
	[Billing_Location_Id] [int] constraint fk_bill_loc_id_cust_bil foreign key references stomaster.tbl_billing_location_master(billing_location_id),
	[EFFECTIVE_FROM] [datetime] NULL,
	[EFFECTIVE_TO] [datetime] NULL,
	[REMARKS] [varchar](500) NULL,
	[STATUS_MASTER] [varchar](50) NULL,
	[CREATED_BY] [varchar](50) NULL,
	[CREATED_DATE] [datetime] NULL,
	[CREATED_MAC_ADDRESS] [varchar](50) NULL,
	[MODIFIED_BY] [varchar](50) NULL,
	[MODIFIED_DATE] [datetime] NULL,
	[MODIFIED_MAC_ADDRESS] [varchar](50) NULL,
)
go

CREATE TABLE [StoMaster].[TBL_CUSTOMER_PRODUCT_VAT_PERCENTAGE_SETTINGS](
	[SNO] [int] IDENTITY(1,1) constraint pk_sno_cust_prod_vat_perc primary key,
	[Company_id] [int] constraint fk_comp_id_cust_vat foreign key references  stomaster.tbl_company_master(company_id),
	[Customer_Id] [int] constraint fk_cust_id_addre_cust_vat foreign key references stomaster.tbl_customer_master(customer_id),
	[Main_Category_Id] [int]  constraint fk_main_cat_cust_vat foreign key references stomaster.tbl_product_main_category_master(main_category_id),
	[Sub_Category_Id] [int]  constraint fk_sub_cat_cust_vat foreign key references stomaster.tbl_product_sub_category_master(sub_category_id),
	[Product_Id] [int] constraint fk_prod_id_cust_vat foreign key references  stomaster.tbl_product_master(product_id),
	[VAT_PERCENTAGE] [decimal](10, 2) NULL,
	[EFFECTIVE_FROM] [datetime] NULL,
	[EFFECTIVE_TO] [datetime] NULL,
	[REQUEST_STATUS] [varchar](50) NULL,-- APPROVED/REJECTED
	[REMARKS] [varchar](100) NULL,
	[CREATED_BY] [varchar](50) NULL,
	[CREATED_DATE] [datetime] NULL,
	[CREATED_MAC_ADDRESS] [varchar](50) NULL,
	[MODIFIED_BY] [varchar](50) NULL,
	[MODIFIED_DATE] [datetime] NULL,
	[MODIFIED_MAC_ADDRESS] [varchar](50) NULL
)
GO
   
    
CREATE TABLE [StoMaster].[tbl_Customer_Wise_Product_Price_Settings](
	[Sno] [int] IDENTITY(1,1) constraint pk_sno_custo_price_mas primary key,
	[Company_id] [int] constraint fk_comp_id_cust_price foreign key references  stomaster.tbl_company_master(company_id),
	[Customer_Id] [int] constraint fk_cust_id_addre_price foreign key references stomaster.tbl_customer_master(customer_id),
	[Main_Category_Id] [int]  constraint fk_main_cat_id_cust_price foreign key references stomaster.tbl_product_main_category_master(main_category_id),
	[Sub_Category_Id] [int]  constraint fk_sub_cat_id_cust_price foreign key references stomaster.tbl_product_sub_category_master(sub_category_id),
	[Product_Id] [int] constraint fk_prod_id_cust_price foreign key references  stomaster.tbl_product_master(product_id),
	[VAT_Percentage] [decimal](15, 2) NULL,
	[Valid_Type] [varchar](50) NULL, -- permanent/ temperorl
	[currency_id] [int] constraint fk_curre_id_custprice foreign key references stomaster.tbl_currency_master(currency_id),
	[Effective_From] [datetime] NULL,
	[Effective_To] [datetime] NULL,
	[Requested_By] [varchar](50) NULL,
	[Requested_Date] [datetime] NULL,
	[Requested_Product_Amount] [decimal](15, 4) NULL,
	[Approved_Product_Amount] [decimal](15, 4) NULL,
	[Respond_By] [varchar](50) NULL,
	[Response_Status] [varchar](50) NULL,
	[REspond_Date] [datetime] NULL,
	[Respond_Mac_Address] [varchar](50) NULL,
	[Response_Remarks] [varchar](1000) NULL,
	[Accounts_Response_Person] [varchar](50) NULL,
	[Accounts_Response_Date] [datetime] NULL,
	[Accounts_Response_Status] [varchar](50) NULL,
	[Accounts_Response_Remarks] [varchar](500) NULL,
	[Remarks] [varchar](2000) NULL,
	[Status_Master] [varchar](20) NULL,
	[Created_By] [varchar](50) NULL,
	[Created_Date] [datetime] NULL,
	[Created_Mac_Address] [varchar](50) NULL,
	[Modified_By] [varchar](50) NULL,
	[Modified_Date] [datetime] NULL,
	[Modified_Mac_Address] [varchar](50) NULL,
	
	
)

go

CREATE TABLE [StoMaster].[tbl_Customer_Credit_Limit_Details](
	[Sno] [int] IDENTITY(1,1) constraint pk_sno_cust_cred primary key,
	[Company_id] [int] constraint fk_comp_id_credit_limit foreign key references  stomaster.tbl_company_master(company_id),
	[Customer_Id] [int] constraint fk_cust_id_credit_limit foreign key references stomaster.tbl_customer_master(customer_id),
	[Currency_id] [int] constraint fk_curre_id_cust_credit foreign key references stomaster.tbl_currency_master(currency_id),
	[Valid_Type] [varchar](50) NULL,
	[Requested_Credit_Limit_Days] [int] NULL,
	[Requested_Credit_Limit_Amount] [decimal](15, 2) NULL,
	[Requested_Payment_Mode_Id] [int]  constraint fk_cust_credit_limit_req_paym foreign key references [StoMaster].[TBL_CUSTOMER_PAYMENT_MODE_MASTER](payment_mode_id),
	[Requested_By] [varchar](50) NULL,
	[Requested_Date] [datetime] NULL,
	[Total_Outstanding_Amount] [decimal](15, 2) NULL,
	[Over_Due_Outstanding_Amount] [decimal](15, 2) NULL,
	[Approved_Credit_Limit_Days] [int] NULL,
	[Approved_Credit_Limit_Amount] [decimal](15, 2) NULL,
	[Approved_PAYMENT_MODE_ID] [int] constraint fk_cust_credit_limit_app_paym foreign key references [StoMaster].[TBL_CUSTOMER_PAYMENT_MODE_MASTER](payment_mode_id),
	[Effective_From] [datetime] NULL,
	[Effective_To] [datetime] NULL,
	[Finance_Head_1_Response_By] [varchar](50) NULL,
	[Finance_Head_1_Response_Date] [datetime] NULL,
	[Finance_Head_1_Response_Status] [varchar](50) NULL,
	[Finance_Head_1_Response_IP_Address] [varchar](50) NULL,
	[Finance_Head_1_Response_Remarks] [varchar](500) NULL,
	[Respond_by] [varchar](50) NULL,
	[Respond_Status] [varchar](50) NULL,
	[Respond_Date] [datetime] NULL,
	[Respond_Mac_address] [varchar](50) NULL,
	[Response_Remarks] [varchar](1000) NULL,
	[Remarks] [varchar](2000) NULL,
	[Status_Master] [varchar](20) NULL,
	[Created_By] [varchar](50) NULL,
	[Created_Date] [datetime] NULL,
	[Created_Mac_Address] [varchar](50) NULL,
	[Modified_By] [varchar](50) NULL,
	[Modified_Date] [datetime] NULL,
	[Modified_Mac_Address] [varchar](50) NULL,
	)

	go
	

CREATE TABLE [StoMaster].[CUSTOMER_CREDIT_LIMIT_FILE_UPLOAD](
	[SNO] [int] IDENTITY(1,1) constraint pk_sno_cust_credit_fild primary key,
	[CREDIT_LIMIT_ID] [int] constraint fk_credit_limit_id_file foreign key references [StoMaster].[tbl_Customer_Credit_Limit_Details](sno),
	[DESCRIPTION_DETAILS] [varchar](100) NULL,
	[FILE_NAME] [varchar](150) NULL,
	[CONTENT_TYPE] [varchar](50) NULL,
	[CONTENT_DATA] [varbinary](max) NULL,
	[STATUS_MASTER] [varchar](20) NULL,
	[CREATED_BY] [varchar](50) NULL,
	[CREATED_DATE] [datetime] NULL,
	[CREATED_MAC_ADDRESS] [varchar](50) NULL,
	[MODIFIED_BY] [varchar](50) NULL,
	[MODIFIED_DATE] [datetime] NULL,
	[MODIFIED_MAC_ADDRESS] [varchar](50) NULL,
	[Document_Type] [varchar](60) NULL,
 )
 go
CREATE TABLE [StoMaster].[TBL_ACCOUNTS_LEDGER_MASTER](
	[LEDGER_ID] [int] IDENTITY(1,1) constraint pk_acc_ledg_id primary key,
	[Company_id] [int] constraint fk_comp_id_acc_ledg foreign key references  stomaster.tbl_company_master(company_id),
	[LEDGER_TYPE] [varchar](50) NULL,
	[LEDGER_GROUP_ID] [int] NULL,
	[LEDGER_NAME] [varchar](100) NULL,
	[LEDGER_DESC] [varchar](100) NULL,
	[REMARKS] [varchar](100) NULL,
	[STATUS_MASTER] [varchar](20) NULL,
	[CREATED_BY] [varchar](50) NULL,
	[CREATED_DATE] [datetime] NULL,
	[CREATED_MAC_ADDRESS] [varchar](50) NULL,
	[MODIFIED_BY] [varchar](50) NULL,
	[MODIFIED_DATE] [datetime] NULL,
	[MODIFIED_MAC_ADDRESS] [varchar](50) NULL,
)

go
 

CREATE TABLE [StoMaster].[TBL_SALES_PERSON_MASTER](
	[Sales_Person_ID] [int] IDENTITY(1,1) constraint pk_sno_sales_person_mas primary key,
	[Emp_Id] [int] NULL,
	[PERSON_NAME] [varchar](50) NULL,
	Designation_Name varchar(50),
	[Sales_Contact_Person_Phone] [varchar](60) NULL,
	[Sales_Person_Email_Addres] [varchar](60) NULL,
	[Reporting_Manager_Card_No] [int] NULL,
	[Reporting_Manager_Name] [varchar](100) NULL,
	[Reporting_Manager_Email_Address] [varchar](100) NULL,
	[Sales_Person_Designation] [varchar](100) NULL,
	[REMARKS] [varchar](50) NULL,
	[STATUS_MASTER] [varchar](50) NULL,
	[CREATED_BY] [varchar](50) NULL,
	[CREATED_DATE] [datetime] NULL,
	[CREATED_MAC_ADDRESS] [varchar](50) NULL,
	[MODIFIED_BY] [varchar](50) NULL,
	[MODIFIED_DATE] [datetime] NULL,
	[MODIFIED_MAC_ADDRESS] [varchar](50) 
	)
	
-------------------- |MASTER TABLE ENDS

------------- TRANSACTION TABLES  STARTS

go

CREATE TABLE [STOENTRIES].[TBL_PURCHASE_ORDER_HDR](
[SNO] INT IDENTITY(1,1),
[PO_REF_NO] VARCHAR(50) CONSTRAINT PK_PO_REF_NO PRIMARY KEY,
[PO_DATE] DATETIME,
[PURCHASE_TYPE] VARCHAR(20),-- DOMESTIC/IMPORT
[COMPANY_ID] INT CONSTRAINT FK_COMP_ID_PO_HDR FOREIGN KEY REFERENCES [STOMASTER].[TBL_COMPANY_MASTER]([COMPANY_ID]),
[SUPPLIER_ID] INT CONSTRAINT FK_SUPP_ID FOREIGN KEY REFERENCES STOMASTER.TBL_SUPPLIER_MASTER(SUPPLIER_ID) ,
[PO_STORE_ID] INT CONSTRAINT FK_STORE_ID_PO_PO_HDR FOREIGN KEY REFERENCES [STOMASTER].[TBL_STORE_MASTER]([STORE_ID]),
[PAYMENT_TERM_ID] INT CONSTRAINT FK_PAYMENT_TERM_ID FOREIGN KEY REFERENCES STOMASTER.TBL_PAYMENT_TERM_MASTER(PAYMENT_TERM_ID), --
--[PRICE_FOR_CNF_FOB] VARCHAR(20),-- DROP DOWN CNF/FOB
[MODE_OF_PAYMENT] NVARCHAR(25),-- DROP DOWN  BANK/CASH
[CURRENCY_ID] INT CONSTRAINT FK_CURRENCY_ID_PO FOREIGN KEY REFERENCES STOMASTER.TBL_CURRENCY_MASTER(CURRENCY_ID),
[SUPLIER_PROFORMA_NUMBER] VARCHAR(100),-- TEXT
[SHIPMENT_MODE] VARCHAR(100),-- ROAD/SEA/FLIGHT
[PRICE_TERMS] VARCHAR(150),-- TEXT
[ESTIMATED_SHIPMENT_DATE] DATETIME,-- DATE TEXT
[SHIPMENT_REMARKS] VARCHAR(2500),-- TEXT
[PRODUCT_HDR_AMOUNT] DECIMAL(15,4),-- TOTAL FROM DTL TABLE 
[TOTAL_ADDITIONAL_COST_AMOUNT] DECIMAL(15,4),-- TOTAL FROM DTL TABLE 
[TOTAL_PRODUCT_HDR_AMOUNT] DECIMAL(15,4),-- TOTAL FROM DTL TABLE 
[TOTAL_VAT_HDR_AMOUNT] DECIMAL(15,2),-- TOTAL FROM DTL TABLE 
[FINAL_PURCHASE_HDR_AMOUNT] DECIMAL(15,2),-- TOTAL FROM DTL TABLE 
EXCHANGE_RATE DECIMAL(10,2),-- PICK FROM MASTER LAST ENTRY BY USING CURRENCY_ID
[PRODUCT_HDR_AMOUNT_LC] DECIMAL(15,4),-- [PRODUCT_HDR_AMOUNT_LC] * EXCHANGE RATE
[TOTAL_ADDITIONAL_COST_AMOUNT_LC] DECIMAL(15,4), -- [[TOTAL_ADDITIONAL_COST_AMOUNT]] * EXCHANGE RATE
[TOTAL_PRODUCT_HDR_AMOUNT_LC] DECIMAL(15,4),-- [[TOTAL_PRODUCT_HDR_AMOUNT]] * EXCHANGE RATE
[TOTAL_VAT_HDR_AMOUNT_LC] DECIMAL(15,2),-- [[TOTAL_VAT_HDR_AMOUNT]] * EXCHANGE RATE
[FINAL_PURCHASE_HDR_AMOUNT_LC] DECIMAL(15,2),-- [[FINAL_PURCHASE_HDR_AMOUNT]] * EXCHANGE RATE
SUBMITTED_BY VARCHAR(50),-- AUTO PICK FROM SESSION
SUBMITTED_DATE DATETIME,-- AUTO
SUBMITTED_IP_ADDRESS VARCHAR(50),-- CLIENT IP ADDRESS
[PURCHASE_HEAD_RESPONSE_PERSON] VARCHAR(50), -- NULL
[PURCHASE_HEAD_RESPONSE_DATE] DATETIME, -- NULL
[PURCHASE_HEAD_RESPONSE_STATUS] VARCHAR(50), -- NULL
[PURCHASE_HEAD_RESPONSE_REMARKS] VARCHAR(500), -- NULL
[PURCHASE_HEAD_RESPONSE_IP_ADDRESS] VARCHAR(50), -- NULL
[RESPONSE_1_PERSON] VARCHAR(50), -- NULL
[RESPONSE_1_DATE] DATETIME, -- NULL
[RESPONSE_1_STATUS] VARCHAR(50), -- NULL
[RESPONSE_1_REMARKS] VARCHAR(5000), -- NULL
[RESPONSE_1_IP_ADDRESS] VARCHAR(50), -- NULL
[RESPONSE_2_PERSON] VARCHAR(50), -- NULL
[RESPONSE_2_DATE] DATETIME, -- NULL
[RESPONSE_2_STATUS] VARCHAR(50), -- NULL
[RESPONSE_2_REMARKS] VARCHAR(5000), -- NULL
[RESPONSE_2_IP_ADDRESS] VARCHAR(50), -- NULL
[FINAL_RESPONSE_PERSON] VARCHAR(50), -- NULL
[FINAL_RESPONSE_DATE] DATETIME, -- NULL
[FINAL_RESPONSE_STATUS] VARCHAR(50), -- NULL
[FINAL_RESPONSE_REMARKS] VARCHAR(5000), -- NULL
[REMARKS] VARCHAR(2000), -- NULL
[STATUS_ENTRY] VARCHAR(20), -- AUTO -- CF(NOT SUBMITTED) CL( SUBMITTED) CA (CANCELLED)
[CREATED_BY] VARCHAR(50), -- AUTO PICK FROM SESSION
[CREATED_DATE] DATETIME, -- AUTO
[CREATED_IP_ADDRESS] VARCHAR(50), -- CLIENT IP ADDRESS
[MODIFIED_BY] VARCHAR(50), -- NULL -- LAST MODIFIED USER
[MODIFIED_DATE] DATETIME,-- LAST MODIFIED DDATE
[MODIFIED_IP_ADDRESS] VARCHAR(50),-- LAST MODIFIED IP ADDRESS
)
GO

CREATE TABLE [STOENTRIES].[TBL_PURCHASE_ORDER_DTL](
[SNO] INT IDENTITY(1,1) CONSTRAINT PK_SNO_PO_REF_DTL PRIMARY KEY,
[PO_REF_NO] VARCHAR(50) CONSTRAINT FK_PO_REF_NO_PO_DTL FOREIGN KEY REFERENCES [STOENTRIES].[TBL_PURCHASE_ORDER_HDR]([PO_REF_NO]),-- HIDDEN FROM HDR
[REQUEST_STORE_ID] INT CONSTRAINT FK_STORE_ID_TO_PO_REF_DTL FOREIGN KEY REFERENCES [STOMASTER].[TBL_STORE_MASTER]([STORE_ID]),-- DROP DOWN
[MAIN_CATEGORY_ID] INT CONSTRAINT FK_MAIN_CAT_PO_DTL FOREIGN KEY REFERENCES [STOMASTER].[TBL_PRODUCT_MAIN_CATEGORY_MASTER]([MAIN_CATEGORY_ID]),-- DROP DOWN
[SUB_CATEGORY_ID] INT CONSTRAINT FK_SUB_CAT_PO_DTL FOREIGN KEY REFERENCES [STOMASTER].[TBL_PRODUCT_SUB_CATEGORY_MASTER]([SUB_CATEGORY_ID]),-- DROP DOWN
[PRODUCT_ID] INT CONSTRAINT FK_PRODU_CAT_PO_DTL FOREIGN KEY REFERENCES [STOMASTER].[TBL_PRODUCT_MASTER]([PRODUCT_ID]),-- DROP DOWN WITH NAME SEARCH WITH FILTER NEEDED
[QTY_PER_PACKING] DECIMAL(15,2),-- LABEL PICK FROM [STOMASTER].[TBL_PRODUCT_MASTER]-- SELECTED PRODUCT
[TOTAL_QTY] DECIMAL(15,4),-- TEXT --
[UOM] VARCHAR(50),-- LABEL PICK FROM [STOMASTER].[TBL_PRODUCT_MASTER]-- SELECTED PRODUCT
[TOTAL_PACKING] DECIMAL(15,4),--TEXT  FORMULAE =  [TOTAL_QTY]*[QTY_PER_PACKING]
[ALTERNATE_UOM] VARCHAR(500),-- -- LABEL PICK FROM [STOMASTER].[TBL_PRODUCT_MASTER]-- SELECTED PRODUCT
[RATE_PER_QTY] DECIMAL(15,6),-- TEXT
[PRODUCT_AMOUNT] DECIMAL(15,4),-- FORUMALE =  TOTAL_QTY X RATE_PER_QTY
[DISCOUNT_PERCENTAGE] DECIMAL(15,2),-- TEXT
[DISCOUNT_AMOUNT] DECIMAL(15,4),-- TEXT WITH FORMULAE =  PRODUCT_AMOUNT*DISCOUNT_PERCENTAGE/100
[TOTAL_PRODUCT_AMOUNT] DECIMAL(15,4),-- FORMAULE =  PRODUCT_AMOUNT - DISCOUNT_AMOUNT
[VAT_PERCENTAGE] DECIMAL(15,2),-- FORMAULE WRITE USER DEFINED FUNCTION GET VAT %
[VAT_AMOUNT] DECIMAL(15,4), -- FORMAULE [TOTAL_PRODUCT_AMOUNT] X [VAT_PERCENTAGE]/100
[FINAL_PRODUCT_AMOUNT] DECIMAL(15,4),-- FORMAULE =  [TOTAL_PRODUCT_AMOUNT] + [VAT_AMOUNT]
[TOTAL_PRODUCT_AMOUNT_LC] DECIMAL(15,4),-- FORMULAE = [TOTAL_PRODUCT_AMOUNT]*EXCHANGE RATE
[FINAL_PRODUCT_AMOUNT_LC] DECIMAL(15,4), -- [FINAL_PRODUCT_AMOUNT] X EXCHANGE RATE
[REMARKS] VARCHAR(2000), -- NULL
[STATUS_ENTRY] VARCHAR(20), -- AUTO -- CF(NOT SUBMITTED) CL( SUBMITTED) CA (CANCELLED)
[CREATED_BY] VARCHAR(50), -- AUTO PICK FROM SESSION
[CREATED_DATE] DATETIME, -- AUTO
[CREATED_IP_ADDRESS] VARCHAR(50), -- CLIENT IP ADDRESS
[MODIFIED_BY] VARCHAR(50), -- NULL -- LAST MODIFIED USER
[MODIFIED_DATE] DATETIME,-- LAST MODIFIED DDATE
[MODIFIED_IP_ADDRESS] VARCHAR(50),-- LAST MODIFIED IP ADDRESS
);

GO

CREATE TABLE [STOENTRIES].[TBL_PURCHASE_ORDER_ADDITIONAL_COST_DETAILS](
[SNO] INT IDENTITY(1,1) CONSTRAINT PK_SNO_PUR_ADD_COST PRIMARY KEY,
[PO_REF_NO] VARCHAR(50) CONSTRAINT FK_PO_REF_NO_ADD_COST FOREIGN KEY REFERENCES [STOENTRIES].[TBL_PURCHASE_ORDER_HDR]([PO_REF_NO]),
[ADDITIONAL_COST_TYPE_ID] INT CONSTRAINT FK_PO_ADDI_COST_TYPE FOREIGN KEY REFERENCES STOMASTER.TBL_ADDITIONAL_COST_TYPE_MASTER([ADDITIONAL_COST_TYPE_ID]),
[ADDITIONAL_COST_AMOUNT] DECIMAL(15,4),
[REMARKS] VARCHAR(1000),
[STATUS_MASTER] VARCHAR(50),
[CREATED_BY] VARCHAR(50),
[CREATED_DATE] DATETIME,
[CREATED_IP_ADDRESS] VARCHAR(50),
[MODIFIED_BY] VARCHAR(50),
[MODIFIED_DATE] DATETIME,
[MODIFIED_IP_ADDRESS] VARCHAR(50)
);
GO

CREATE TABLE [STOENTRIES].[TBL_PURCHASE_ORDER_FILES_UPLOAD](
[SNO] INT IDENTITY(1,1) CONSTRAINT PK_PO_UPLOAD_SNO PRIMARY KEY,
[PO_REF_NO] VARCHAR(50) CONSTRAINT FK_UPLOAD_PO_REF_NO FOREIGN KEY REFERENCES [STOENTRIES].[TBL_PURCHASE_ORDER_HDR]([PO_REF_NO]),
DOCUMENT_TYPE VARCHAR(50),-- DROP DOWN PROFORMA/
[DESCRIPTION_DETAILS] VARCHAR(100), -- TEXT
[FILE_NAME] VARCHAR(150), -- AUTO FROM UPLOAD ATTACHED FILE
[CONTENT_TYPE] VARCHAR(50), -- AUTO FROM UPLOAD ATTACHED FILE
[CONTENT_DATA] VARBINARY(MAX), -- AUTO FROM UPLOAD ATTACHED FILE
[REMARKS] VARCHAR(1000),-- TEXT
[STATUS_MASTER] VARCHAR(20),--
[CREATED_BY] VARCHAR(50),
[CREATED_DATE] DATETIME,
[CREATED_IP_ADDRESS] VARCHAR(50),
[MODIFIED_BY] VARCHAR(50),
[MODIFIED_DATE] DATETIME,
[MODIFIED_IP_ADDRESS] VARCHAR(50) 
);

GO
--SELECT * FROM [STOENTRIES].[TBL_PURCHASE_ORDER_CONVERSATION_DTL]

CREATE TABLE [STOENTRIES].[TBL_PURCHASE_ORDER_CONVERSATION_DTL](
[SNO] INT IDENTITY(1,1) CONSTRAINT PK_SNO_PO_CONVERSATION PRIMARY KEY,
[PO_REF_NO] VARCHAR(50) CONSTRAINT FK_PO_REF_NO_CONV FOREIGN KEY REFERENCES [STOENTRIES].[TBL_PURCHASE_ORDER_HDR]([PO_REF_NO]),
[RESPOND_PERSON] VARCHAR(50), -- USER FROM SESSION
[DISCUSSION_DETAILS] VARCHAR(MAX),-- TEXT
[RESPONSE_STATUS] VARCHAR(50),-- DONT PASS ANY VALUE
[STATUS_ENTRY] VARCHAR(50),
[REMARKS] VARCHAR(50),
[CREATED_BY] VARCHAR(50),
[CREATED_DATE] DATETIME,
[CREATED_IP_ADDRESS] VARCHAR(50),
[MODIFIED_BY] VARCHAR(50),
[MODIFIED_DATE] DATETIME,
[MODIFIED_IP_ADDRESS] VARCHAR(50)
);

GO


CREATE TABLE STOENTRIES.TBL_GOODS_INWARD_GRN_HDR(
	SNO INT IDENTITY(1,1) ,
	GRN_REF_NO VARCHAR(50)  CONSTRAINT PK_GRN_REF_NO PRIMARY KEY,
	GRN_DATE DATETIME ,-- TEXT
	COMPANY_ID INT CONSTRAINT FK_GRN_COMPANY_ID FOREIGN KEY REFERENCES STOMASTER.TBL_COMPANY_MASTER (COMPANY_ID),
	SOURCE_STORE_ID INT  CONSTRAINT FK_GRN_SOURCE_STORE_ID FOREIGN KEY REFERENCES STOMASTER.TBL_STORE_MASTER (STORE_ID),
	GRN_STORE_ID INT CONSTRAINT FK_GRN_STORE_ID FOREIGN KEY REFERENCES STOMASTER.TBL_STORE_MASTER (STORE_ID) ,
	GRN_SOURCE VARCHAR(50) , -- DOMESTIC / IMPORT / STOCK TRANSFER
	DELIVERY_NOTE_REF_NO VARCHAR(50) , -- IF STOCK TRANSFER LOAD DELIVERY NOTE REF NO BY USING SOURCE STORE ID DELIVERY REF NO
	SUPPLIER_ID INT  CONSTRAINT FK_GRN_SUPPLIER_ID FOREIGN KEY REFERENCES STOMASTER.TBL_SUPPLIER_MASTER (SUPPLIER_ID) ,
	PO_REF_NO VARCHAR(50) CONSTRAINT FK_PO_REF_NO_GRN FOREIGN KEY REFERENCES STOENTRIES.TBL_PURCHASE_ORDER_HDR(PO_REF_NO) , --
	PURCHASE_INVOICE_REF_NO VARCHAR(50) ,--CONSTRAINT FK_PI_PO_GRN FOREIGN KEY REFERENCES STOENTRIES.TBL_PURCHASE_INVOICE_HDR(PURCHASE_INVOICE_REF_NO),-- NOT MANDATORY BECASUSE FOR LOCAL PURCHASE INVOICE WILL COME BEFORE GRN
	SUPPLIER_INVOICE_NUMBER VARCHAR(100) ,-- TEXT GET FROM PURCHASE INVOICE
	CONTAINER_NO VARCHAR(20) ,-- TEXT
	DRIVER_NAME VARCHAR(50) ,-- TEXT
	DRIVER_CONTACT_NUMBER VARCHAR(50) ,-- TEXT
	VEHICLE_NO VARCHAR(50) ,-- TEXT
	SEAL_NO VARCHAR(50) ,--- TEXT
	REMARKS VARCHAR(2000) ,-- TEXT
	STATUS_ENTRY VARCHAR(20) , -- CF/CL/CA -- AUTO
	CREATED_BY VARCHAR(50) ,
	CREATED_DATE DATETIME ,
	CREATED_IP_ADDRESS VARCHAR(50) ,
	MODIFIED_BY VARCHAR(50) ,
	MODIFIED_DATE DATETIME ,
	MODIFIED_IP_ADDRESS VARCHAR(50) ,
	)
	GO
	
CREATE TABLE STOENTRIES.TBL_GOODS_INWARD_GRN_DTL(
		SNO INT IDENTITY(1,1)  CONSTRAINT FK_GRN_SNO PRIMARY KEY ,
		GRN_REF_NO VARCHAR(50)   CONSTRAINT FK_GRN_REF_NO FOREIGN KEY REFERENCES STOENTRIES.TBL_GOODS_INWARD_GRN_HDR (GRN_REF_NO) ,
		[PO_DTL_SNO] INT CONSTRAINT FK_PO_DTL_SNO_GRN_DTL FOREIGN KEY REFERENCES [STOENTRIES].[TBL_PURCHASE_ORDER_DTL]([SNO]),
		MAIN_CATEGORY_ID INT CONSTRAINT FK_GRN_MAIN_ID FOREIGN KEY REFERENCES STOMASTER.TBL_PRODUCT_MAIN_CATEGORY_MASTER (MAIN_CATEGORY_ID) ,-- IF PO TYPE DOMESTIC/IMPORT -- DATA PICK FROM PO DTL USING SELECTED SNO
		SUB_CATEGORY_ID INT CONSTRAINT FK_GRN_SUB_ID FOREIGN KEY REFERENCES STOMASTER.TBL_PRODUCT_SUB_CATEGORY_MASTER (SUB_CATEGORY_ID) ,-- IF PO TYPE DOMESTIC/IMPORT -- DATA PICK FROM PO DTL USING SELECTED SNO
		PRODUCT_ID INT  CONSTRAINT FK_GRN_PRODUCT_ID FOREIGN KEY REFERENCES STOMASTER.TBL_PRODUCT_MASTER (PRODUCT_ID),-- IF PO TYPE DOMESTIC/IMPORT -- DATA PICK FROM PO DTL USING SELECTED SNO
		[QTY_PER_PACKING] DECIMAL(15,2),-- LABEL PICK FROM [STOMASTER].[TBL_PRODUCT_MASTER]-- SELECTED PRODUCT
		[TOTAL_QTY] DECIMAL(15,4),-- TEXT --
		[UOM] VARCHAR(50),-- LABEL PICK FROM [STOMASTER].[TBL_PRODUCT_MASTER]-- SELECTED PRODUCT
		[TOTAL_PACKING] DECIMAL(15,4),--TEXT  FORMULAE =  [TOTAL_QTY]*[QTY_PER_PACKING]
		[ALTERNATE_UOM] VARCHAR(500),-- -- LABEL PICK FROM [STOMASTER].[TBL_PRODUCT_MASTER]-- SELECTED PRODUCT
		REMARKS VARCHAR(2000) ,
		STATUS_ENTRY VARCHAR(20) ,
		CREATED_BY VARCHAR(50) ,
		CREATED_DATE DATETIME ,
		CREATED_IP_ADDRESS VARCHAR(50) ,
		MODIFIED_BY VARCHAR(50) ,
		MODIFIED_DATE DATETIME ,
		MODIFIED_IP_ADDRESS VARCHAR(50) 
	)
	GO
	


CREATE TABLE [STOENTRIES].[TBL_PURCHASE_INVOICE_HDR](
[SNO] INT IDENTITY(1,1),
[PURCHASE_INVOICE_REF_NO] VARCHAR(50) CONSTRAINT PK_PI_INV_REF_NO PRIMARY KEY,
[COMPANY_ID] INT CONSTRAINT FK_COMP_ID_PI_HDR FOREIGN KEY REFERENCES [STOMASTER].[TBL_COMPANY_MASTER]([COMPANY_ID]),
[INVOICE_NO] VARCHAR(100),
[INVOICE_DATE] DATETIME,
[PO_REF_NO] VARCHAR(50) CONSTRAINT FK_PO_INV_REF_PI_HDR FOREIGN KEY REFERENCES [STOENTRIES].[TBL_PURCHASE_ORDER_HDR]([PO_REF_NO]),
[PURCHASE_TYPE] VARCHAR(20),-- DOMESTIC/IMPORT
[SUPPLIER_ID] INT CONSTRAINT FK_SUPP_ID_INV FOREIGN KEY REFERENCES STOMASTER.TBL_SUPPLIER_MASTER(SUPPLIER_ID) ,
[STORE_ID] INT CONSTRAINT FK_STORE_ID_PO_PI_HDR FOREIGN KEY REFERENCES [STOMASTER].[TBL_STORE_MASTER]([STORE_ID]),
[PAYMENT_TERM_ID] INT CONSTRAINT FK_PAYMENT_TERM_ID_PI FOREIGN KEY REFERENCES STOMASTER.TBL_PAYMENT_TERM_MASTER(PAYMENT_TERM_ID), --
--[PRICE_FOR_CNF_FOB] VARCHAR(20),-- DROP DOWN CNF/FOB
[MODE_OF_PAYMENT] NVARCHAR(25),-- DROP DOWN  BANK/CASH
[CURRENCY_ID] INT CONSTRAINT FK_CURRENCY_ID_PI FOREIGN KEY REFERENCES STOMASTER.TBL_CURRENCY_MASTER(CURRENCY_ID),
[PRICE_TERMS] VARCHAR(150),-- TEXT
[PRODUCT_HDR_AMOUNT] DECIMAL(15,4),-- TOTAL FROM DTL TABLE 
[TOTAL_ADDITIONAL_COST_AMOUNT] DECIMAL(15,4),-- TOTAL FROM DTL TABLE 
[TOTAL_PRODUCT_HDR_AMOUNT] DECIMAL(15,4),-- TOTAL FROM DTL TABLE 
[TOTAL_VAT_HDR_AMOUNT] DECIMAL(15,2),-- TOTAL FROM DTL TABLE 
[FINAL_INVOICE_HDR_AMOUNT] DECIMAL(15,2),-- TOTAL FROM DTL TABLE 
EXCHANGE_RATE DECIMAL(10,2),-- PICK FROM MASTER LAST ENTRY BY USING CURRENCY_ID
[PRODUCT_HDR_AMOUNT_LC] DECIMAL(15,4),-- [PRODUCT_HDR_AMOUNT_LC] * EXCHANGE RATE
[TOTAL_ADDITIONAL_COST_AMOUNT_LC] DECIMAL(15,4), -- [[TOTAL_ADDITIONAL_COST_AMOUNT]] * EXCHANGE RATE
[TOTAL_PRODUCT_HDR_AMOUNT_LC] DECIMAL(15,4),-- [[TOTAL_PRODUCT_HDR_AMOUNT]] * EXCHANGE RATE
[TOTAL_VAT_HDR_AMOUNT_LC] DECIMAL(15,2),-- [[TOTAL_VAT_HDR_AMOUNT]] * EXCHANGE RATE
[FINAL_PURCHASE_INVOICE_AMOUNT_LC] DECIMAL(15,2),-- [[FINAL_PURCHASE_HDR_AMOUNT]] * EXCHANGE RATE
SUBMITTED_BY VARCHAR(50),-- AUTO PICK FROM SESSION
SUBMITTED_DATE DATETIME,-- AUTO
SUBMITTED_IP_ADDRESS VARCHAR(50),-- CLIENT IP ADDRESS
[RESPONSE_1_PERSON] VARCHAR(50), -- NULL
[RESPONSE_1_DATE] DATETIME, -- NULL
[RESPONSE_1_STATUS] VARCHAR(50), -- NULL
[RESPONSE_1_REMARKS] VARCHAR(5000), -- NULL
[RESPONSE_1_IP_ADDRESS] VARCHAR(50), -- NULL
[RESPONSE_2_PERSON] VARCHAR(50), -- NULL
[RESPONSE_2_DATE] DATETIME, -- NULL
[RESPONSE_2_STATUS] VARCHAR(50), -- NULL
[RESPONSE_2_REMARKS] VARCHAR(5000), -- NULL
[RESPONSE_2_IP_ADDRESS] VARCHAR(50), -- NULL
[FINAL_RESPONSE_PERSON] VARCHAR(50), -- NULL
[FINAL_RESPONSE_DATE] DATETIME, -- NULL
[FINAL_RESPONSE_STATUS] VARCHAR(50), -- NULL
[FINAL_RESPONSE_REMARKS] VARCHAR(5000), -- NULL
[REMARKS] VARCHAR(2000), -- NULL
[STATUS_ENTRY] VARCHAR(20), -- AUTO -- CF(NOT SUBMITTED) CL( SUBMITTED) CA (CANCELLED)
[CREATED_BY] VARCHAR(50), -- AUTO PICK FROM SESSION
[CREATED_DATE] DATETIME, -- AUTO
[CREATED_IP_ADDRESS] VARCHAR(50), -- CLIENT IP ADDRESS
[MODIFIED_BY] VARCHAR(50), -- NULL -- LAST MODIFIED USER
[MODIFIED_DATE] DATETIME,-- LAST MODIFIED DDATE
[MODIFIED_IP_ADDRESS] VARCHAR(50),-- LAST MODIFIED IP ADDRESS
)
GO

CREATE TABLE [STOENTRIES].[TBL_PURCHASE_INVOICE_DTL](
[SNO] INT IDENTITY(1,1) CONSTRAINT PK_SNO_PO_PI_REF_DTL PRIMARY KEY,
[PURCHASE_INVOICE_REF_NO] VARCHAR(50) CONSTRAINT FK_PO_REF_NO_PO_PI_DTL FOREIGN KEY REFERENCES [STOENTRIES].[TBL_PURCHASE_ORDER_HDR]([PO_REF_NO]),-- HIDDEN FROM HDR
GRN_REF_NO VARCHAR(50) CONSTRAINT FK_GRN_REF_NO_PU_INV FOREIGN KEY REFERENCES STOENTRIES.TBL_GOODS_INWARD_GRN_HDR(GRN_REF_NO),-- DROP DOWN LOAD GRN BASED HDR PO REF NUMBER

----- GET DETAILS FROM GRN STARTS
[MAIN_CATEGORY_ID] INT CONSTRAINT FK_MAIN_CAT_PO_PI_DTL FOREIGN KEY REFERENCES [STOMASTER].[TBL_PRODUCT_MAIN_CATEGORY_MASTER]([MAIN_CATEGORY_ID]),-- DROP DOWN
[SUB_CATEGORY_ID] INT CONSTRAINT FK_SUB_CAT_PO_PI_DTL FOREIGN KEY REFERENCES [STOMASTER].[TBL_PRODUCT_SUB_CATEGORY_MASTER]([SUB_CATEGORY_ID]),-- DROP DOWN
[PRODUCT_ID] INT CONSTRAINT FK_PRODU_CAT_PO_PI_DTL FOREIGN KEY REFERENCES [STOMASTER].[TBL_PRODUCT_MASTER]([PRODUCT_ID]),-- DROP DOWN WITH NAME SEARCH WITH FILTER NEEDED
[QTY_PER_PACKING] DECIMAL(15,2),-- LABEL PICK FROM [STOMASTER].[TBL_PRODUCT_MASTER]-- SELECTED PRODUCT
[TOTAL_QTY] DECIMAL(15,4),-- TEXT --
[UOM] VARCHAR(50),-- LABEL PICK FROM [STOMASTER].[TBL_PRODUCT_MASTER]-- SELECTED PRODUCT
[TOTAL_PACKING] DECIMAL(15,4),--TEXT  FORMULAE =  [TOTAL_QTY]*[QTY_PER_PACKING]
[ALTERNATE_UOM] VARCHAR(500),-- -- LABEL PICK FROM [STOMASTER].[TBL_PRODUCT_MASTER]-- SELECTED PRODUCT
----- GET DETAILS FROM GRN STARTS

[RATE_PER_QTY] DECIMAL(15,6),-- TEXT --GET GET RATE FROM PURCHASE ORDER
[PRODUCT_AMOUNT] DECIMAL(15,4),-- FORUMALE =  TOTAL_QTY X RATE_PER_QTY
[DISCOUNT_PERCENTAGE] DECIMAL(15,2),-- TEXT
[DISCOUNT_AMOUNT] DECIMAL(15,4),-- TEXT WITH FORMULAE =  PRODUCT_AMOUNT*DISCOUNT_PERCENTAGE/100
[TOTAL_PRODUCT_AMOUNT] DECIMAL(15,4),-- FORMAULE =  PRODUCT_AMOUNT - DISCOUNT_AMOUNT
[VAT_PERCENTAGE] DECIMAL(15,2),-- FORMAULE WRITE USER DEFINED FUNCTION GET VAT %
[VAT_AMOUNT] DECIMAL(15,4), -- FORMAULE [TOTAL_PRODUCT_AMOUNT] X [VAT_PERCENTAGE]/100
[FINAL_PRODUCT_AMOUNT] DECIMAL(15,4),-- FORMAULE =  [TOTAL_PRODUCT_AMOUNT] + [VAT_AMOUNT]
[TOTAL_PRODUCT_AMOUNT_LC] DECIMAL(15,4),-- FORMULAE = [TOTAL_PRODUCT_AMOUNT]*EXCHANGE RATE
[FINAL_PRODUCT_AMOUNT_LC] DECIMAL(15,4), -- [FINAL_PRODUCT_AMOUNT] X EXCHANGE RATE
[REMARKS] VARCHAR(2000), -- NULL
[STATUS_ENTRY] VARCHAR(20), -- AUTO -- CF(NOT SUBMITTED) CL( SUBMITTED) CA (CANCELLED)
[CREATED_BY] VARCHAR(50), -- AUTO PICK FROM SESSION
[CREATED_DATE] DATETIME, -- AUTO
[CREATED_IP_ADDRESS] VARCHAR(50), -- CLIENT IP ADDRESS
[MODIFIED_BY] VARCHAR(50), -- NULL -- LAST MODIFIED USER
[MODIFIED_DATE] DATETIME,-- LAST MODIFIED DDATE
[MODIFIED_IP_ADDRESS] VARCHAR(50),-- LAST MODIFIED IP ADDRESS
);

GO

CREATE TABLE [STOENTRIES].[TBL_PURCHASE_INVOICE_ADDITIONAL_COST_DETAILS](
[SNO] INT IDENTITY(1,1) CONSTRAINT PK_SNO_PUR_PI_ADD_COST PRIMARY KEY,
[PURCHASE_INVOICE_NO] VARCHAR(50) CONSTRAINT FK_PI_REF_NO_ADD_COST FOREIGN KEY REFERENCES [STOENTRIES].[TBL_PURCHASE_ORDER_HDR]([PO_REF_NO]),
[ADDITIONAL_COST_TYPE_ID] INT CONSTRAINT FK_PI_ADDI_COST_TYPE FOREIGN KEY REFERENCES STOMASTER.TBL_ADDITIONAL_COST_TYPE_MASTER([ADDITIONAL_COST_TYPE_ID]),
[ADDITIONAL_COST_AMOUNT] DECIMAL(15,4),
[REMARKS] VARCHAR(1000),
[STATUS_MASTER] VARCHAR(50),
[CREATED_BY] VARCHAR(50),
[CREATED_DATE] DATETIME,
[CREATED_IP_ADDRESS] VARCHAR(50),
[MODIFIED_BY] VARCHAR(50),
[MODIFIED_DATE] DATETIME,
[MODIFIED_IP_ADDRESS] VARCHAR(50)
);
GO


CREATE TABLE [STOENTRIES].[TBL_PURCHASE_INVOICE_FILES_UPLOAD](
[SNO] INT IDENTITY(1,1) CONSTRAINT PK_PO_UPLOAD_SNO_PI PRIMARY KEY,
[PURCHASE_INVOICE_REF_NO] VARCHAR(50) CONSTRAINT FK_UPLOAD_PO_REF_NO_PI FOREIGN KEY REFERENCES [STOENTRIES].[TBL_PURCHASE_ORDER_HDR]([PO_REF_NO]),
DOCUMENT_TYPE VARCHAR(50),-- DROP DOWN PROFORMA/ LEDGER
[DESCRIPTION_DETAILS] VARCHAR(100), -- TEXT
[FILE_NAME] VARCHAR(150), -- AUTO FROM UPLOAD ATTACHED FILE
[CONTENT_TYPE] VARCHAR(50), -- AUTO FROM UPLOAD ATTACHED FILE
[CONTENT_DATA] VARBINARY(MAX), -- AUTO FROM UPLOAD ATTACHED FILE
[REMARKS] VARCHAR(1000),-- TEXT
[STATUS_MASTER] VARCHAR(20),--
[CREATED_BY] VARCHAR(50),
[CREATED_DATE] DATETIME,
[CREATED_IP_ADDRESS] VARCHAR(50),
[MODIFIED_BY] VARCHAR(50),
[MODIFIED_DATE] DATETIME,
[MODIFIED_IP_ADDRESS] VARCHAR(50) 
);

GO

CREATE TABLE [STOENTRIES].[TBL_EXPENSE_HDR](
[SNO] INT IDENTITY(1,1) ,
[EXPENSE_REF_NO] VARCHAR(50) CONSTRAINT PK_EXP_HDR PRIMARY KEY,
[EXPENSE_DATE] DATETIME,
COMPANY_ID INT CONSTRAINT FK_COMP_ID_EXP_HDR FOREIGN KEY REFERENCES STOMASTER.TBL_COMPANY_MASTER(COMPANY_ID),
EXPENSE_AGAINST VARCHAR(50),-- PO/COMMMON
[PO_REF_NO] VARCHAR(50) CONSTRAINT FK_PO_REF_NO_EXP_HDR FOREIGN KEY REFERENCES [STOENTRIES].[TBL_PURCHASE_ORDER_HDR]([PO_REF_NO]),-- IF ITS COMMON LOAD PO NO
[ACCOUNT_HEAD_ID] INT CONSTRAINT FK_ACCOUNT_HEAD_EXP_HDR FOREIGN KEY REFERENCES [STOMASTER].[TBL_ACCOUNTS_HEAD_MASTER]([ACCOUNT_HEAD_ID]),-- DROP DOWN
EXPENSE_SUPPLIER_ID INT CONSTRAINT FK_SUPP_ID_EXPENS_SUPP FOREIGN KEY REFERENCES STOMASTER.TBL_SUPPLIER_MASTER(SUPPLIER_ID),-- 
[EXPENSE_TYPE] VARCHAR(100),-- DROP DOWN ---FIELD MASTER
[TRA_EFD_RECEIPT_NO] VARCHAR(100),-- TEXT
CURRENCY_ID INT CONSTRAINT FK_CURR_ID_EXPENSE_HDR FOREIGN KEY REFERENCES STOMASTER.TBL_CURRENCY_MASTER(CURRENCY_ID),
EXCHANGE_RATE DECIMAL(15,2),
[TOTAL_EXPENSE_AMOUNT] DECIMAL(18,2),-- LABEL GET TOTAL OF DTL AMOUNT
[TOTAL_EXPENSE_AMOUNT_LC] DECIMAL(18,2),-- HIDDEN --  [TOTAL_EXPENSE_AMOUNT] X EXCHANGE RATE
[REMARKS] VARCHAR(2000),
[STATUS_ENTRY] VARCHAR(20),
[CREATED_BY] VARCHAR(50),
[CREATED_DATE] DATETIME,
[CREATED_IP_ADDRESS] VARCHAR(50),
[MODIFIED_BY] VARCHAR(50),
[MODIFIED_DATE] DATETIME,
[MODIFIED_IP_ADDRESS] VARCHAR(50),
[SUBMITTED_BY] VARCHAR(50),
[SUBMITTED_DATE] DATETIME,
[SUBMITTED_IP_ADDRESS] VARCHAR(50)

);

GO

CREATE TABLE [STOENTRIES].[TBL_EXPENSE_DTL](
[SNO] INT IDENTITY(1,1) CONSTRAINT PK_PO_EXP_DTL PRIMARY KEY,
[EXPENSE_REF_NO] VARCHAR(50) CONSTRAINT FK_EXP_REF_NO_EXP_DTL FOREIGN KEY REFERENCES [STOENTRIES].[TBL_EXPENSE_HDR]([EXPENSE_REF_NO]),
[PO_REF_NO] VARCHAR(50) CONSTRAINT FK_PO_REF_NO_EXP_DTL FOREIGN KEY REFERENCES [STOENTRIES].[TBL_PURCHASE_ORDER_HDR]([PO_REF_NO]),-- DROP DOWN
[PO_DTL_SNO] INT CONSTRAINT FK_PO_DTL_SNO_EXP_DTL FOREIGN KEY REFERENCES [STOENTRIES].[TBL_PURCHASE_ORDER_DTL]([SNO]),-- LOAD PO DTL AS PER HDR PO
[PRODUCT_ID] INT CONSTRAINT FK_PRODUCT_EXP_DTL FOREIGN KEY REFERENCES [STOMASTER].[TBL_PRODUCT_MASTER]([PRODUCT_ID]),-- DROP DOWN-- AUTO SELECTED PO DTL
[EXPENSE_AMOUNT] DECIMAL(18,2),-- TEXT
[EXPENSE_AMOUNT_LC] DECIMAL(18,2),-- BACKEND -- FORMULAE [EXPENSE_AMOUNT] X HDR EXCHANGE RATE
[REMARKS] VARCHAR(2000),
[STATUS_ENTRY] VARCHAR(20),
[CREATED_BY] VARCHAR(50),
[CREATED_DATE] DATETIME,
[CREATED_IP_ADDRESS] VARCHAR(50),
[MODIFIED_BY] VARCHAR(50),
[MODIFIED_DATE] DATETIME,
[MODIFIED_IP_ADDRESS] VARCHAR(50)
);

--- PROCESSING

GO

CREATE TABLE STOENTRIES.TBL_SALES_ORDER_HDR(
	SNO INT IDENTITY(1,1)  ,
	SALES_ORDER_REF_NO VARCHAR(50) CONSTRAINT PK_SALES_ORDER_REF_NO PRIMARY KEY ,
	SALES_ORDER_DATE DATETIME ,
	COMPANY_ID INT CONSTRAINT FK_SALES_ORDER_COMPANY_ID FOREIGN KEY REFERENCES STOMASTER.TBL_COMPANY_MASTER (COMPANY_ID),-- DROP DOWN
	STORE_ID INT CONSTRAINT FK_SALES_ORDER_STORE_ID FOREIGN KEY REFERENCES STOMASTER.TBL_STORE_MASTER (STORE_ID),-- DROP DOWN
	CUSTOMER_ID INT CONSTRAINT FK_SALES_ORDER_CUSTOMER_ID FOREIGN KEY REFERENCES STOMASTER.TBL_CUSTOMER_MASTER (CUSTOMER_ID) ,-- DROP DOWN
	BILLING_LOCATION_ID INT CONSTRAINT FK_SALES_ORDER_BILLING_LOCATION_ID FOREIGN KEY REFERENCES STOMASTER.TBL_BILLING_LOCATION_MASTER(BILLING_LOCATION_ID),-- DROP DOWNN PIACK 
	SALES_PERSON_EMP_ID INT CONSTRAINT FK_SALES_PERSON_SAO FOREIGN KEY REFERENCES STOMASTER.TBL_SALES_PERSON_MASTER(SALES_PERSON_ID), -- DROP DOWN
	CREDIT_LIMIT_AMOUNT DECIMAL(15, 2) ,-- LABEL PICK FROM CREDIT LIMIT BASED ON CUSTOMER AND COMPANY
	CREDIT_LIMIT_DAYS DECIMAL(15, 2) ,-- LABEL PICK FROM CREDIT LIMIT BASED ON CUSTOMER AND COMPANY
	OUTSTANDING_AMOUNT DECIMAL(15, 2) ,-- LABEL PICK FROM CREDIT LIMIT BASED ON CUSTOMER AND COMPANY
	CURRENCY_ID INT CONSTRAINT FK_CURRENCY_ID_DEL FOREIGN KEY REFERENCES STOMASTER.TBL_CURRENCY_MASTER(CURRENCY_ID),-- DROPDOWN
	EXCHANGE_RATE DECIMAL(15,2),-- PICK FROM MASTER BY USING CURRENCY LAST ENTRY
	[TOTAL_PRODUCT_AMOUNT] DECIMAL(15,4),-- FORMAULE =  [TOTAL_QTY] X [SALES_RATE_PER_QTY]
	[VAT_AMOUNT] DECIMAL(15,4), -- FORMAULE [TOTAL_PRODUCT_AMOUNT] X [VAT_PERCENTAGE]/100
	[FINAL_SALES_AMOUNT] DECIMAL(15,4),-- FORMAULE =  [TOTAL_PRODUCT_AMOUNT] + [VAT_AMOUNT]
	[TOTAL_PRODUCT_AMOUNT_LC] DECIMAL(15,4),-- FORMULAE = [TOTAL_PRODUCT_AMOUNT]*EXCHANGE RATE  -- JUST BACKEND
	[FINAL_SALES_AMOUNT_LC] DECIMAL(15,4), -- [FINAL_PRODUCT_AMOUNT] X EXCHANGE RATE -- JUST BACK END
	REMARKS VARCHAR(2000) ,
	TEST_DESC VARCHAR(50) , -- DEFAULT "NA" -- BACKEND
	STATUS_ENTRY VARCHAR(20) ,
	CREATED_BY VARCHAR(50) ,
	CREATED_DATE DATETIME ,
	CREATED_MAC_ADDRESS VARCHAR(50) ,
	MODIFIED_BY VARCHAR(50) ,
	MODIFIED_DATE DATETIME ,
	MODIFIED_MAC_ADDRESS VARCHAR(50) ,
	SUBMITTED_BY VARCHAR(50),
	SUBMITTED_DATE DATETIME
	)
	GO
	
	
CREATE TABLE STOENTRIES.TBL_SALES_ORDER_DTL(
	SNO INT IDENTITY(1,1)  CONSTRAINT PK_SNO_SO_DTL PRIMARY KEY ,
	SALES_ORDER_REF_NO VARCHAR(50) CONSTRAINT FK_SALES_ORDER_REF_NO FOREIGN KEY REFERENCES STOENTRIES.TBL_SALES_ORDER_HDR (SALES_ORDER_REF_NO) ,--FK
	MAIN_CATEGORY_ID INT CONSTRAINT FK_SALES_ORDER_MAIN_ID FOREIGN KEY REFERENCES STOMASTER.TBL_PRODUCT_MAIN_CATEGORY_MASTER (MAIN_CATEGORY_ID) ,-- DROP DOWN
	SUB_CATEGORY_ID INT CONSTRAINT FK_SALES_ORDER_SUB_ID FOREIGN KEY REFERENCES STOMASTER.TBL_PRODUCT_SUB_CATEGORY_MASTER (SUB_CATEGORY_ID) ,-- DROP DOWN
	PRODUCT_ID INT  CONSTRAINT FK_SALES_ORDER_PRODUCT_ID FOREIGN KEY REFERENCES STOMASTER.TBL_PRODUCT_MASTER (PRODUCT_ID),-- DROP DOWN WITH NAME SEARCH
	STORE_STOCK_PCS DECIMAL(15, 4) ,--- STORE AND PRODUCT WISE STOCK QTY
	PO_REF_NO VARCHAR(50) CONSTRAINT FK_PO_REF_NO_SO_DTL FOREIGN KEY REFERENCES STOENTRIES.TBL_PURCHASE_ORDER_HDR(PO_REF_NO),-- DROP DOWN LOAD BASED ON SELECTED PRODUCT ID
	PO_DTL_SNO INT CONSTRAINT FK_PO_DTL_SNO_SO_DTL FOREIGN KEY REFERENCES STOENTRIES.TBL_PURCHASE_ORDER_DTL(SNO),-- AUTO SELECT PO NO AND SELECTE PRODUCT ID 
	PO_DTL_STOCK_QTY DECIMAL(15,4), -- STORE,PO DTL SNO AND PRODUCT WISE QTY
	[PURCHASE_RATE_PER_QTY] DECIMAL(15,6),-- LABEL DATA PICK FROM PO RATE
	PO_EXPENSE_AMOUNT DECIMAL(15,4),-- SUM OF TOTAL PO EXPENSES AGAINST SELECTED PO AND PO SNO
	[SALES_RATE_PER_QTY] DECIMAL(15,6),-- TEXT
	[QTY_PER_PACKING] DECIMAL(15,2),-- LABEL PICK FROM [STOMASTER].[TBL_PRODUCT_MASTER]-- SELECTED PRODUCT
	[TOTAL_QTY] DECIMAL(15,4),-- TEXT --
	[UOM] VARCHAR(50),-- LABEL PICK FROM [STOMASTER].[TBL_PRODUCT_MASTER]-- SELECTED PRODUCT
	[TOTAL_PACKING] DECIMAL(15,4),--LABEL FORMULAE =  [TOTAL_QTY]*[QTY_PER_PACKING]
	[ALTERNATE_UOM] VARCHAR(500),-- -- LABEL PICK FROM [STOMASTER].[TBL_PRODUCT_MASTER]-- SELECTED PRODUCT
	[TOTAL_PRODUCT_AMOUNT] DECIMAL(15,4),-- FORMAULE =  [TOTAL_QTY] X [SALES_RATE_PER_QTY]
	[VAT_PERCENTAGE] DECIMAL(15,2),-- FORMAULE WRITE USER DEFINED FUNCTION GET VAT %
	[VAT_AMOUNT] DECIMAL(15,4), -- FORMAULE [TOTAL_PRODUCT_AMOUNT] X [VAT_PERCENTAGE]/100
	[FINAL_SALES_AMOUNT] DECIMAL(15,4),-- FORMAULE =  [TOTAL_PRODUCT_AMOUNT] + [VAT_AMOUNT]
	[TOTAL_PRODUCT_AMOUNT_LC] DECIMAL(15,4),-- FORMULAE = [TOTAL_PRODUCT_AMOUNT]*EXCHANGE RATE  -- JUST BACKEND
	[FINAL_SALES_AMOUNT_LC] DECIMAL(15,4), -- [FINAL_PRODUCT_AMOUNT] X EXCHANGE RATE -- JUST BACK END
	REMARKS VARCHAR(2000) ,-- TEXXT
	STATUS_ENTRY VARCHAR(20) ,
	CREATED_BY VARCHAR(50) ,
	CREATED_DATE DATETIME ,
	CREATED_MAC_ADDRESS VARCHAR(50) ,
	MODIFIED_BY VARCHAR(50) ,
	MODIFIED_DATE DATETIME ,
	MODIFIED_MAC_ADDRESS VARCHAR(50) ,
	)

	GO

	
CREATE TABLE STOENTRIES.TBL_DELIVERY_NOTE_HDR(
	SNO INT IDENTITY(1,1)  ,
	DELIVERY_NOTE_REF_NO VARCHAR(50)CONSTRAINT PK_DELIVERY_NOTE_REF_NO PRIMARY KEY   ,
	DELIVERY_DATE DATETIME ,
	COMPANY_ID INT   CONSTRAINT FK_DELIVERY_COMPANY_ID FOREIGN KEY REFERENCES STOMASTER.TBL_COMPANY_MASTER (COMPANY_ID),-- DROP DOWN
	FROM_STORE_ID INT CONSTRAINT FK_DELIVERY_FROM_STORE_ID FOREIGN KEY REFERENCES STOMASTER.TBL_STORE_MASTER (STORE_ID), -- DROP DOWN STORE ID
	DELIVERY_SOURCE_TYPE VARCHAR(50) , -- STOCK TRANSFER / SALES ORDER
	DELIVERY_SOURCE_REF_NO VARCHAR(50) ,-- IF TYPE IS SALES ORDER = LOAD SALES ORDER NO
	TO_STORE_ID INT CONSTRAINT FK_DELIVERY_TO_STORE_ID FOREIGN KEY REFERENCES STOMASTER.TBL_STORE_MASTER (STORE_ID), -- IF OTHER THAN SALES ORDER OPEN THIS DROP DOWN
	CUSTOMER_ID INT CONSTRAINT FK_GRN_ITEM_STORE_ID FOREIGN KEY REFERENCES STOMASTER.TBL_CUSTOMER_MASTER (CUSTOMER_ID),-- IF TYPE IS SALES ORDER LOAD CUSTOMER NAME
	TRUCK_NO VARCHAR(50) ,-- TEXT
	TRAILER_NO VARCHAR(50),-- TEXT
	DRIVER_NAME VARCHAR(50) ,-- TEXT
	DRIVER_CONTACT_NUMBER VARCHAR(50) ,-- TEXT
	SEAL_NO VARCHAR(50) ,-- TEXT
	CURRENCY_ID INT CONSTRAINT FK_CURRENCY_ID_DEL_HDR FOREIGN KEY REFERENCES STOMASTER.TBL_CURRENCY_MASTER(CURRENCY_ID),-- DROP DOWN PICK FROM SALES ORDER HDR
	EXCHANGE_RATE DECIMAL(15,2),-- LABEL PICK FROM SALES ORDER HDR
	[TOTAL_PRODUCT_AMOUNT] DECIMAL(15,4),-- SUM OF DTL
	[VAT_AMOUNT] DECIMAL(15,4), -- FORMAULE SUM OF DTL
	[FINAL_SALES_AMOUNT] DECIMAL(15,4),-- FORMAULE =   SUM OF DTL
	[TOTAL_PRODUCT_AMOUNT_LC] DECIMAL(15,4),-- FORMULAE =  SUM OF DTL
	[FINAL_SALES_AMOUNT_LC] DECIMAL(15,4), -- FORMULAE =  SUM OF DTL
	TEST_DESC VARCHAR(50) ,-- PICK FROM SALES ORDER.. ONLY BACKEND
	REMARKS VARCHAR(2000) ,-- TEXT
	STATUS_ENTRY VARCHAR(20) ,-- CF/CL/CA
	CREATED_BY VARCHAR(50) ,
	CREATED_DATE DATETIME ,
	CREATED_MAC_ADDRESS VARCHAR(50) ,
	MODIFIED_BY VARCHAR(50) ,
	MODIFIED_DATE DATETIME ,
	MODIFIED_MAC_ADDRESS VARCHAR(50) ,
	SUBMITTED_BY VARCHAR(50),
	SUBMITTED_DATE DATETIME,
	SUBMITTED_MAC_ADDRESS VARCHAR(50)
	)
	GO

	
CREATE TABLE STOENTRIES.TBL_DELIVERY_NOTE_DTL(
	SNO INT IDENTITY(1,1)  CONSTRAINT PK_DELIVERY_SNO PRIMARY KEY ,
	DELIVERY_NOTE_REF_NO VARCHAR(50) CONSTRAINT FK_DELIVERY_NOTE_REF_NO FOREIGN KEY REFERENCES STOENTRIES.TBL_DELIVERY_NOTE_HDR (DELIVERY_NOTE_REF_NO),
	SALES_ORDER_DTL_SNO INT ,-- IF SALES ORDER CHOOSE SNO 
--- GET ALL THE INFORMATION BY CHOOSING LSALES ORDER DTL SNO STARTS--------------------------
	PO_DTL_SNO INT CONSTRAINT FK_PO_DTL_SNO_DEL_DTL FOREIGN KEY REFERENCES STOENTRIES.TBL_PURCHASE_ORDER_DTL(SNO),-- AUTO SELECT PO NO AND SELECTE PRODUCT ID 
	PO_REF_NO VARCHAR(50) CONSTRAINT FK_PO_REF_NO_DEL_DTL FOREIGN KEY REFERENCES STOENTRIES.TBL_PURCHASE_ORDER_HDR(PO_REF_NO),-- DROP DOWN LOAD BASED ON SELECTED PRODUCT ID
	MAIN_CATEGORY_ID INT CONSTRAINT FK_DELIVERY_MAIN_ID_DEL FOREIGN KEY REFERENCES STOMASTER.TBL_PRODUCT_MAIN_CATEGORY_MASTER (MAIN_CATEGORY_ID) ,
	SUB_CATEGORY_ID INT CONSTRAINT FK_DELIVERY_SUB_ID_DEL FOREIGN KEY REFERENCES STOMASTER.TBL_PRODUCT_SUB_CATEGORY_MASTER (SUB_CATEGORY_ID) ,
	PRODUCT_ID INT  CONSTRAINT FK_DELIVERY_PRODUCT_ID_dEL FOREIGN KEY REFERENCES STOMASTER.TBL_PRODUCT_MASTER (PRODUCT_ID),
	[SALES_RATE_PER_QTY] DECIMAL(15,6),-- TEXT
	[QTY_PER_PACKING] DECIMAL(15,2),-- LABEL PICK FROM [STOMASTER].[TBL_PRODUCT_MASTER]-- SELECTED PRODUCT
	[REQUEST_QTY] DECIMAL(15,4),-- LABEL-- PICK FROM REQUEST
	DELIVERY_QTY DECIMAL(15,4),--TEXT== IT SHOULD NOT EXCEED REQUEST QTY ( TOTAL QTY ) 
	[UOM] VARCHAR(50),-- LABEL PICK FROM [STOMASTER].[TBL_PRODUCT_MASTER]-- SELECTED PRODUCT
	[TOTAL_PACKING] DECIMAL(15,4),--LABEL FORMULAE =  [TOTAL_QTY]*[QTY_PER_PACKING]
	[ALTERNATE_UOM] VARCHAR(500),-- -- LABEL PICK FROM [STOMASTER].[TBL_PRODUCT_MASTER]-- SELECTED PRODUCT
	[TOTAL_PRODUCT_AMOUNT] DECIMAL(15,4),-- FORMAULE =  [TOTAL_QTY] X [SALES_RATE_PER_QTY]
	[VAT_PERCENTAGE] DECIMAL(15,2),-- FORMAULE WRITE USER DEFINED FUNCTION GET VAT %
	[VAT_AMOUNT] DECIMAL(15,4), -- FORMAULE [TOTAL_PRODUCT_AMOUNT] X [VAT_PERCENTAGE]/100
	[FINAL_SALES_AMOUNT] DECIMAL(15,4),-- FORMAULE =  [TOTAL_PRODUCT_AMOUNT] + [VAT_AMOUNT]
	[TOTAL_PRODUCT_AMOUNT_LC] DECIMAL(15,4),-- FORMULAE = [TOTAL_PRODUCT_AMOUNT]*EXCHANGE RATE  -- JUST BACKEND
	[FINAL_SALES_AMOUNT_LC] DECIMAL(15,4), -- [FINAL_PRODUCT_AMOUNT] X EXCHANGE RATE -- JUST BACK END
	--- GET ALL ETHE INFORMATION BY CHOOSING LSALES ORDER DTL SNO ENDS-------------------
		STORE_STOCK_PCS DECIMAL(15, 2) ,--- GET STORE STOCK BY USING FUNCTION
	REMARKS VARCHAR(2000) ,
	STATUS_ENTRY VARCHAR(20) ,
	CREATED_BY VARCHAR(50) ,
	CREATED_DATE DATETIME ,
	CREATED_MAC_ADDRESS VARCHAR(50) ,
	MODIFIED_BY VARCHAR(50) ,
	MODIFIED_DATE DATETIME ,
	MODIFIED_MAC_ADDRESS VARCHAR(50) 

	)

GO

	
CREATE TABLE STOENTRIES.TBL_TAX_INVOICE_HDR(
	SNO INT IDENTITY(1,1)  ,
	TAX_INVOICE_REF_NO VARCHAR(50)CONSTRAINT PK_TAX_INV_REF_NO PRIMARY KEY   ,
	INVOICE_DATE DATETIME ,
	COMPANY_ID INT   CONSTRAINT FK_DELIVERY_COMPANY_ID_INV_REF_NO FOREIGN KEY REFERENCES STOMASTER.TBL_COMPANY_MASTER (COMPANY_ID),-- DROP DOWN
	FROM_STORE_ID INT CONSTRAINT FK_DELIVERY_FROM_STORE_ID_INV_REF_NO FOREIGN KEY REFERENCES STOMASTER.TBL_STORE_MASTER (STORE_ID), -- DROP DOWN STORE ID
	INVOICE_TYPE VARCHAR(50) , -- LOCAL INVOICE / EXPORT
	DELIVERY_NOTE_REF_NO VARCHAR(50) CONSTRAINT FK_DEL_NOT_rEF_NO_INV_REF_NO foreign key references stoentries.tbl_delivery_note_hdr(delivery_note_Ref_no) ,-- IF TYPE IS SALES ORDER = LOAD SALES ORDER NO
	CUSTOMER_ID INT CONSTRAINT FK_GRN_ITEM_STORE_ID_INV_REF_NO FOREIGN KEY REFERENCES STOMASTER.TBL_CUSTOMER_MASTER (CUSTOMER_ID),-- pick from delivery note
	CURRENCY_ID INT CONSTRAINT FK_CURRENCY_ID_DEL_INV_REF_NO FOREIGN KEY REFERENCES STOMASTER.TBL_CURRENCY_MASTER(CURRENCY_ID),-- DROP DOWN PICK FROM SALES ORDER HDR
	EXCHANGE_RATE DECIMAL(15,2),-- LABEL PICK FROM SALES ORDER HDR
	[TOTAL_PRODUCT_AMOUNT] DECIMAL(15,4),-- SUM OF DTL
	[VAT_AMOUNT] DECIMAL(15,4), -- FORMAULE SUM OF DTL
	[FINAL_SALES_AMOUNT] DECIMAL(15,4),-- FORMAULE =   SUM OF DTL
	[TOTAL_PRODUCT_AMOUNT_LC] DECIMAL(15,4),-- FORMULAE =  SUM OF DTL
	[FINAL_SALES_AMOUNT_LC] DECIMAL(15,4), -- FORMULAE =  SUM OF DTL
	TEST_DESC VARCHAR(50) ,-- PICK FROM SALES ORDER.. ONLY BACKEND
	REMARKS VARCHAR(2000) ,-- TEXT
	STATUS_ENTRY VARCHAR(20) ,-- CF/CL/CA
	CREATED_BY VARCHAR(50) ,
	CREATED_DATE DATETIME ,
	CREATED_MAC_ADDRESS VARCHAR(50) ,
	MODIFIED_BY VARCHAR(50) ,
	MODIFIED_DATE DATETIME ,
	MODIFIED_MAC_ADDRESS VARCHAR(50) ,
	SUBMITTED_BY VARCHAR(50),
	SUBMITTED_DATE DATETIME,
	SUBMITTED_MAC_ADDRESS VARCHAR(50)
	)
	GO

	
CREATE TABLE STOENTRIES.TBL_TAX_INVOICE_DTL(
	SNO INT IDENTITY(1,1)  CONSTRAINT PK_DELIVERY_SNO_tAX_INV PRIMARY KEY ,
	TAX_INVOICE_REF_NO VARCHAR(50) CONSTRAINT FK_TAX_INV_REF_NO_DTL FOREIGN KEY REFERENCES STOENTRIES.TBL_TAX_INVOICE_HDR (TAX_INVOICE_rEF_NO),
	DELIVERY_NOTE_DTL_SNO INT ,-- IF SALES ORDER CHOOSE SNO 
--- GET ALL THE INFORMATION BY CHOOSING LSALES ORDER DTL SNO STARTS--------------------------
	PO_DTL_SNO INT CONSTRAINT FK_PO_DTL_SNO_TAX_DTL FOREIGN KEY REFERENCES STOENTRIES.TBL_PURCHASE_ORDER_DTL(SNO),-- AUTO SELECT PO NO AND SELECTE PRODUCT ID 
	PO_REF_NO VARCHAR(50) CONSTRAINT FK_PO_REF_NO_TAX_DTL FOREIGN KEY REFERENCES STOENTRIES.TBL_PURCHASE_ORDER_HDR(PO_REF_NO),-- DROP DOWN LOAD BASED ON SELECTED PRODUCT ID
	MAIN_CATEGORY_ID INT CONSTRAINT FK_DELIVERY_MAIN_ID_INV_REF_NO FOREIGN KEY REFERENCES STOMASTER.TBL_PRODUCT_MAIN_CATEGORY_MASTER (MAIN_CATEGORY_ID) ,
	SUB_CATEGORY_ID INT CONSTRAINT FK_DELIVERY_SUB_ID_INV_REF_NO FOREIGN KEY REFERENCES STOMASTER.TBL_PRODUCT_SUB_CATEGORY_MASTER (SUB_CATEGORY_ID) ,
	PRODUCT_ID INT  CONSTRAINT FK_DELIVERY_PRODUCT_ID_INV_REF_NO FOREIGN KEY REFERENCES STOMASTER.TBL_PRODUCT_MASTER (PRODUCT_ID),
	[SALES_RATE_PER_QTY] DECIMAL(15,6),-- TEXT
	[QTY_PER_PACKING] DECIMAL(15,2),-- LABEL PICK FROM [STOMASTER].[TBL_PRODUCT_MASTER]-- SELECTED PRODUCT
	DELIVERY_QTY DECIMAL(15,4),--LABEL== PICK FROM DELIVERY
	INVOICE_QTY DECIMAL(15,4),-- TEXT== PICK FROM DELIVERY = TOTAL_QTY
	[UOM] VARCHAR(50),-- LABEL PICK FROM [STOMASTER].[TBL_PRODUCT_MASTER]-- SELECTED PRODUCT
	[TOTAL_PACKING] DECIMAL(15,4),--LABEL FORMULAE =  [TOTAL_QTY]*[QTY_PER_PACKING]
	[ALTERNATE_UOM] VARCHAR(500),-- -- LABEL PICK FROM [STOMASTER].[TBL_PRODUCT_MASTER]-- SELECTED PRODUCT
	[TOTAL_PRODUCT_AMOUNT] DECIMAL(15,4),-- FORMAULE =  [TOTAL_QTY] X [SALES_RATE_PER_QTY]
	[VAT_PERCENTAGE] DECIMAL(15,2),-- FORMAULE PICK FROM DELIVERY DTL
	[VAT_AMOUNT] DECIMAL(15,4), -- FORMAULE [TOTAL_PRODUCT_AMOUNT] X [VAT_PERCENTAGE]/100
	[FINAL_SALES_AMOUNT] DECIMAL(15,4),-- FORMAULE =  [TOTAL_PRODUCT_AMOUNT] + [VAT_AMOUNT]
	[TOTAL_PRODUCT_AMOUNT_LC] DECIMAL(15,4),-- FORMULAE = [TOTAL_PRODUCT_AMOUNT]*EXCHANGE RATE  -- JUST BACKEND
	[FINAL_SALES_AMOUNT_LC] DECIMAL(15,4), -- [FINAL_PRODUCT_AMOUNT] X EXCHANGE RATE -- JUST BACK END
	--- GET ALL ETHE INFORMATION BY CHOOSING LSALES ORDER DTL SNO ENDS-------------------
	REMARKS VARCHAR(2000) ,
	STATUS_ENTRY VARCHAR(20) ,
	CREATED_BY VARCHAR(50) ,
	CREATED_DATE DATETIME ,
	CREATED_MAC_ADDRESS VARCHAR(50) ,
	MODIFIED_BY VARCHAR(50) ,
	MODIFIED_DATE DATETIME ,
	MODIFIED_MAC_ADDRESS VARCHAR(50) 

	)

GO

CREATE TABLE [StoEntries].[TBL_CUSTOMER_RECEIPT_HDR](
[SNO] BIGINT IDENTITY(1,1) NOT NULL,
[RECEIPT_REF_NO] VARCHAR(50) NOT NULL CONSTRAINT PK_CUST_RECPT_REF_NO PRIMARY KEY,
[RECEIPT_DATE] DATETIME,-- text
[PAYMENT_TYPE] VARCHAR(50), -- INVOICE / ADVANCE
[COMPANY_ID] INT CONSTRAINT FK_COMP_ID_CUST_RECPT FOREIGN KEY REFERENCES [StoMaster].[tbl_Company_Master]([Company_Id]),
[CUSTOMER_ID] INT CONSTRAINT FK_CUST_ID_CUST_RECPT FOREIGN KEY REFERENCES [StoMaster].[tbl_Customer_Master]([Customer_Id]),
[PAYMENT_MODE_ID] INT CONSTRAINT FK_PAYM_MOD_ID_CUST_RECT FOREIGN KEY REFERENCES [StoMaster].[TBL_CUSTOMER_PAYMENT_MODE_MASTER]([PAYMENT_MODE_ID]),
[CR_BANK_CASH_ID] INT CONSTRAINT FK_CR_BANK_ID_CUST_RECT FOREIGN KEY REFERENCES [StoMaster].[TBL_BANK_MASTER]([BANK_ID]),
[CR_ACCOUNT_ID] INT CONSTRAINT FK_ACCOUNT_ID_CUST_RECPT FOREIGN KEY REFERENCES [StoMaster].[tbl_Company_Bank_Account_Master]([Account_Id]),
[DR_BANK_CASH_ID] INT CONSTRAINT FK_DR_BANK_ID_CUST_RECT FOREIGN KEY REFERENCES [StoMaster].[TBL_BANK_MASTER]([BANK_ID]),
[TRANSACTION_REF_NO] VARCHAR(100),-- TEXT
[TRANSACTION_DATE] DATETIME,-- TEXT
[CURRENCY_ID] INT CONSTRAINT FK_CURRENCY_ID_CUST_RECTP FOREIGN KEY REFERENCES [StoMaster].[TBL_CURRENCY_MASTER]([CURRENCY_ID]),
[RECEIPT_AMOUNT] DECIMAL(15,2),
[EXCHANGE_RATE] DECIMAL(15,2),-- TEXT GET EXCHANGE RATE BY USING CURRENCY ID
[RECEIPT_AMOUNT_LC] DECIMAL(15,2),
[REMARKS] VARCHAR(1000),
[STATUS_ENTRY] VARCHAR(20),
[CREATED_BY] VARCHAR(50),
[CREATED_DATE] DATETIME,
[CREATED_MAC_ADDRESS] VARCHAR(50),
[MODIFIED_BY] VARCHAR(50),
[MODIFIED_DATE] DATETIME,
[MODIFIED_MAC_ADDRESS] VARCHAR(50),
Submitted_By varchar(50),
Submitted_Date datetime,
Submitted_IP_Address varchar(50),
[Tally_Ref_No] VARCHAR(50),
[Tally_Sync_Status] VARCHAR(20),
[Tally_Sync_Date] DATETIME,
[Tally_Sync_Person_Name] VARCHAR(50)
) 

go

CREATE TABLE [StoEntries].[TBL_CUSTOMER_RECEIPT_INVOICE_DTL](
[SNO] BIGINT IDENTITY(1,1) CONSTRAINT PK_SNO_CUT_RECPT_INV_DTL PRIMARY KEY,
[RECEIPT_REF_NO] VARCHAR(50) CONSTRAINT FK_RECE_REF_NO_REC_INV_DTL FOREIGN KEY REFERENCES [StoEntries].[TBL_CUSTOMER_RECEIPT_HDR]([RECEIPT_REF_NO]),
[TAX_INVOICE_REF_NO] VARCHAR(50) constraint fk_inv_rec_hdr foreign key references stoentries.tbl_tax_invoice_hdr(tax_invoice_ref_no) , 
[ACTUAL_INVOICE_AMOUNT] DECIMAL(15,2),--- pick from tax invoice final tax inv hdr amount
[ALREADY_PAID_AMOUNT] DECIMAL(15,2),-- same table already encoded entry against tax invoice ref no
[OUTSTANDING_INVOICE_AMOUNT] DECIMAL(15,2), -- formuale [ACTUAL_INVOICE_AMOUNT] - [ALREADY_PAID_AMOUNT]
[RECEIPT_INVOICE_ADJUST_AMOUNT] DECIMAL(15,2),-- text == validation qty should not exceed outstanding amount
[REMARKS] VARCHAR(1000),-- text
[STATUS_ENTRY] VARCHAR(20),
[CREATED_BY] VARCHAR(50),
[CREATED_DATE] DATETIME,
[CREATED_MAC_ADDRESS] VARCHAR(50),
[MODIFIED_BY] VARCHAR(50),
[MODIFIED_DATE] DATETIME,
[MODIFIED_MAC_ADDRESS] VARCHAR(50),
);

