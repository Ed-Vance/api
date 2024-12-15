import { db } from '../db/drizzle';
import { users } from '../db/schema/users';
import { eq } from 'drizzle-orm';
 
// TODO: use hashing library.
export const checkUserCredentials = async (email: string, password: string) => {
  const result = await db.select().from(users).where(eq(users.email, email)).execute();
  const user = result[0];
  if (!user) return null;

  if (user.password === password) {
    return user;
  }
  return null;
};
