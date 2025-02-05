import { db } from '../db/drizzle';
import { classes } from '../db/schema/classes';
import { environment } from '../db/schema/environment';
import { class_users } from '../db/schema/class_users';
import { users } from '../db/schema/users';
import { eq } from 'drizzle-orm';

/**
 * Retrieves all classes from the database.
 *
 * @async
 * @function getAllClasses
 * @returns {Promise<Array>} 
 *   - **Success:** Returns an array of all class records.
 *   - **Failure:** Throws an error if the database query fails.
 */
export const getAllClasses = async () => {
  const result = await db.select().from(classes).execute();
  return result;
};

/**
 * Retrieves a specific class by its ID.
 *
 * @async
 * @function getClassById
 * @param {number} classId - The ID of the class to retrieve.
 * @returns {Promise<Object | undefined>} 
 *   - **Success:** Returns the class object if found.
 *   - **Failure:** Returns `undefined` if the class is not found.
 * @throws {Error} Throws an error if the database query fails.
 */
export const getClassById = async (classId: number) => {
  const result = await db.select().from(classes).where(eq(classes.class_id, classId)).execute();
  return result[0];
};

/**
 * Creates a new class in the database.
 *
 * @async
 * @function createClass
 * @param {Object} classData - The data for the new class.
 * @param {string} classData.class_name - The name of the class.
 * @param {string} classData.class_reference - A reference identifier for the class.
 * @param {number} classData.license_id - The associated license ID.
 * @returns {Promise<Object>} 
 *   - **Success:** Returns the newly created class object.
 *   - **Failure:** Throws an error if the database insertion fails.
 */
export const createClass = async (classData: {
  class_name: string;
  class_reference: string;
  license_id: number;
}) => {
  const result = await db.insert(classes).values(classData).returning().execute();
  return result[0];
};

/**
 * Updates an existing class's information.
 *
 * @async
 * @function updateClass
 * @param {number} classId - The ID of the class to update.
 * @param {Object} classData - Partial data to update the class.
 * @param {string} [classData.class_name] - (Optional) New name for the class.
 * @param {string} [classData.class_reference] - (Optional) New reference for the class.
 * @param {number} [classData.license_id] - (Optional) New license ID for the class.
 * @returns {Promise<Object | undefined>} 
 *   - **Success:** Returns the updated class object.
 *   - **Failure:** Returns `undefined` if the class is not found.
 * @throws {Error} Throws an error if the database update fails.
 */
export const updateClass = async (
  classId: number,
  classData: Partial<{
    class_name: string;
    class_reference: string;
    license_id: number;
  }>
) => {
  const result = await db.update(classes).set(classData).where(eq(classes.class_id, classId)).returning().execute();
  return result[0];
};

/**
 * Deletes a class from the database.
 *
 * @async
 * @function deleteClass
 * @param {number} classId - The ID of the class to delete.
 * @returns {Promise<Object | undefined>} 
 *   - **Success:** Returns the deleted class object.
 *   - **Failure:** Returns `undefined` if the class is not found.
 * @throws {Error} Throws an error if the database deletion fails.
 */
export const deleteClass = async (classId: number) => {
  const result = await db.delete(classes).where(eq(classes.class_id, classId)).returning().execute();
  return result[0];
};

/**
 * Retrieves all environments associated with a specific class.
 *
 * @async
 * @function getClassEnvironments
 * @param {number} classId - The ID of the class.
 * @returns {Promise<Array>} 
 *   - **Success:** Returns an array of environment objects associated with the class.
 *   - **Failure:** Throws an error if the database query fails.
 */
export const getClassEnvironments = async (classId: number) => {
  const result = await db.select().from(environment).where(eq(environment.class_id, classId)).execute();
  return result;
};

/**
 * Retrieves all users associated with a specific class, including their roles.
 *
 * @async
 * @function getClassUsers
 * @param {number} classId - The ID of the class.
 * @returns {Promise<Array>} 
 *   - **Success:** Returns an array of user objects with roles in the class.
 *   - **Failure:** Throws an error if the database query fails.
 */
// Kinda a duplicate but still kept wasnt kinda sure where to go
export const getClassUsers = async (classId: number) => {
  const result = await db.select({user_id: users.user_id, first_name: users.first_name,last_name: users.last_name,email: users.email,role: class_users.role})
  .from(class_users).innerJoin(users, eq(class_users.user_id, users.user_id)).where(eq(class_users.class_id, classId)).execute();
  return result;
};