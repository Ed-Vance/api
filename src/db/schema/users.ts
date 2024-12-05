import { pgTable as table } from "drizzle-orm/pg-core";
import * as t from "drizzle-orm/pg-core";

export const userTypes = t.pgEnum("userTypes", ["student", "teacher", "admin"]);

//@Max something to think about
//is a student always a student, or are they a teacher in some classes
//I think admins may be better off being a toggle, or we control all of this via the "class_user" table
// by moving this "type" to there, and adding an "is_admin" flag. (or more fine tuned permissions.)

export const users = table("users", {
    id: t.serial("user_id").primaryKey(),
    display_name: t.text().notNull(),
    email: t.text().notNull(),
    password_hash: t.text().notNull(), //extend to use oauth2 at some point
    // type: userTypes(), //lets think about different types of users later as per ^
    //I personally think a teacher is always a teacher, a student always a student
    //this is true 99.9% of of the time.
});
