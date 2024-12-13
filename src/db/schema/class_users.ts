// db/schema/class_users.ts
import { integer } from 'drizzle-orm/pg-core';
import { pgTable, primaryKey } from 'drizzle-orm/pg-core';
import { userRoleEnum } from './enums';

export const class_users = pgTable(
  'class_users',
  {
    class_id: integer('class_id'), // primary key, foreign key referencing Classes.class_id
    user_id: integer('user_id'), // primary key, foreign key referencing Users.user_id
    role: userRoleEnum('role'), // not null
  },
  (table) => ({
    pk: primaryKey({ columns: [table.class_id, table.user_id] }),
  })
);
