import { text, uuid, pgTable } from 'drizzle-orm/pg-core';

export const drizzleTransactions = pgTable('drizzle', {
  id: uuid('id').primaryKey().defaultRandom().notNull(),
  value: text('value').notNull(),
});
