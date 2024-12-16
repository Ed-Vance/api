import { Request, Response, RequestHandler } from 'express';
import * as environmentHistoryService from '../services/environmentHistoryService';


/**
 * Retrieves all environment history records from the database.
 *
 * @async
 * @function getAllEnvironmentHistories
 * @param {Request} req - Express request object.
 * @param {Response} res - Express response object used to send back the response.
 * @returns {Promise<void>} 
 *   - **Success:** Sends a JSON array of all environment history records.
 *   - **Failure:** Sends a JSON response with an error message and HTTP 500 status.
 */
export const getAllEnvironmentHistories: RequestHandler = async (req: Request, res: Response) => {
  try {
    const histories = await environmentHistoryService.getAllEnvironmentHistories();
    res.json(histories);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * Retrieves environment history records by environment ID and user ID.
 *
 * @async
 * @function getEnvironmentHistoryByIds
 * @param {Request} req - Express request object containing `environmentId` and `userId` parameters.
 * @param {Response} res - Express response object used to send back the response.
 * @returns {Promise<void>} 
 *   - **Success:** Sends a JSON array of environment history records.
 *   - **Failure:** Sends a JSON response with an error message and appropriate HTTP status.
 */
export const getEnvironmentHistoryByIds: RequestHandler = async (req: Request, res: Response) => {
  const environmentId = Number(req.params.environmentId);
  const userId = Number(req.params.userId);

  if (isNaN(environmentId) || isNaN(userId)) {
    res.status(400).json({ error: 'Invalid environment ID or user ID' });
    return;
  }

  try {
    const history = await environmentHistoryService.getEnvironmentHistoryByIds(environmentId, userId);
    if (history && history.length > 0) {
      res.json(history);
    } else {
      res.status(404).json({ error: 'Environment history not found' });
    }
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * Creates a new environment history record in the database.
 *
 * @async
 * @function createEnvironmentHistory
 * @param {Request} req - Express request object containing `environment_id`, `user_id`, `timestamp`, `message`, and `message_type` in the body.
 * @param {Response} res - Express response object used to send back the response.
 * @returns {Promise<void>} 
 *   - **Success:** Sends a JSON object of the newly created environment history with HTTP 201 status.
 *   - **Failure:** Sends a JSON response with an error message and appropriate HTTP status.
 */
export const createEnvironmentHistory: RequestHandler = async (req: Request, res: Response) => {
  const { environment_id, user_id, timestamp, message, message_type } = req.body;
  if (!environment_id || !user_id || !timestamp || !message || !message_type) {
    res.status(400).json({ error: 'Missing required fields' });
    return;
  }

  try {
    const newHistory = await environmentHistoryService.createEnvironmentHistory({
      environment_id,
      user_id,
      timestamp: new Date(timestamp),
      message,
      message_type,
    });
    res.status(201).json(newHistory);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * Deletes environment history records by environment ID and user ID.
 *
 * @async
 * @function deleteEnvironmentHistory
 * @param {Request} req - Express request object containing `environmentId` and `userId` parameters.
 * @param {Response} res - Express response object used to send back the response.
 * @returns {Promise<void>} 
 *   - **Success:** Sends a JSON array of deleted environment history records.
 *   - **Failure:** Sends a JSON response with an error message and appropriate HTTP status.
 */
export const deleteEnvironmentHistory: RequestHandler = async (req: Request, res: Response) => {
  const environmentId = Number(req.params.environmentId);
  const userId = Number(req.params.userId);

  if (isNaN(environmentId) || isNaN(userId)) {
    res.status(400).json({ error: 'Invalid environment ID or user ID' });
    return;
  }

  try {
    const deletedHistory = await environmentHistoryService.deleteEnvironmentHistory(environmentId, userId);
    if (deletedHistory && deletedHistory.length > 0) {
      res.json(deletedHistory);
    } else {
      res.status(404).json({ error: 'Environment history not found' });
    }
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};
