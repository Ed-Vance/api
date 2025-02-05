import { db } from '../db/drizzle';
import { environment_history } from '../db/schema/environment_history';
import { and, eq } from 'drizzle-orm';

/**
 * Retrieves all environment history records from the database.
 *
 * @async
 * @function getAllEnvironmentHistories
 * @returns {Promise<Array>} 
 *   - **Success:** Returns an array of all environment history records.
 *   - **Failure:** Throws an error if the database query fails.
 */
export const getAllEnvironmentHistories = async () => {
  const result = await db.select().from(environment_history).execute();
  return result;
};

/**
 * Retrieves environment history records by environment ID and user ID.
 *
 * @async
 * @function getEnvironmentHistoryByIds
 * @param {number} environmentId - The ID of the environment.
 * @param {number} userId - The ID of the user.
 * @returns {Promise<Array | undefined>} 
 *   - **Success:** Returns an array of environment history records.
 *   - **Failure:** Returns `undefined` if no records are found.
 * @throws {Error} Throws an error if the database query fails.
 */
export const getEnvironmentHistoryByIds = async (environmentId: number, userId: number) => {
  const result = await db.select().from(environment_history).where(and(eq(environment_history.environment_id, environmentId), eq(environment_history.user_id, userId))).execute();
  return result;
};

/**
 * Creates a new environment history record in the database.
 *
 * @async
 * @function createEnvironmentHistory
 * @param {Object} historyData - The data for the new environment history record.
 * @param {number} historyData.environment_id - The ID of the environment.
 * @param {number} historyData.user_id - The ID of the user.
 * @param {Date} historyData.timestamp - The timestamp of the history entry.
 * @param {string} historyData.message - The message associated with the history entry.
 * @param {'response' | 'query'} historyData.message_type - The type of the message.
 * @returns {Promise<Object>} 
 *   - **Success:** Returns the newly created environment history record.
 *   - **Failure:** Throws an error if the database insertion fails.
 */
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

/**
 * Deletes environment history records by environment ID and user ID.
 *
 * @async
 * @function deleteEnvironmentHistory
 * @param {number} environmentId - The ID of the environment.
 * @param {number} userId - The ID of the user.
 * @returns {Promise<Array | undefined>} 
 *   - **Success:** Returns an array of deleted environment history records.
 *   - **Failure:** Returns `undefined` if no records are found.
 * @throws {Error} Throws an error if the database deletion fails.
 */
export const deleteEnvironmentHistory = async (environmentId: number, userId: number) => {
  const result = await db.delete(environment_history).where(and(eq(environment_history.environment_id, environmentId), eq(environment_history.user_id, userId))).returning().execute();
  return result;
};
