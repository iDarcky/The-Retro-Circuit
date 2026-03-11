-- Drop redundant console_name and console_slug from reviews table
ALTER TABLE "public"."reviews"
DROP COLUMN "console_name",
DROP COLUMN "console_slug";
