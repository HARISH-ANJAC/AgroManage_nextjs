ALTER TABLE "stomaster"."TBL_PRODUCT_MASTER" ADD COLUMN "FILE_NAME" varchar(150);--> statement-breakpoint
ALTER TABLE "stomaster"."TBL_PRODUCT_MASTER" ADD COLUMN "CONTENT_TYPE" varchar(50);--> statement-breakpoint
ALTER TABLE "stomaster"."TBL_PRODUCT_MASTER" ADD COLUMN "CONTENT_DATA" "bytea";