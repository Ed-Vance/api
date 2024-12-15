import { Request, Response, RequestHandler } from 'express';
import * as clientsService from '../services/clientsService';
 
export const getAllClients: RequestHandler = async (req: Request, res: Response) => {
  try {
    const result = await clientsService.getAllClients();
    res.json(result);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const getClientById: RequestHandler = async (req: Request, res: Response) => {
  const clientId = Number(req.params.id);
  if (isNaN(clientId)) {
    res.status(400).json({ error: 'Invalid client ID' });
    return;
  }

  try {
    const client = await clientsService.getClientById(clientId);
    if (client) {
      res.json(client);
    } else {
      res.status(404).json({ error: 'Client not found' });
    }
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const createClient: RequestHandler = async (req: Request, res: Response) => {
  const { api_key, school_name, subscription_type, start_date, end_date, autorenew } = req.body;
  if (!api_key || !school_name || !subscription_type || !start_date || !end_date || autorenew === undefined) {
    res.status(400).json({ error: 'Missing required fields' });
    return;
  }

  try {
    const newClient = await clientsService.createClient({
      api_key,
      school_name,
      subscription_type,
      start_date: new Date(start_date),
      end_date: new Date(end_date),
      autorenew,
    });
    res.status(201).json(newClient);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const updateClient: RequestHandler = async (req: Request, res: Response) => {
  const clientId = Number(req.params.id);
  if (isNaN(clientId)) {
    res.status(400).json({ error: 'Invalid client ID' });
    return;
  }

  try {
    const updatedClient = await clientsService.updateClient(clientId, req.body);
    if (updatedClient) {
      res.json(updatedClient);
    } else {
      res.status(404).json({ error: 'Client not found' });
    }
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteClient: RequestHandler = async (req: Request, res: Response) => {
  const clientId = Number(req.params.id);
  if (isNaN(clientId)) {
    res.status(400).json({ error: 'Invalid client ID' });
    return;
  }

  try {
    const deletedClient = await clientsService.deleteClient(clientId);
    if (deletedClient) {
      res.json(deletedClient);
    } else {
      res.status(404).json({ error: 'Client not found' });
    }
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};
