CREATE TABLE "business_user_group" (
	"user_id" integer,
	"businessId" uuid,
	CONSTRAINT "business_user_group_user_id_businessId_pk" PRIMARY KEY("user_id","businessId")
);
--> statement-breakpoint
CREATE TABLE "business" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"owner_id" integer NOT NULL,
	"name" varchar(255) NOT NULL,
	"category" varchar(50) NOT NULL,
	"country" varchar(50) DEFAULT 'nigeria',
	"state" varchar(50) NOT NULL,
	"city" varchar(50) NOT NULL,
	"currency" varchar(50) DEFAULT 'NGN',
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "users_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"fullname" varchar(225) NOT NULL,
	"email" varchar(225) NOT NULL,
	"phone" varchar(20),
	"password" varchar(100) NOT NULL,
	"is_active" boolean DEFAULT true,
	"is_email_verified" boolean DEFAULT false,
	"is_open_for_update" boolean DEFAULT true,
	"created_at" timestamp DEFAULT now(),
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
ALTER TABLE "business_user_group" ADD CONSTRAINT "business_user_group_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "business_user_group" ADD CONSTRAINT "business_user_group_businessId_business_id_fk" FOREIGN KEY ("businessId") REFERENCES "public"."business"("id") ON DELETE set null ON UPDATE no action;