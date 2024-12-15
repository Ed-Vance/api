import { db } from '../db/drizzle';
import { class_users } from '../db/schema/class_users';
import { and, eq } from 'drizzle-orm';

export const getAllClassUsers = async () => {
  const result = await db.select().from(class_users).execute();
  return result;
};
 
export const getClassUserByIds = async (classId: number, userId: number) => {
  const result = await db.select().from(class_users).where(and(eq(class_users.class_id, classId), eq(class_users.user_id, userId))).execute();
  return result[0];
};

export const createClassUser = async (classUserData: {
  class_id: number;
  user_id: number;
  role: 'student' | 'teacher' | 'admin';
}) => {
  const result = await db.insert(class_users).values(classUserData).returning().execute();
  return result[0];
};

export const updateClassUser = async (
  classId: number,
  userId: number,
  role: 'student' | 'teacher' | 'admin'
) => {
  const result = await db.update(class_users).set({ role }).where(and(eq(class_users.class_id, classId), eq(class_users.user_id, userId))).returning().execute();
  return result[0];
};

export const deleteClassUser = async (classId: number, userId: number) => {
  const result = await db.delete(class_users).where(and(eq(class_users.class_id, classId), eq(class_users.user_id, userId))).returning().execute();
  return result[0];
};
