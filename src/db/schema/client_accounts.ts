import { integer } from 'drizzle-orm/pg-core';
import { pgTable, primaryKey } from 'drizzle-orm/pg-core';

export const client_accounts = pgTable(
  'client_accounts',
  {
    client_id: integer('client_id'), // primary key, foreign key referencing Clients.client_id
    user_id: integer('user_id'), // primary key, foreign key referencing Users.user_id
  },
  (table) => ({
    pk: primaryKey({ columns: [table.client_id, table.user_id] }),
  })
);
