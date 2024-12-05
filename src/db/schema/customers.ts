import { pgTable as table } from "drizzle-orm/pg-core";
import * as t from "drizzle-orm/pg-core";

export const customers = table("customers", {
    id: t.uuid().primaryKey(),
    name: t.text().notNull(),
    //subscription info to come in later.
});
