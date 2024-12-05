import { pgTable as table } from "drizzle-orm/pg-core";
import * as t from "drizzle-orm/pg-core";

import { classes } from "./classes";
import { users } from "./users";

export const class_users = table(
    "class_users",
    {
        class_id: t.integer().notNull(),
        user_id: t.integer().notNull(),
    },
    (table) => [
        t.primaryKey({
            columns: [table.class_id, table.user_id],
        }),
    ]
);
