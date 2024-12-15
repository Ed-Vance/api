import { db } from '../db/drizzle';
import { environment_history } from '../db/schema/environment_history';
import { and, eq } from 'drizzle-orm';

export const getAllEnvironmentHistories = async () => {
  const result = await db.select().from(environment_history).execute();
  return result;
};

export const getEnvironmentHistoryByIds = async (environmentId: number, userId: number) => {
  const result = await db.select().from(environment_history).where(and(eq(environment_history.environment_id, environmentId), eq(environment_history.user_id, userId))).execute();
  return result;
};

export const createEnvironmentHistory = async (historyData: {
  environment_id: number;
  user_id: number;
  timestamp: Date;
  message: string;
  message_type: 'response' | 'query';
}) => {
  const result = await db.insert(environment_history).values(historyData).returning().execute();
  return result[0];
};
 
export const deleteEnvironmentHistory = async (environmentId: number, userId: number) => {
  const result = await db.delete(environment_history).where(and(eq(environment_history.environment_id, environmentId), eq(environment_history.user_id, userId))).returning().execute();
  return result;
};
