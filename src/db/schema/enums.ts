import { pgEnum } from 'drizzle-orm/pg-core';

// SubscriptionType enum
export const subscriptionTypeEnum = pgEnum('subscription_type', ['basic', 'unlimited']);

// UserRole enum
export const userRoleEnum = pgEnum('user_role', ['student', 'teacher', 'admin']);

// MessageType enum
export const messageTypeEnum = pgEnum('message_type', ['response', 'query']);
