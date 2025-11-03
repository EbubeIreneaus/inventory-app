DROP TABLE "business_user_group" CASCADE;--> statement-breakpoint
DROP TABLE "business" CASCADE;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "role" varchar(5) DEFAULT 'admin';--> statement-breakpoint
ALTER TABLE "users" DROP COLUMN "is_open_for_update";