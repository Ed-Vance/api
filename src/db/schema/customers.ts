import { pgTable as table } from "drizzle-orm/pg-core";
import * as t from "drizzle-orm/pg-core";
import { InferSelectModel, InferInsertModel } from "drizzle-orm";

export const customers = table("customers", {
    id: t.uuid().primaryKey(),
    name: t.text().notNull(),
    //subscription info to come in later.
});

//happy with this for now, but think we should STRONGLY consider using https://orm.drizzle.team/docs/zod
//zod is very powerful runtime type checker to confirm this stuff.
export type Customer = InferSelectModel<typeof customers>;
export type NewCustomer = InferInsertModel<typeof customers>;
