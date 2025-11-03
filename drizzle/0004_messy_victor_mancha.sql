ALTER TABLE "stocks" ADD COLUMN "unit_price" numeric(5) DEFAULT '0.0';--> statement-breakpoint
ALTER TABLE "stocks" ADD COLUMN "selling_price" numeric(5) DEFAULT '0.0';--> statement-breakpoint
ALTER TABLE "stocks" DROP COLUMN "price";