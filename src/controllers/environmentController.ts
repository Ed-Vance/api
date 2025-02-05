import { Request, Response, RequestHandler } from 'express';
import * as environmentService from '../services/environmentService';

/**
 * Retrieves all environments from the database.
 *
 * @async
 * @function getAllEnvironments
 * @param {Request} req - Express request object.
 * @param {Response} res - Express response object used to send back the response.
 * @returns {Promise<void>} 
 *   - **Success:** Sends a JSON array of all environments.
 *   - **Failure:** Sends a JSON response with an error message and HTTP 500 status.
 */
export const getAllEnvironments: RequestHandler = async (req: Request, res: Response) => {
  try {
    const environments = await environmentService.getAllEnvironments();
    res.json(environments);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * Retrieves a specific environment by its ID.
 *
 * @async
 * @function getEnvironmentById
 * @param {Request} req - Express request object containing `id` parameter.
 * @param {Response} res - Express response object used to send back the response.
 * @returns {Promise<void>} 
 *   - **Success:** Sends a JSON object of the requested environment.
 *   - **Failure:** Sends a JSON response with an error message and appropriate HTTP status.
 */
export const getEnvironmentById: RequestHandler = async (req: Request, res: Response) => {
  const environmentId = Number(req.params.id);
  if (isNaN(environmentId)) {
    res.status(400).json({ error: 'Invalid environment ID' });
    return;
  }

  try {
    const environment = await environmentService.getEnvironmentById(environmentId);
    if (environment) {
      res.json(environment);
    } else {
      res.status(404).json({ error: 'Environment not found' });
    }
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * Creates a new environment in the database.
 *
 * @async
 * @function createEnvironment
 * @param {Request} req - Express request object containing environment details in the body.
 * @param {Response} res - Express response object used to send back the response.
 * @returns {Promise<void>} 
 *   - **Success:** Sends a JSON object of the newly created environment with HTTP 201 status.
 *   - **Failure:** Sends a JSON response with an error message and appropriate HTTP status.
 */
export const createEnvironment: RequestHandler = async (req: Request, res: Response) => {
  const { class_id, environment_name, environment_description, settings, active_status } = req.body;
  if (!class_id || !environment_name || !environment_description || settings === undefined || active_status === undefined) {
    res.status(400).json({ error: 'Missing required fields' });
    return;
  }

  try {
    const newEnvironment = await environmentService.createEnvironment({
      class_id,
      environment_name,
      environment_description,
      settings,
      active_status,
    });
    res.status(201).json(newEnvironment);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * Updates an existing environment's information.
 *
 * @async
 * @function updateEnvironment
 * @param {Request} req - Express request object containing `id` parameter and updated environment data in the body.
 * @param {Response} res - Express response object used to send back the response.
 * @returns {Promise<void>} 
 *   - **Success:** Sends a JSON object of the updated environment.
 *   - **Failure:** Sends a JSON response with an error message and appropriate HTTP status.
 */
export const updateEnvironment: RequestHandler = async (req: Request, res: Response) => {
  const environmentId = Number(req.params.id);
  if (isNaN(environmentId)) {
    res.status(400).json({ error: 'Invalid environment ID' });
    return;
  }

  try {
    const updatedEnvironment = await environmentService.updateEnvironment(environmentId, req.body);
    if (updatedEnvironment) {
      res.json(updatedEnvironment);
    } else {
      res.status(404).json({ error: 'Environment not found' });
    }
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * Deletes an environment from the database.
 *
 * @async
 * @function deleteEnvironment
 * @param {Request} req - Express request object containing `id` parameter.
 * @param {Response} res - Express response object used to send back the response.
 * @returns {Promise<void>} 
 *   - **Success:** Sends a JSON object of the deleted environment.
 *   - **Failure:** Sends a JSON response with an error message and appropriate HTTP status.
 */
export const deleteEnvironment: RequestHandler = async (req: Request, res: Response) => {
  const environmentId = Number(req.params.id);
  if (isNaN(environmentId)) {
    res.status(400).json({ error: 'Invalid environment ID' });
    return;
  }

  try {
    const deletedEnvironment = await environmentService.deleteEnvironment(environmentId);
    if (deletedEnvironment) {
      res.json(deletedEnvironment);
    } else {
      res.status(404).json({ error: 'Environment not found' });
    }
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};
