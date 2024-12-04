import { pgTable as table } from "drizzle-orm/pg-core";
import * as t from "drizzle-orm/pg-core";
import { classes } from "./classes";

export const assignmentTypes = t.pgEnum("assignmentTypes", ["playground"]);

export const assignments = table("assignments", {
    id: t.integer(),
    name: t.text(),
    class_id: t.integer(), //we can add foreign key constraints like this .references(() => classes.id but it affects performance.
    type: assignmentTypes(),
});
