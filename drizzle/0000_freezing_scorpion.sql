CREATE TYPE "public"."user_role" AS ENUM('student', 'teacher');--> statement-breakpoint
CREATE TYPE "public"."subscription_type" AS ENUM('inactive', 'basic', 'unlimited');--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "class_licenses" (
	"class_id" integer NOT NULL,
	"license_id" integer NOT NULL,
	CONSTRAINT "class_licenses_class_id_license_id_pk" PRIMARY KEY("class_id","license_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "class_users" (
	"class_id" integer NOT NULL,
	"user_id" integer NOT NULL,
	"role" "user_role" NOT NULL,
	CONSTRAINT "class_users_class_id_user_id_pk" PRIMARY KEY("class_id","user_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "classes" (
	"class_id" serial PRIMARY KEY NOT NULL,
	"class_name" text NOT NULL,
	"class_reference" text
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "environment" (
	"environment_id" serial PRIMARY KEY NOT NULL,
	"settings" jsonb NOT NULL,
	"active_status" boolean NOT NULL,
	"environment_name" text NOT NULL,
	"environment_description" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "environment_class" (
	"environment_id" integer NOT NULL,
	"class_id" integer NOT NULL,
	CONSTRAINT "environment_class_class_id_environment_id_pk" PRIMARY KEY("class_id","environment_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "licenses_subscriptions" (
	"license_id" serial PRIMARY KEY NOT NULL,
	"api_key" text NOT NULL,
	"school_name" text NOT NULL,
	"subscription_type" "subscription_type" DEFAULT 'inactive' NOT NULL,
	"start_date" timestamp,
	"end_date" timestamp,
	"autorenew" boolean DEFAULT false NOT NULL,
	CONSTRAINT "licenses_subscriptions_api_key_unique" UNIQUE("api_key")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "moderators" (
	"user_id" integer NOT NULL,
	"license_id" integer NOT NULL,
	CONSTRAINT "moderators_user_id_license_id_pk" PRIMARY KEY("user_id","license_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "users" (
	"user_id" serial PRIMARY KEY NOT NULL,
	"first_name" text NOT NULL,
	"last_name" text NOT NULL,
	"email" text NOT NULL,
	"password_hash" text NOT NULL,
	"phone" varchar(20) NOT NULL
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "class_licenses" ADD CONSTRAINT "class_licenses_class_id_classes_class_id_fk" FOREIGN KEY ("class_id") REFERENCES "public"."classes"("class_id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "class_licenses" ADD CONSTRAINT "class_licenses_license_id_licenses_subscriptions_license_id_fk" FOREIGN KEY ("license_id") REFERENCES "public"."licenses_subscriptions"("license_id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "class_users" ADD CONSTRAINT "class_users_class_id_classes_class_id_fk" FOREIGN KEY ("class_id") REFERENCES "public"."classes"("class_id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "class_users" ADD CONSTRAINT "class_users_user_id_users_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("user_id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "environment_class" ADD CONSTRAINT "environment_class_environment_id_environment_environment_id_fk" FOREIGN KEY ("environment_id") REFERENCES "public"."environment"("environment_id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "environment_class" ADD CONSTRAINT "environment_class_class_id_classes_class_id_fk" FOREIGN KEY ("class_id") REFERENCES "public"."classes"("class_id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "moderators" ADD CONSTRAINT "moderators_user_id_users_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("user_id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "moderators" ADD CONSTRAINT "moderators_license_id_licenses_subscriptions_license_id_fk" FOREIGN KEY ("license_id") REFERENCES "public"."licenses_subscriptions"("license_id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
