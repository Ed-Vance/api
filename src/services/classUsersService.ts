import { db } from '../db/drizzle';
import { class_users } from '../db/schema/class_users';
import { and, eq } from 'drizzle-orm';

/**
 * Retrieves all class-user associations from the database.
 *
 * @async
 * @function getAllClassUsers
 * @returns {Promise<Array>} 
 *   - **Success:** Returns an array of all class-user association records.
 *   - **Failure:** Throws an error if the database query fails.
 */
export const getAllClassUsers = async () => {
  const result = await db.select().from(class_users).execute();
  return result;
};
 

/**
 * Retrieves a specific class-user association by class ID and user ID.
 *
 * @async
 * @function getClassUserByIds
 * @param {number} classId - The ID of the class.
 * @param {number} userId - The ID of the user.
 * @returns {Promise<Object | undefined>} 
 *   - **Success:** Returns the class-user association object.
 *   - **Failure:** Returns `undefined` if the association is not found.
 * @throws {Error} Throws an error if the database query fails.
 */
export const getClassUserByIds = async (classId: number, userId: number) => {
  const result = await db.select().from(class_users).where(and(eq(class_users.class_id, classId), eq(class_users.user_id, userId))).execute();
  return result[0];
};

/**
 * Creates a new class-user association in the database.
 *
 * @async
 * @function createClassUser
 * @param {Object} classUserData - The data for the new class-user association.
 * @param {number} classUserData.class_id - The ID of the class.
 * @param {number} classUserData.user_id - The ID of the user.
 * @param {'student' | 'teacher' | 'admin'} classUserData.role - The role of the user in the class.
 * @returns {Promise<Object>} 
 *   - **Success:** Returns the newly created class-user association object.
 *   - **Failure:** Throws an error if the database insertion fails.
 */
export const createClassUser = async (classUserData: {
  class_id: number;
  user_id: number;
  role: 'student' | 'teacher' | 'admin';
}) => {
  const result = await db.insert(class_users).values(classUserData).returning().execute();
  return result[0];
};

/**
 * Updates the role of a user in a specific class.
 *
 * @async
 * @function updateClassUser
 * @param {number} classId - The ID of the class.
 * @param {number} userId - The ID of the user.
 * @param {'student' | 'teacher' | 'admin'} role - The new role of the user in the class.
 * @returns {Promise<Object | undefined>} 
 *   - **Success:** Returns the updated class-user association object.
 *   - **Failure:** Returns `undefined` if the association is not found.
 * @throws {Error} Throws an error if the database update fails.
 */
export const updateClassUser = async (
  classId: number,
  userId: number,
  role: 'student' | 'teacher' | 'admin'
) => {
  const result = await db.update(class_users).set({ role }).where(and(eq(class_users.class_id, classId), eq(class_users.user_id, userId))).returning().execute();
  return result[0];
};


/**
 * Deletes a class-user association from the database.
 *
 * @async
 * @function deleteClassUser
 * @param {number} classId - The ID of the class.
 * @param {number} userId - The ID of the user.
 * @returns {Promise<Object | undefined>} 
 *   - **Success:** Returns the deleted class-user association object.
 *   - **Failure:** Returns `undefined` if the association is not found.
 * @throws {Error} Throws an error if the database deletion fails.
 */
export const deleteClassUser = async (classId: number, userId: number) => {
  const result = await db.delete(class_users).where(and(eq(class_users.class_id, classId), eq(class_users.user_id, userId))).returning().execute();
  return result[0];
};
