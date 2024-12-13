// db/schema/clients.ts
import { serial, text, timestamp, boolean } from 'drizzle-orm/pg-core';
import { pgTable } from 'drizzle-orm/pg-core';
import { subscriptionTypeEnum } from './enums';

export const clients = pgTable('clients', {
  client_id: serial('client_id').primaryKey(), // primary key, not null
  api_key: text('api_key'), // not null
  school_name: text('school_name'), // not null
  subscription_type: subscriptionTypeEnum('subscription_type'), // not null
  start_date: timestamp('start_date'), // not null
  end_date: timestamp('end_date'), // not null
  autorenew: boolean('autorenew'), // not null
});
