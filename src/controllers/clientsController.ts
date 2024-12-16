import { Request, Response, RequestHandler } from 'express';
import * as clientsService from '../services/clientsService';

/**
 * Retrieves all clients from the database.
 *
 * @async
 * @function getAllClients
 * @param {Request} req - Express request object.
 * @param {Response} res - Express response object used to send back the response.
 * @returns {Promise<void>} 
 *   - **Success:** Sends a JSON array of all clients.
 *   - **Failure:** Sends a JSON response with an error message and HTTP 500 status.
 */
export const getAllClients: RequestHandler = async (req: Request, res: Response) => {
  try {
    const result = await clientsService.getAllClients();
    res.json(result);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * Retrieves a specific client by its ID.
 *
 * @async
 * @function getClientById
 * @param {Request} req - Express request object containing `id` parameter.
 * @param {Response} res - Express response object used to send back the response.
 * @returns {Promise<void>} 
 *   - **Success:** Sends a JSON object of the requested client.
 *   - **Failure:** Sends a JSON response with an error message and appropriate HTTP status.
 */
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

/**
 * Creates a new client in the database.
 *
 * @async
 * @function createClient
 * @param {Request} req - Express request object containing client details in the body.
 * @param {Response} res - Express response object used to send back the response.
 * @returns {Promise<void>} 
 *   - **Success:** Sends a JSON object of the newly created client with HTTP 201 status.
 *   - **Failure:** Sends a JSON response with an error message and appropriate HTTP status.
 */
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


/**
 * Updates an existing client's information.
 *
 * @async
 * @function updateClient
 * @param {Request} req - Express request object containing `id` parameter and updated client data in the body.
 * @param {Response} res - Express response object used to send back the response.
 * @returns {Promise<void>} 
 *   - **Success:** Sends a JSON object of the updated client.
 *   - **Failure:** Sends a JSON response with an error message and appropriate HTTP status.
 */
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

/**
 * Deletes a client from the database.
 *
 * @async
 * @function deleteClient
 * @param {Request} req - Express request object containing `id` parameter.
 * @param {Response} res - Express response object used to send back the response.
 * @returns {Promise<void>} 
 *   - **Success:** Sends a JSON object of the deleted client.
 *   - **Failure:** Sends a JSON response with an error message and appropriate HTTP status.
 */
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
