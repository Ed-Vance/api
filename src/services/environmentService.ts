import { db } from '../db/drizzle';
import { environment } from '../db/schema/environment';
import { eq } from 'drizzle-orm';


/**
 * Retrieves all environments from the database.
 *
 * @async
 * @function getAllEnvironments
 * @returns {Promise<Array>} 
 *   - **Success:** Returns an array of all environment records.
 *   - **Failure:** Throws an error if the database query fails.
 */
export const getAllEnvironments = async () => {
  const result = await db.select().from(environment).execute();
  return result;
};

/**
 * Retrieves a specific environment by its ID.
 *
 * @async
 * @function getEnvironmentById
 * @param {number} environmentId - The ID of the environment to retrieve.
 * @returns {Promise<Object | undefined>} 
 *   - **Success:** Returns the environment object.
 *   - **Failure:** Returns `undefined` if the environment is not found.
 * @throws {Error} Throws an error if the database query fails.
 */
export const getEnvironmentById = async (environmentId: number) => {
  const result = await db.select().from(environment).where(eq(environment.environment_id, environmentId)).execute();
  return result[0];
};

/**
 * Creates a new environment in the database.
 *
 * @async
 * @function createEnvironment
 * @param {Object} environmentData - The data for the new environment.
 * @param {number} environmentData.class_id - The ID of the associated class.
 * @param {string} environmentData.environment_name - The name of the environment.
 * @param {string} environmentData.environment_description - A description of the environment.
 * @param {object} environmentData.settings - Configuration settings for the environment.
 * @param {boolean} environmentData.active_status - Indicates if the environment is active.
 * @returns {Promise<Object>} 
 *   - **Success:** Returns the newly created environment object.
 *   - **Failure:** Throws an error if the database insertion fails.
 */
export const createEnvironment = async (environmentData: {
  class_id: number;
  environment_name: string;
  environment_description: string;
  settings: object;
  active_status: boolean;
}) => {
  const result = await db.insert(environment).values(environmentData).returning().execute();
  return result[0];
};
 
/**
 * Updates an existing environment's information.
 *
 * @async
 * @function updateEnvironment
 * @param {number} environmentId - The ID of the environment to update.
 * @param {Object} environmentData - Partial data to update the environment.
 * @param {number} [environmentData.class_id] - (Optional) New associated class ID.
 * @param {string} [environmentData.environment_name] - (Optional) New name for the environment.
 * @param {string} [environmentData.environment_description] - (Optional) New description.
 * @param {object} [environmentData.settings] - (Optional) New configuration settings.
 * @param {boolean} [environmentData.active_status] - (Optional) New active status.
 * @returns {Promise<Object | undefined>} 
 *   - **Success:** Returns the updated environment object.
 *   - **Failure:** Returns `undefined` if the environment is not found.
 * @throws {Error} Throws an error if the database update fails.
 */
export const updateEnvironment = async (
  environmentId: number,
  environmentData: Partial<{
    class_id: number;
    environment_name: string;
    environment_description: string;
    settings: object;
    active_status: boolean;
  }>
) => {
  const result = await db.update(environment).set(environmentData).where(eq(environment.environment_id, environmentId)).returning().execute();
  return result[0];
};

/**
 * Deletes an environment from the database.
 *
 * @async
 * @function deleteEnvironment
 * @param {number} environmentId - The ID of the environment to delete.
 * @returns {Promise<Object | undefined>} 
 *   - **Success:** Returns the deleted environment object.
 *   - **Failure:** Returns `undefined` if the environment is not found.
 * @throws {Error} Throws an error if the database deletion fails.
 */
export const deleteEnvironment = async (environmentId: number) => {
  const result = await db.delete(environment).where(eq(environment.environment_id, environmentId)).returning().execute();
  return result[0];
};
