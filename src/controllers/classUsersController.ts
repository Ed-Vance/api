import { Request, Response, RequestHandler } from 'express';
import * as classUsersService from '../services/classUsersService';
 
/**
 * Retrieves all class-user associations.
 *
 * @async
 * @function getAllClassUsers
 * @param {Request} req - Express request object.
 * @param {Response} res - Express response object used to send back the response.
 * @returns {Promise<void>} 
 *   - **Success:** Sends a JSON array of all class-user associations.
 *   - **Failure:** Sends a JSON response with an error message and HTTP 500 status.
 */
export const getAllClassUsers: RequestHandler = async (req: Request, res: Response) => {
  try {
    const result = await classUsersService.getAllClassUsers();
    res.json(result);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};


/**
 * Retrieves a specific class-user association by class ID and user ID.
 *
 * @async
 * @function getClassUserByIds
 * @param {Request} req - Express request object containing `classId` and `userId` parameters.
 * @param {Response} res - Express response object used to send back the response.
 * @returns {Promise<void>} 
 *   - **Success:** Sends a JSON object of the class-user association.
 *   - **Failure:** Sends a JSON response with an error message and appropriate HTTP status.
 */
export const getClassUserByIds: RequestHandler = async (req: Request, res: Response) => {
  const classId = Number(req.params.classId);
  const userId = Number(req.params.userId);
  if (isNaN(classId) || isNaN(userId)) {
    res.status(400).json({ error: 'Invalid class ID or user ID' });
    return;
  }

  try {
    const classUser = await classUsersService.getClassUserByIds(classId, userId);
    if (classUser) {
      res.json(classUser);
    } else {
      res.status(404).json({ error: 'Class user not found' });
    }
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * Creates a new class-user association.
 *
 * @async
 * @function createClassUser
 * @param {Request} req - Express request object containing `class_id`, `user_id`, and `role` in the body.
 * @param {Response} res - Express response object used to send back the response.
 * @returns {Promise<void>} 
 *   - **Success:** Sends a JSON object of the newly created class-user association with HTTP 201 status.
 *   - **Failure:** Sends a JSON response with an error message and appropriate HTTP status.
 */
export const createClassUser: RequestHandler = async (req: Request, res: Response) => {
  const { class_id, user_id, role } = req.body;
  if (!class_id || !user_id || !role) {
    res.status(400).json({ error: 'Missing required fields' });
    return;
  }

  try {
    const newClassUser = await classUsersService.createClassUser({ class_id, user_id, role });
    res.status(201).json(newClassUser);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * Updates the role of a user in a specific class.
 *
 * @async
 * @function updateClassUser
 * @param {Request} req - Express request object containing `classId` and `userId` parameters and `role` in the body.
 * @param {Response} res - Express response object used to send back the response.
 * @returns {Promise<void>} 
 *   - **Success:** Sends a JSON object of the updated class-user association.
 *   - **Failure:** Sends a JSON response with an error message and appropriate HTTP status.
 */
export const updateClassUser: RequestHandler = async (req: Request, res: Response) => {
  const classId = Number(req.params.classId);
  const userId = Number(req.params.userId);
  const { role } = req.body;

  if (isNaN(classId) || isNaN(userId) || !role) {
    res.status(400).json({ error: 'Invalid class ID, user ID or missing role' });
    return;
  }

  try {
    const updatedClassUser = await classUsersService.updateClassUser(classId, userId, role);
    if (updatedClassUser) {
      res.json(updatedClassUser);
    } else {
      res.status(404).json({ error: 'Class user not found' });
    }
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * Deletes a class-user association.
 *
 * @async
 * @function deleteClassUser
 * @param {Request} req - Express request object containing `classId` and `userId` parameters.
 * @param {Response} res - Express response object used to send back the response.
 * @returns {Promise<void>} 
 *   - **Success:** Sends a JSON object of the deleted class-user association.
 *   - **Failure:** Sends a JSON response with an error message and appropriate HTTP status.
 */
export const deleteClassUser: RequestHandler = async (req: Request, res: Response) => {
  const classId = Number(req.params.classId);
  const userId = Number(req.params.userId);

  if (isNaN(classId) || isNaN(userId)) {
    res.status(400).json({ error: 'Invalid class ID or user ID' });
    return;
  }

  try {
    const deletedClassUser = await classUsersService.deleteClassUser(classId, userId);
    if (deletedClassUser) {
      res.json(deletedClassUser);
    } else {
      res.status(404).json({ error: 'Class user not found' });
    }
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};
