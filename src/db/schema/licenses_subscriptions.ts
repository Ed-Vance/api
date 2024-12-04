import { pgTable as table ,serial, text, pgEnum, timestamp, boolean} from "drizzle-orm/pg-core";
import { InferSelectModel, InferInsertModel } from 'drizzle-orm';

export const subscriptionTypeEnum = pgEnum("subscription_type", ["inactive","basic", "unlimited"]);

export const licenses_subscriptions = table("licenses_subscriptions", {
  license_id: serial("license_id").primaryKey(),
  api_key: text("api_key").notNull().unique(),
  school_name: text("school_name").notNull(),
  subscription_type: subscriptionTypeEnum("subscription_type").default("inactive").notNull(),
  start_date: timestamp("start_date"),
  end_date: timestamp("end_date"),
  autorenew: boolean("autorenew").default(false).notNull(),
});

// Per users.ts
export type LicenseSubscription = InferSelectModel<typeof licenses_subscriptions>;
export type NewLicenseSubscription = InferInsertModel<typeof licenses_subscriptions>;