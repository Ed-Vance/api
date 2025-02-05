import { getUserByEmail, createUser } from './usersService';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { User } from '../types/User';
import dotenv from 'dotenv';

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';
const JWT_EXPIRES_IN = '1h';

/**
 * Generates a JWT token for a given user.
 *
 * @function generateToken
 * @param {User} user - The user object.
 * @returns {string} - The JWT token.
 */
const generateToken = (user: User): string => {
  const payload = { user_id: user.user_id, email: user.email,first_name: user.first_name,last_name: user.last_name};
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
};

/**
 * Checks user credentials for login.
 *
 * @async
 * @function checkUserCredentials
 * @param {string} email - The user's email.
 * @param {string} password - The user's plaintext password.
 * @returns {Promise<{ user: User; token: string } | null>} 
 *   - **Success:** Returns the user object and JWT token.
 *   - **Failure:** Returns null if credentials are invalid.
 * @throws {Error} Throws an error if the database query fails.
 */
export const checkUserCredentials = async (email: string, password: string): Promise<{ user: User; token: string } | null> => {
  const user = await getUserByEmail(email);
  if (!user || !user.password) {
    return null;
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    return null;
  }

  const token = generateToken(user);
  return { user, token };
};

/**
 * Signs up a new user.
 *
 * @async
 * @function signup
 * @param {Object} userData - The data for the new user.
 * @param {string} userData.first_name - The first name of the user.
 * @param {string} userData.last_name - The last name of the user.
 * @param {string} userData.email - The email address of the user.
 * @param {string} userData.password - The plaintext password of the user.
 * @param {string} userData.phone - The phone number of the user.
 * @returns {Promise<{ user: User; token: string }>} 
 *   - **Success:** Returns the new user object and JWT token.
 *   - **Failure:** Throws an error if user creation fails.
 */
export const signup = async (userData: {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  phone: string;
}): Promise<{ user: User; token: string }> => {
  // Check if user already exists
  const existingUser = await getUserByEmail(userData.email);
  if (existingUser) {
    throw new Error('User with this email already exists.');
  }

  // Create new user
  const newUser = await createUser(userData);

  // Generate JWT token
  const token = generateToken(newUser);

  return { user: newUser, token };
};
