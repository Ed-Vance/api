import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import * as usersService from './usersService';

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  throw new Error('JWT_SECRET is not defined in the environment variables');
}

interface UserWithoutPassword {
  user_id: number;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
}

/**
 * Validates user credentials and generates a JWT token upon successful authentication.
 *
 * @async
 * @function checkUserCredentials
 * @param {string} email - The user's email address.
 * @param {string} password - The user's plaintext password.
 * @returns {Promise<{ user: UserWithoutPassword; token: string } | null>} 
 *   - **Success:** Returns an object containing the user data (excluding password) and a JWT token.
 *   - **Failure:** Returns `null` if authentication fails.
 * @throws {Error} Throws an error if JWT_SECRET is not defined or if any database operation fails.
 */
export const checkUserCredentials = async (email: string, password: string) => {
  console.log("Checking")
  const user = await usersService.getUserByEmail(email);
  
  if (!user) return null;

  const isMatch = await bcrypt.compare(password, user.password);
  if (isMatch) {
    const { password: _, ...userWithoutPassword } = user;
    
    const token = jwt.sign(
      {
        user_id: userWithoutPassword.user_id,
        email: userWithoutPassword.email,
        first_name: userWithoutPassword.first_name,
        last_name: userWithoutPassword.last_name,
      },
      JWT_SECRET,
      { expiresIn: '1h' }
    );
    return { user: userWithoutPassword, token };
  }
  
  return null;
};

/**
 * Handles user signup by creating a new user and generating a JWT token.
 *
 * @async
 * @function signup
 * @param {Object} userData - The data for the new user.
 * @param {string} userData.first_name - The first name of the user.
 * @param {string} userData.last_name - The last name of the user.
 * @param {string} userData.email - The email address of the user.
 * @param {string} userData.password - The plaintext password of the user.
 * @param {string} userData.phone - The phone number of the user.
 * @returns {Promise<{ user: UserWithoutPassword; token: string }>} 
 *   - **Success:** Returns an object containing the user data (excluding password) and a JWT token.
 *   - **Failure:** Throws an error if the email already exists or if any database operation fails.
 */
export const signup = async (userData: {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  phone: string;
}) => {
  // Check if user with email already exists
  const existingUser = await usersService.getUserByEmail(userData.email);
  if (existingUser) {
    throw new Error('User with this email already exists.');
  }

  // Create user
  const newUser = await usersService.createUser(userData);

  // Generate JWT token
  const token = jwt.sign(
    {
      user_id: newUser.user_id,
      email: newUser.email,
      first_name: newUser.first_name,
      last_name: newUser.last_name,
    },
    JWT_SECRET,
    { expiresIn: '1h' }
  );

  return { user: newUser, token };
};
