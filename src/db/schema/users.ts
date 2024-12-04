import { pgTable as table ,serial, text, varchar } from "drizzle-orm/pg-core";
import { InferSelectModel, InferInsertModel } from 'drizzle-orm';

export const users = table("users", {
    user_id: serial("user_id").primaryKey(),
    first_name: text("first_name").notNull(),
    last_name: text("last_name").notNull(),
    email: text("email").notNull(),
    password_hash: text("password_hash").notNull(), //extend to use oauth2 at some point
    phone: varchar("phone", { length: 20 }).notNull(), // 20 to ensure size constraints (we might possibly want to utilise some sort of area code logic)
});

// This enforces type safety by making sure that when you get and put data that the type is inferred (apparently its a pretty good feature to utilise)
export type User = InferSelectModel<typeof users>;
export type NewUser = InferInsertModel<typeof users>;