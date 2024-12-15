import { db } from '../db/drizzle';
import { client_accounts } from '../db/schema/client_accounts';
import { and, eq } from 'drizzle-orm';

export const getAllClientAccounts = async () => {
  const result = await db.select().from(client_accounts).execute();
  return result;
};
 
export const getClientAccountByIds = async (clientId: number, userId: number) => {
  const result = await db.select().from(client_accounts).where(and(eq(client_accounts.client_id, clientId), eq(client_accounts.user_id, userId))).execute();
  return result[0];
};

export const createClientAccount = async (accountData: {
  client_id: number;
  user_id: number;
}) => {
  const result = await db.insert(client_accounts).values(accountData).returning().execute();
  return result[0];
};

export const deleteClientAccount = async (clientId: number, userId: number) => {
  const result = await db.delete(client_accounts).where(and(eq(client_accounts.client_id, clientId), eq(client_accounts.user_id, userId))).returning().execute();
  return result[0];
};
