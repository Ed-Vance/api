import { db } from '../db/drizzle';
import { classes } from '../db/schema/classes';
import { environment } from '../db/schema/environment';
import { class_users } from '../db/schema/class_users';
import { users } from '../db/schema/users';
import { eq } from 'drizzle-orm';

// Get all
export const getAllClasses = async () => {
  const result = await db.select().from(classes).execute();
  return result;
};

// Get
export const getClassById = async (classId: number) => {
  const result = await db.select().from(classes).where(eq(classes.class_id, classId)).execute();
  return result[0];
};

// Create
export const createClass = async (classData: {
  class_name: string;
  class_reference: string;
  license_id: number;
}) => {
  const result = await db.insert(classes).values(classData).returning().execute();
  return result[0];
};

// Self explainatory
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
 
export const deleteClass = async (classId: number) => {
  const result = await db.delete(classes).where(eq(classes.class_id, classId)).returning().execute();
  return result[0];
};


export const getClassEnvironments = async (classId: number) => {
  const result = await db.select().from(environment).where(eq(environment.class_id, classId)).execute();
  return result;
};

// Kinda a duplicate but still kept wasnt kinda sure where to go
export const getClassUsers = async (classId: number) => {
  const result = await db.select({user_id: users.user_id, first_name: users.first_name,last_name: users.last_name,email: users.email,role: class_users.role})
  .from(class_users)
  .innerJoin(users, eq(class_users.user_id, users.user_id))
  .where(eq(class_users.class_id, classId)).execute();
  return result;
};