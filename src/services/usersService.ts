import { db } from '../db/drizzle';
import { users } from '../db/schema/users';
import { classes } from '../db/schema/classes';
import { class_users } from '../db/schema/class_users';
import { eq } from 'drizzle-orm';
import bcrypt from 'bcrypt';

const SALT_ROUNDS = 10; 

export const getAllUsers = async () => {
  const result = await db.select().from(users).execute();
  return result;
};

export const getUserById = async (userId: number) => {
  const result = await db.select().from(users).where(eq(users.user_id, userId)).execute();
  return result[0];
};

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
  return result[0];
};

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
  return result[0];
};

export const deleteUser = async (userId: number) => {
  const result = await db.delete(users).where(eq(users.user_id, userId)).returning().execute();
  return result[0];
};

export const getUserClasses = async (userId: number) => {
  const result = await db.select({
      class_id: classes.class_id,
      class_name: classes.class_name,
      class_reference: classes.class_reference,
      role: class_users.role
    }).from(class_users).innerJoin(classes, eq(class_users.class_id, classes.class_id)).where(eq(class_users.user_id, userId)).execute();
  return result;
};
 