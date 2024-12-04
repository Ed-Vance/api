import { pgTable as table, integer, pgEnum, primaryKey } from "drizzle-orm/pg-core";
import { InferSelectModel, InferInsertModel } from 'drizzle-orm';

import { classes } from "./classes";
import { users } from "./users";

export const userRoles = pgEnum("user_role", ["student", "teacher"]); // @Will I think you mentioned something about admin here?

export const class_users = table("class_users", {
  class_id: integer("class_id").notNull().references(() => classes.class_id, { onDelete: "cascade" }), // Per moderators.ts re onDelete
  user_id: integer("user_id").notNull().references(() => users.user_id, { onDelete: "cascade" }),role: userRoles("role").notNull(), 
  },
  (table) => [
    primaryKey({
      columns: [table.class_id, table.user_id],
    }),
  ]
);

// Per users.ts
export type ClassUser = InferSelectModel<typeof class_users>;
export type NewClassUser = InferInsertModel<typeof class_users>;