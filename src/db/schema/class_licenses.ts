import { pgTable as table ,integer, primaryKey} from "drizzle-orm/pg-core";
import { InferSelectModel, InferInsertModel } from 'drizzle-orm';

import { classes } from "./classes";
import { licenses_subscriptions } from "./licenses_subscriptions";

export const class_licenses = table("class_licenses", {
  class_id: integer("class_id").notNull().references(() => classes.class_id, { onDelete: "cascade" }), // Per moderators.ts
  license_id: integer("license_id").notNull().references(() => licenses_subscriptions.license_id, { onDelete: "cascade" }),
  },
  (table) => [
      primaryKey({
        columns: [table.class_id, table.license_id],
      }),
    ]
);

// Per users.ts
export type ClassLicense = InferSelectModel<typeof class_licenses>;
export type NewClassLicense = InferInsertModel<typeof class_licenses>;