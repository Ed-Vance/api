import { pgTable as table, primaryKey, integer } from "drizzle-orm/pg-core";
import { InferSelectModel, InferInsertModel } from "drizzle-orm";

import { users } from "./users";
import { licenses_subscriptions } from "./licenses_subscriptions";

export const moderators = table("moderators", {
    user_id: integer("user_id").notNull().references(() => users.user_id, { onDelete: "cascade" }), // onDelete to ensure that we dont need to manage valid entries
    license_id: integer("license_id").notNull().references(() => licenses_subscriptions.license_id, { onDelete: "cascade" }), // as above
    },
    (table) => [
        primaryKey({
          columns: [table.user_id, table.license_id],
        }),
      ]
);


// Per users.ts
export type Moderator = InferSelectModel<typeof moderators>;
export type NewModerator = InferInsertModel<typeof moderators>;