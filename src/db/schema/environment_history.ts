import { integer, text, timestamp } from 'drizzle-orm/pg-core';
import { pgTable, primaryKey } from 'drizzle-orm/pg-core';
import { messageTypeEnum } from './enums';

export const environment_history = pgTable(
  'environment_history',
  {
    environment_id: integer('environment_id'), // primary key, foreign key referencing Environment.environment_id
    user_id: integer('user_id'), // primary key, foreign key referencing Users.user_id
    timestamp: timestamp('timestamp'), // not null
    message: text('message'), // not null
    message_type: messageTypeEnum('message_type'), // not null
  },
  (table) => ({
    pk: primaryKey({ columns: [table.environment_id, table.user_id] }),
  })
);
