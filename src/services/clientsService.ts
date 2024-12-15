import { db } from '../db/drizzle';
import { clients } from '../db/schema/clients';
import { eq } from 'drizzle-orm';

export const getAllClients = async () => {
  const result = await db.select().from(clients).execute();
  return result;
};

export const getClientById = async (clientId: number) => {
  const result = await db
    .select()
    .from(clients)
    .where(eq(clients.client_id, clientId))
    .execute();

  return result[0];
};
 
export const createClient = async (clientData: {
  api_key: string;
  school_name: string;
  subscription_type: 'basic' | 'unlimited';
  start_date: Date;
  end_date: Date;
  autorenew: boolean;
}) => {
  const result = await db.insert(clients).values(clientData).returning().execute();
  return result[0];
};

export const updateClient = async (
  clientId: number,
  clientData: Partial<{
    api_key: string;
    school_name: string;
    subscription_type: 'basic' | 'unlimited';
    start_date: Date;
    end_date: Date;
    autorenew: boolean;
  }>
) => {
  const result = await db.update(clients).set(clientData).where(eq(clients.client_id, clientId)).returning().execute();
  return result[0];
};

export const deleteClient = async (clientId: number) => {
  const result = await db.delete(clients).where(eq(clients.client_id, clientId)).returning().execute();
  return result[0];
};
