// db/schema/users.ts
import { serial, text } from 'drizzle-orm/pg-core';
import { pgTable } from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
  user_id: serial('user_id').primaryKey(), // primary key, not null
  first_name: text('first_name'), // not null
  last_name: text('last_name'), // not null
  email: text('email').unique(), // unique, not null
  password: text('password').notNull(), // not null
  phone: text('phone'), // not null
});
