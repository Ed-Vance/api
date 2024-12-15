import { serial, text, json, boolean, integer, timestamp } from 'drizzle-orm/pg-core';
import { pgTable } from 'drizzle-orm/pg-core';

export const environment = pgTable('environment', {
  environment_id: serial('environment_id').primaryKey(), // primary key, not null
  class_id: integer('class_id'), // foreign key referencing Classes.class_id
  environment_name: text('environment_name'), // not null
  environment_description: text('environment_description'), // not null
  settings: json('settings'), // not null
  active_status: boolean('active_status'), // not null
});
