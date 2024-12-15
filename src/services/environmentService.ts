import { db } from '../db/drizzle';
import { environment } from '../db/schema/environment';
import { eq } from 'drizzle-orm';

export const getAllEnvironments = async () => {
  const result = await db.select().from(environment).execute();
  return result;
};

export const getEnvironmentById = async (environmentId: number) => {
  const result = await db.select().from(environment).where(eq(environment.environment_id, environmentId)).execute();
  return result[0];
};

export const createEnvironment = async (environmentData: {
  class_id: number;
  environment_name: string;
  environment_description: string;
  settings: object;
  active_status: boolean;
}) => {
  const result = await db.insert(environment).values(environmentData).returning().execute();
  return result[0];
};
 
export const updateEnvironment = async (
  environmentId: number,
  environmentData: Partial<{
    class_id: number;
    environment_name: string;
    environment_description: string;
    settings: object;
    active_status: boolean;
  }>
) => {
  const result = await db.update(environment).set(environmentData).where(eq(environment.environment_id, environmentId)).returning().execute();
  return result[0];
};

export const deleteEnvironment = async (environmentId: number) => {
  const result = await db.delete(environment).where(eq(environment.environment_id, environmentId)).returning().execute();
  return result[0];
};
