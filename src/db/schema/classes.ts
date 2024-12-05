import { pgTable as table } from "drizzle-orm/pg-core";
import * as t from "drizzle-orm/pg-core";

export const classes = table("classes", {
    id: t.serial("class_id").primaryKey(),
    customer_id: t.uuid().notNull(),
    name: t.text().notNull(),
    reference: t.text().notNull(),
});
