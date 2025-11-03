CREATE TABLE "notifications" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "notifications_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"title" varchar(255) NOT NULL,
	"content" text NOT NULL,
	"createdAt" timestamp DEFAULT now(),
	"viewers" json,
	"to" varchar(50) DEFAULT 'all' NOT NULL
);
--> statement-breakpoint
ALTER TABLE "stocks" ALTER COLUMN "quantity" SET NOT NULL;