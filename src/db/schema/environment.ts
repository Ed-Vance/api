import { pgTable as table ,serial, jsonb, boolean, text } from "drizzle-orm/pg-core";
import { InferSelectModel, InferInsertModel } from 'drizzle-orm';

export const environment = table("environment", {
    environment_id: serial("environment_id").primaryKey(),
    settings: jsonb("settings").notNull(),
    active_status: boolean("active_status").notNull(),
    environment_name: text("environment_name").notNull(),
    environment_description: text("environment_description").notNull()
});

// per users.ts
export type Environment = InferSelectModel<typeof environment>;
export type NewEnvironment = InferInsertModel<typeof environment>;