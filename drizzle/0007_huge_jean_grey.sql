ALTER TABLE "expenses" ALTER COLUMN "total_amount" SET DATA TYPE numeric(9, 2);--> statement-breakpoint
ALTER TABLE "expenses" ALTER COLUMN "total_amount" SET DEFAULT '0.0';--> statement-breakpoint
ALTER TABLE "sales" ALTER COLUMN "total_amount" SET DATA TYPE numeric(9, 2);--> statement-breakpoint
ALTER TABLE "sales" ALTER COLUMN "total_amount" SET DEFAULT '0.0';--> statement-breakpoint
ALTER TABLE "stocks" ALTER COLUMN "unit_price" SET DATA TYPE numeric(9, 2);--> statement-breakpoint
ALTER TABLE "stocks" ALTER COLUMN "unit_price" SET DEFAULT '0.0';--> statement-breakpoint
ALTER TABLE "stocks" ALTER COLUMN "selling_price" SET DATA TYPE numeric(9, 2);--> statement-breakpoint
ALTER TABLE "stocks" ALTER COLUMN "selling_price" SET DEFAULT '0.0';