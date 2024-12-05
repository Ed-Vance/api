import { pgTable as table } from "drizzle-orm/pg-core";
import * as t from "drizzle-orm/pg-core";

export const module = table("module", {
    id: t.integer(),
    customer_id: t.uuid().notNull(),
    name: t.text().notNull(),
    class_id: t.integer().notNull(),
    //settings / status etc. to come in later.
});
