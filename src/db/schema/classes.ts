import { pgTable as table,serial, text } from "drizzle-orm/pg-core";
import { InferSelectModel, InferInsertModel } from 'drizzle-orm';

export const classes = table("classes", {
    class_id: serial("class_id").primaryKey(),
    class_name: text("class_name").notNull(),
    class_reference: text("class_reference")
});

// Per users.ts
export type Class =  InferSelectModel<typeof classes>;
export type NewClass = InferInsertModel<typeof classes>;