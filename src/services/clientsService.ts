import { db } from '../db/drizzle';
import { clients } from '../db/schema/clients';
import { eq } from 'drizzle-orm';

/**
 * Retrieves all clients from the database.
 *
 * @async
 * @function getAllClients
 * @returns {Promise<Array>} 
 *   - **Success:** Returns an array of all client records.
 *   - **Failure:** Throws an error if the database query fails.
 */
export const getAllClients = async () => {
  const result = await db.select().from(clients).execute();
  return result;
};

/**
 * Retrieves a specific client by its ID.
 *
 * @async
 * @function getClientById
 * @param {number} clientId - The ID of the client to retrieve.
 * @returns {Promise<Object | undefined>} 
 *   - **Success:** Returns the client object.
 *   - **Failure:** Returns `undefined` if the client is not found.
 * @throws {Error} Throws an error if the database query fails.
 */
export const getClientById = async (clientId: number) => {
  const result = await db.select().from(clients).where(eq(clients.client_id, clientId)).execute();
  return result[0];
};

/**
 * Creates a new client in the database.
 *
 * @async
 * @function createClient
 * @param {Object} clientData - The data for the new client.
 * @param {string} clientData.api_key - The API key for the client.
 * @param {string} clientData.school_name - The name of the school.
 * @param {'basic' | 'unlimited'} clientData.subscription_type - The type of subscription.
 * @param {Date} clientData.start_date - The start date of the subscription.
 * @param {Date} clientData.end_date - The end date of the subscription.
 * @param {boolean} clientData.autorenew - Indicates if the subscription should auto-renew.
 * @returns {Promise<Object>} 
 *   - **Success:** Returns the newly created client object.
 *   - **Failure:** Throws an error if the database insertion fails.
 */
export const createClient = async (clientData: {
  api_key: string;
  school_name: string;
  subscription_type: 'basic' | 'unlimited';
  start_date: Date;
  end_date: Date;
  autorenew: boolean;
}) => {
  const result = await db.insert(clients).values(clientData).returning().execute();
  return result[0];
};

/**
 * Updates an existing client's information.
 *
 * @async
 * @function updateClient
 * @param {number} clientId - The ID of the client to update.
 * @param {Object} clientData - Partial data to update the client.
 * @param {string} [clientData.api_key] - (Optional) New API key for the client.
 * @param {string} [clientData.school_name] - (Optional) New school name.
 * @param {'basic' | 'unlimited'} [clientData.subscription_type] - (Optional) New subscription type.
 * @param {Date} [clientData.start_date] - (Optional) New start date.
 * @param {Date} [clientData.end_date] - (Optional) New end date.
 * @param {boolean} [clientData.autorenew] - (Optional) New auto-renew status.
 * @returns {Promise<Object | undefined>} 
 *   - **Success:** Returns the updated client object.
 *   - **Failure:** Returns `undefined` if the client is not found.
 * @throws {Error} Throws an error if the database update fails.
 */
export const updateClient = async (
  clientId: number,
  clientData: Partial<{
    api_key: string;
    school_name: string;
    subscription_type: 'basic' | 'unlimited';
    start_date: Date;
    end_date: Date;
    autorenew: boolean;
  }>
) => {
  const result = await db.update(clients).set(clientData).where(eq(clients.client_id, clientId)).returning().execute();
  return result[0];
};

/**
 * Deletes a client from the database.
 *
 * @async
 * @function deleteClient
 * @param {number} clientId - The ID of the client to delete.
 * @returns {Promise<Object | undefined>} 
 *   - **Success:** Returns the deleted client object.
 *   - **Failure:** Returns `undefined` if the client is not found.
 * @throws {Error} Throws an error if the database deletion fails.
 */
export const deleteClient = async (clientId: number) => {
  const result = await db.delete(clients).where(eq(clients.client_id, clientId)).returning().execute();
  return result[0];
};
