import { pgTable as table ,integer, primaryKey } from "drizzle-orm/pg-core";
import { InferSelectModel, InferInsertModel } from 'drizzle-orm';

import { environment } from "./environment";
import { classes } from "./classes";

export const environment_class = table("environment_class", {
  environment_id: integer("environment_id").notNull().references(() => environment.environment_id, { onDelete: "cascade" }), // Per moderators.ts
  class_id: integer("class_id").notNull().references(() => classes.class_id, { onDelete: "cascade" }),
  },
  (table) => [
    primaryKey({
      columns: [table.class_id, table.environment_id],
    }),
  ]
);
  
// Per users.ts
export type EnvironmentClass = InferSelectModel<typeof environment_class>;
export type NewEnvironmentClass = InferInsertModel<typeof environment_class>;