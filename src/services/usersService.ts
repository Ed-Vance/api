import { db } from '../db/drizzle';
import { users } from '../db/schema/users';
import { classes } from '../db/schema/classes';
import { class_users } from '../db/schema/class_users';
import { eq } from 'drizzle-orm';
import bcrypt from 'bcrypt';

const SALT_ROUNDS = 10; 

/**
 * Retrieves all users from the database.
 *
 * @async
 * @function getAllUsers
 * @returns {Promise<Array>} 
 *   - **Success:** Returns an array of all user records.
 *   - **Failure:** Throws an error if the database query fails.
 */
export const getAllUsers = async () => {
  const result = await db.select().from(users).execute();
  return result.map(({ password, ...user }) => user);
};

/**
 * Retrieves a specific user by their ID.
 *
 * @async
 * @function getUserById
 * @param {number} userId - The ID of the user to retrieve.
 * @returns {Promise<Object | undefined>} 
 *   - **Success:** Returns the user object.
 *   - **Failure:** Returns `undefined` if the user is not found.
 * @throws {Error} Throws an error if the database query fails.
 */
export const getUserById = async (userId: number) => {
  const result = await db.select().from(users).where(eq(users.user_id, userId)).execute();
  const user = result[0];
  if (user) {
    return user;
  }
  return undefined;
};

/**
 * Retrieves a user by their email address.
 *
 * @async
 * @function getUserByEmail
 * @param {string} email - The email address of the user to retrieve.
 * @returns {Promise<Object | undefined>} 
 *   - **Success:** Returns the user object.
 *   - **Failure:** Returns `undefined` if the user is not found.
 * @throws {Error} Throws an error if the database query fails.
 */
export const getUserByEmail = async (email: string) => {
  const result = await db.select().from(users).where(eq(users.email, email)).execute();
  const user = result[0];
  if (user) {
    return user;
  }
  return undefined;
};

/**
 * Creates a new user in the database with a hashed password.
 *
 * @async
 * @function createUser
 * @param {Object} userData - The data for the new user.
 * @param {string} userData.first_name - The first name of the user.
 * @param {string} userData.last_name - The last name of the user.
 * @param {string} userData.email - The email address of the user.
 * @param {string} userData.password - The plaintext password of the user.
 * @param {string} userData.phone - The phone number of the user.
 * @returns {Promise<Object>} 
 *   - **Success:** Returns the newly created user object (excluding password).
 *   - **Failure:** Throws an error if the database insertion or password hashing fails.
 */
export const createUser = async (userData: {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  phone: string;
}) => {
  const hashedPassword = await bcrypt.hash(userData.password, SALT_ROUNDS);
  const result = await db.insert(users).values({
    ...userData,
    password: hashedPassword,
  }).returning().execute();
  const { password, ...userWithoutPassword } = result[0];
  return userWithoutPassword;
};

/**
 * Updates an existing user's information, optionally hashing a new password.
 *
 * @async
 * @function updateUser
 * @param {number} userId - The ID of the user to update.
 * @param {Object} userData - Partial data to update the user.
 * @param {string} [userData.first_name] - (Optional) New first name.
 * @param {string} [userData.last_name] - (Optional) New last name.
 * @param {string} [userData.email] - (Optional) New email address.
 * @param {string} [userData.password] - (Optional) New plaintext password.
 * @param {string} [userData.phone] - (Optional) New phone number.
 * @returns {Promise<Object | undefined>} 
 *   - **Success:** Returns the updated user object.
 *   - **Failure:** Returns `undefined` if the user is not found.
 * @throws {Error} Throws an error if the database update or password hashing fails.
 */
export const updateUser = async (
  userId: number,
  userData: Partial<{
    first_name: string;
    last_name: string;
    email: string;
    password: string;
    phone: string;
  }>
) => {
  if (userData.password) {
    userData.password = await bcrypt.hash(userData.password, SALT_ROUNDS);
  }

  const result = await db.update(users).set(userData).where(eq(users.user_id, userId)).returning().execute();
  const updatedUser = result[0];
  if (updatedUser) {
    const { password, ...userWithoutPassword } = updatedUser;
    return userWithoutPassword;
  }
  return undefined;
};

/**
 * Deletes a user from the database.
 *
 * @async
 * @function deleteUser
 * @param {number} userId - The ID of the user to delete.
 * @returns {Promise<Object | undefined>} 
 *   - **Success:** Returns the deleted user object.
 *   - **Failure:** Returns `undefined` if the user is not found.
 * @throws {Error} Throws an error if the database deletion fails.
 */
export const deleteUser = async (userId: number) => {
  const result = await db.delete(users).where(eq(users.user_id, userId)).returning().execute();
  const deletedUser = result[0];
  if (deletedUser) {
    const { password, ...userWithoutPassword } = deletedUser;
    return userWithoutPassword;
  }
  return undefined;
};

/**
 * Retrieves all classes associated with a specific user, including their roles.
 *
 * @async
 * @function getUserClasses
 * @param {number} userId - The ID of the user.
 * @returns {Promise<Array>} 
 *   - **Success:** Returns an array of classes with the user's roles.
 *   - **Failure:** Throws an error if the database query fails.
 */
export const getUserClasses = async (userId: number) => {
  const result = await db.select({
      class_id: classes.class_id,
      class_name: classes.class_name,
      class_reference: classes.class_reference,
      role: class_users.role
    }).from(class_users)
    .innerJoin(classes, eq(class_users.class_id, classes.class_id))
    .where(eq(class_users.user_id, userId)).execute();
  return result;
};
