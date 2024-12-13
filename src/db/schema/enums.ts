// db/schema/enums.ts
import { pgEnum } from 'drizzle-orm/pg-core';

// Define SubscriptionType enum
export const subscriptionTypeEnum = pgEnum('subscription_type', ['basic', 'unlimited']);

// Define UserRole enum
export const userRoleEnum = pgEnum('user_role', ['student', 'teacher', 'admin']);

// Define MessageType enum
export const messageTypeEnum = pgEnum('message_type', ['response', 'query']);
