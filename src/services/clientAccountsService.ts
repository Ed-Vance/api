import { db } from '../db/drizzle';
import { client_accounts } from '../db/schema/client_accounts';
import { and, eq } from 'drizzle-orm';

/**
 * Retrieves all client accounts from the database.
 *
 * @async
 * @function getAllClientAccounts
 * @returns {Promise<Array>} 
 *   - **Success:** Returns an array of all client account records.
 *   - **Failure:** Throws an error if the database query fails.
 */
export const getAllClientAccounts = async () => {
  const result = await db.select().from(client_accounts).execute();
  return result;
};

/**
 * Retrieves a specific client account by client ID and user ID.
 *
 * @async
 * @function getClientAccountByIds
 * @param {number} clientId - The ID of the client.
 * @param {number} userId - The ID of the user.
 * @returns {Promise<Object | undefined>} 
 *   - **Success:** Returns the client account object.
 *   - **Failure:** Returns `undefined` if the account is not found.
 * @throws {Error} Throws an error if the database query fails.
 */
export const getClientAccountByIds = async (clientId: number, userId: number) => {
  const result = await db.select().from(client_accounts).where(and(eq(client_accounts.client_id, clientId), eq(client_accounts.user_id, userId))).execute();
  return result[0];
};

/**
 * Creates a new client account in the database.
 *
 * @async
 * @function createClientAccount
 * @param {Object} accountData - The data for the new client account.
 * @param {number} accountData.client_id - The ID of the client.
 * @param {number} accountData.user_id - The ID of the user.
 * @returns {Promise<Object>} 
 *   - **Success:** Returns the newly created client account object.
 *   - **Failure:** Throws an error if the database insertion fails.
 */
export const createClientAccount = async (accountData: {
  client_id: number;
  user_id: number;
}) => {
  const result = await db.insert(client_accounts).values(accountData).returning().execute();
  return result[0];
};

/**
 * Deletes a client account from the database.
 *
 * @async
 * @function deleteClientAccount
 * @param {number} clientId - The ID of the client.
 * @param {number} userId - The ID of the user.
 * @returns {Promise<Object | undefined>} 
 *   - **Success:** Returns the deleted client account object.
 *   - **Failure:** Returns `undefined` if the account is not found.
 * @throws {Error} Throws an error if the database deletion fails.
 */
export const deleteClientAccount = async (clientId: number, userId: number) => {
  const result = await db.delete(client_accounts).where(and(eq(client_accounts.client_id, clientId), eq(client_accounts.user_id, userId))).returning().execute();
  return result[0];
};
