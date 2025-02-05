import { serial, text, integer } from 'drizzle-orm/pg-core';
import { pgTable } from 'drizzle-orm/pg-core';

export const classes = pgTable('classes', {
  class_id: serial('class_id').primaryKey(), // primary key, not null
  class_name: text('class_name'), // not null (e.g., "Mathematics")
  class_reference: text('class_reference'), // not null (e.g., "MATH1013")
  license_id: integer('license_id'), // foreign key referencing Clients.client_id
});
