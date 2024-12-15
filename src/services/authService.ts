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
export const checkUserCredentials = async (email: string, password: string) => {
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
