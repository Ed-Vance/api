CREATE TYPE "public"."userTypes" AS ENUM('student', 'teacher', 'admin');--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "class_users" (
	"class_id" integer NOT NULL,
	"user_id" integer NOT NULL,
	CONSTRAINT "class_users_class_id_user_id_pk" PRIMARY KEY("class_id","user_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "classes" (
	"class_id" serial PRIMARY KEY NOT NULL,
	"customer_id" uuid NOT NULL,
	"name" text NOT NULL,
	"reference" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "customers" (
	"id" uuid PRIMARY KEY NOT NULL,
	"name" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "module" (
	"id" integer,
	"customer_id" uuid NOT NULL,
	"name" text NOT NULL,
	"class_id" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "users" (
	"user_id" serial PRIMARY KEY NOT NULL,
	"display_name" text NOT NULL,
	"email" text NOT NULL,
	"password_hash" text NOT NULL
);
