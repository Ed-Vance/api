import { Request, Response, RequestHandler } from 'express';
import * as clientAccountsService from '../services/clientAccountsService';


/**
 * Retrieves all client accounts from the database.
 *
 * @async
 * @function getAllClientAccounts
 * @param {Request} req - Express request object.
 * @param {Response} res - Express response object used to send back the response.
 * @returns {Promise<void>} 
 *   - **Success:** Sends a JSON array of all client accounts.
 *   - **Failure:** Sends a JSON response with an error message and HTTP 500 status.
 */ 
export const getAllClientAccounts: RequestHandler = async (req: Request, res: Response) => {
  try {
    const accounts = await clientAccountsService.getAllClientAccounts();
    res.json(accounts);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * Retrieves a specific client account by client ID and user ID.
 *
 * @async
 * @function getClientAccountByIds
 * @param {Request} req - Express request object containing `clientId` and `userId` parameters.
 * @param {Response} res - Express response object used to send back the response.
 * @returns {Promise<void>} 
 *   - **Success:** Sends a JSON object of the client account.
 *   - **Failure:** Sends a JSON response with an error message and appropriate HTTP status.
 */
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


/**
 * Creates a new client account in the database.
 *
 * @async
 * @function createClientAccount
 * @param {Request} req - Express request object containing `client_id` and `user_id` in the body.
 * @param {Response} res - Express response object used to send back the response.
 * @returns {Promise<void>} 
 *   - **Success:** Sends a JSON object of the newly created client account with HTTP 201 status.
 *   - **Failure:** Sends a JSON response with an error message and appropriate HTTP status.
 */
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

/**
 * Deletes a client account by client ID and user ID.
 *
 * @async
 * @function deleteClientAccount
 * @param {Request} req - Express request object containing `clientId` and `userId` parameters.
 * @param {Response} res - Express response object used to send back the response.
 * @returns {Promise<void>} 
 *   - **Success:** Sends a JSON object of the deleted client account.
 *   - **Failure:** Sends a JSON response with an error message and appropriate HTTP status.
 */
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
