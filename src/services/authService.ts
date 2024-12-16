import { db } from '../db/drizzle';
import { users } from '../db/schema/users';
import { eq } from 'drizzle-orm';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

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
  const result = await db.select().from(users).where(eq(users.email, email)).execute();
  const user = result[0];
  
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
