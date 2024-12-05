import { customers, Customer, NewCustomer } from "../db/schema/customers";
import { db } from "../db";

export const upsertCustomer = async (new_customer: NewCustomer) => {
    return await db.insert(customers).values(new_customer).returning();
};
