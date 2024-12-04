import { pgTable as table } from "drizzle-orm/pg-core";
import * as t from "drizzle-orm/pg-core";

export const classes = table("classes", {
    id: t.integer(),
    name: t.text(),
});
