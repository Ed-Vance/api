import { Request, Response, RequestHandler } from 'express';
import * as clientAccountsService from '../services/clientAccountsService';
 
export const getAllClientAccounts: RequestHandler = async (req: Request, res: Response) => {
  try {
    const accounts = await clientAccountsService.getAllClientAccounts();
    res.json(accounts);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const getClientAccountByIds: RequestHandler = async (req: Request, res: Response) => {
  const clientId = Number(req.params.clientId);
  const userId = Number(req.params.userId);

  if (isNaN(clientId) || isNaN(userId)) {
    res.status(400).json({ error: 'Invalid client ID or user ID' });
    return;
  }

  try {
    const account = await clientAccountsService.getClientAccountByIds(clientId, userId);
    if (account) {
      res.json(account);
    } else {
      res.status(404).json({ error: 'Client account not found' });
    }
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const createClientAccount: RequestHandler = async (req: Request, res: Response) => {
  const { client_id, user_id } = req.body;
  if (!client_id || !user_id) {
    res.status(400).json({ error: 'Missing required fields' });
    return;
  }

  try {
    const newAccount = await clientAccountsService.createClientAccount({ client_id, user_id });
    res.status(201).json(newAccount);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteClientAccount: RequestHandler = async (req: Request, res: Response) => {
  const clientId = Number(req.params.clientId);
  const userId = Number(req.params.userId);

  if (isNaN(clientId) || isNaN(userId)) {
    res.status(400).json({ error: 'Invalid client ID or user ID' });
    return;
  }

  try {
    const deletedAccount = await clientAccountsService.deleteClientAccount(clientId, userId);
    if (deletedAccount) {
      res.json(deletedAccount);
    } else {
      res.status(404).json({ error: 'Client account not found' });
    }
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};
