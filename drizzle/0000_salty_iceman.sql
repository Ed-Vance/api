CREATE TYPE "public"."message_type" AS ENUM('response', 'query');--> statement-breakpoint
CREATE TYPE "public"."subscription_type" AS ENUM('basic', 'unlimited');--> statement-breakpoint
CREATE TYPE "public"."user_role" AS ENUM('student', 'teacher', 'admin');--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "class_users" (
	"class_id" integer,
	"user_id" integer,
	"role" "user_role",
	CONSTRAINT "class_users_class_id_user_id_pk" PRIMARY KEY("class_id","user_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "classes" (
	"class_id" serial PRIMARY KEY NOT NULL,
	"class_name" text,
	"class_reference" text,
	"license_id" integer
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "client_accounts" (
	"client_id" integer,
	"user_id" integer,
	CONSTRAINT "client_accounts_client_id_user_id_pk" PRIMARY KEY("client_id","user_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "clients" (
	"client_id" serial PRIMARY KEY NOT NULL,
	"api_key" text,
	"school_name" text,
	"subscription_type" "subscription_type",
	"start_date" timestamp,
	"end_date" timestamp,
	"autorenew" boolean
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "environment" (
	"environment_id" serial PRIMARY KEY NOT NULL,
	"class_id" integer,
	"environment_name" text,
	"environment_description" text,
	"settings" json,
	"active_status" boolean
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "environment_history" (
	"environment_id" integer,
	"user_id" integer,
	"timestamp" timestamp,
	"message" text,
	"message_type" "message_type",
	CONSTRAINT "environment_history_environment_id_user_id_pk" PRIMARY KEY("environment_id","user_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "users" (
	"user_id" serial PRIMARY KEY NOT NULL,
	"first_name" text,
	"last_name" text,
	"email" text,
	"password" text,
	"phone" text,
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
