import { pgTable as table, primaryKey, integer,pgEnum, timestamp,text } from "drizzle-orm/pg-core";
import { InferSelectModel, InferInsertModel } from "drizzle-orm";

import { users } from "./users";
import { environment } from "./environment";

export const messageTypeEnum = pgEnum('message_type', ['response', 'query']);

export const environment_history = table("environment_history",{
    environment_id: integer("environment_id").notNull().references(() => environment.environment_id, { onDelete: "cascade" }), // Per moderators.ts
    user_id: integer("user_id").notNull().references(() => users.user_id, { onDelete: "cascade" }),
    timestamp: timestamp("timestamp").notNull(),
    message: text("message").notNull(),
    message_type: messageTypeEnum("message_type").notNull(),
    },
    (table) => [
        primaryKey({
            columns: [table.environment_id, table.user_id],
        }),
    ]
);

// per users.ts
export type EnvironmentHistory = InferSelectModel<typeof environment_history>;
export type NewEnvironmentHistory = InferInsertModel<typeof environment_history>;