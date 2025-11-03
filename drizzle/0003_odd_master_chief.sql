CREATE TABLE "expenses" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "expenses_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"userId" integer,
	"desc" text,
	"total_amount" numeric(5) DEFAULT '0.0',
	"created_at" timestamp DEFAULT now(),
	"paymentType" varchar(10) DEFAULT 'cash' NOT NULL,
	"currency" varchar(6) DEFAULT 'NGN',
	"category" varchar(30)
);
--> statement-breakpoint
CREATE TABLE "sales" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "sales_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"userId" integer,
	"products" json,
	"total_amount" numeric(5) DEFAULT '0.0',
	"created_at" timestamp DEFAULT now(),
	"buyer" varchar(255),
	"paymentType" varchar(10) DEFAULT 'cash' NOT NULL,
	"currency" varchar(6) DEFAULT 'NGN'
);
--> statement-breakpoint
CREATE TABLE "stocks" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "stocks_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"productName" varchar(255) NOT NULL,
	"category" varchar(50),
	"quantity" integer DEFAULT 0,
	"isAvailable" boolean DEFAULT true,
	"price" numeric(5) DEFAULT '0.0',
	"size" varchar(10),
	"description" text
);
--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "role" SET DATA TYPE varchar(50);--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "role" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "role" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "firstname" varchar(225) NOT NULL;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "lastname" varchar(225) NOT NULL;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "state" varchar(50);--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "city" varchar(50);--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "address" varchar(225) NOT NULL;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "dob" date;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "previlage" varchar(5) DEFAULT 'none' NOT NULL;--> statement-breakpoint
ALTER TABLE "users" DROP COLUMN "fullname";