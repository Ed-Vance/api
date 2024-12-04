CREATE TYPE "public"."assignmentTypes" AS ENUM('playground');--> statement-breakpoint
CREATE TYPE "public"."userTypes" AS ENUM('student', 'teacher', 'admin');--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "assignments" (
	"id" integer,
	"name" text,
	"class_id" integer,
	"type" "assignmentTypes"
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "class_users" (
	"class_id" integer,
	"user_id" integer
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "classes" (
	"id" integer,
	"name" text
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "users" (
	"id" integer,
	"display_name" text,
	"email" text,
	"password_hash" text,
	"type" "userTypes"
);
