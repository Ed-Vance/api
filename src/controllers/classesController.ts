import { Request, Response, RequestHandler } from 'express';
import * as classesService from '../services/classesService';
 
/**
 * Retrieves all classes from the database.
 *
 * @async
 * @function getAllClasses
 * @param {Request} req - Express request object.
 * @param {Response} res - Express response object used to send back the response.
 * @returns {Promise<void>} 
 *   - **Success:** Sends a JSON array of all classes.
 *   - **Failure:** Sends a JSON response with an error message and HTTP 500 status.
 */
export const getAllClasses: RequestHandler = async (req: Request, res: Response) => {
  try {
    const classes = await classesService.getAllClasses();
    res.json(classes);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};
 
/**
 * Retrieves a specific class by its ID.
 *
 * @async
 * @function getClassById
 * @param {Request} req - Express request object containing `id` parameter.
 * @param {Response} res - Express response object used to send back the response.
 * @returns {Promise<void>} 
 *   - **Success:** Sends a JSON object of the requested class.
 *   - **Failure:** Sends a JSON response with an error message and appropriate HTTP status.
 */
export const getClassById: RequestHandler = async (req: Request, res: Response) => {
  const classId = Number(req.params.id);
  if (isNaN(classId)) {
    res.status(400).json({ error: 'Invalid class ID' });
    return;
  }

  try {
    const classData = await classesService.getClassById(classId);
    if (classData) {
      res.json(classData);
    } else {
      res.status(404).json({ error: 'Class not found' });
    }
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * Creates a new class in the database.
 *
 * @async
 * @function createClass
 * @param {Request} req - Express request object containing `class_name`, `class_reference`, and `license_id` in the body.
 * @param {Response} res - Express response object used to send back the response.
 * @returns {Promise<void>} 
 *   - **Success:** Sends a JSON object of the newly created class with HTTP 201 status.
 *   - **Failure:** Sends a JSON response with an error message and appropriate HTTP status.
 */
export const createClass: RequestHandler = async (req: Request, res: Response) => {
  const { class_name, class_reference, license_id } = req.body;
  if (!class_name || !class_reference || !license_id) {
    res.status(400).json({ error: 'Missing required fields' });
    return;
  }

  try {
    const newClass = await classesService.createClass({ class_name, class_reference, license_id });
    res.status(201).json(newClass);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * Updates information of an existing class.
 *
 * @async
 * @function updateClass
 * @param {Request} req - Express request object containing `id` parameter and updated class data in the body.
 * @param {Response} res - Express response object used to send back the response.
 * @returns {Promise<void>} 
 *   - **Success:** Sends a JSON object of the updated class.
 *   - **Failure:** Sends a JSON response with an error message and appropriate HTTP status.
 */
export const updateClass: RequestHandler = async (req: Request, res: Response) => {
  const classId = Number(req.params.id);
  if (isNaN(classId)) {
    res.status(400).json({ error: 'Invalid class ID' });
    return;
  }

  try {
    const updatedClass = await classesService.updateClass(classId, req.body);
    if (updatedClass) {
      res.json(updatedClass);
    } else {
      res.status(404).json({ error: 'Class not found' });
    }
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * Deletes a class from the database.
 *
 * @async
 * @function deleteClass
 * @param {Request} req - Express request object containing `id` parameter.
 * @param {Response} res - Express response object used to send back the response.
 * @returns {Promise<void>} 
 *   - **Success:** Sends a JSON object of the deleted class.
 *   - **Failure:** Sends a JSON response with an error message and appropriate HTTP status.
 */
export const deleteClass: RequestHandler = async (req: Request, res: Response) => {
  const classId = Number(req.params.id);
  if (isNaN(classId)) {
    res.status(400).json({ error: 'Invalid class ID' });
    return;
  }

  try {
    const deletedClass = await classesService.deleteClass(classId);
    if (deletedClass) {
      res.json(deletedClass);
    } else {
      res.status(404).json({ error: 'Class not found' });
    }
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * Retrieves all environments associated with a specific class.
 *
 * @async
 * @function getEnvironmentsForClass
 * @param {Request} req - Express request object containing `id` parameter.
 * @param {Response} res - Express response object used to send back the response.
 * @returns {Promise<void>} 
 *   - **Success:** Sends a JSON array of environments related to the class.
 *   - **Failure:** Sends a JSON response with an error message and appropriate HTTP status.
 */
export const getEnvironmentsForClass: RequestHandler = async (req: Request, res: Response) => {
  const classId = Number(req.params.id);
  if (isNaN(classId)) {
    res.status(400).json({ error: 'Invalid class ID' });
    return;
  }

  try {
    const envs = await classesService.getClassEnvironments(classId);
    res.json(envs);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * Retrieves all users associated with a specific class, including their roles.
 *
 * @async
 * @function getUsersForClass
 * @param {Request} req - Express request object containing `id` parameter.
 * @param {Response} res - Express response object used to send back the response.
 * @returns {Promise<void>} 
 *   - **Success:** Sends a JSON array of users with their roles in the class.
 *   - **Failure:** Sends a JSON response with an error message and appropriate HTTP status.
 */
export const getUsersForClass: RequestHandler = async (req: Request, res: Response) => {
  const classId = Number(req.params.id);
  if (isNaN(classId)) {
    res.status(400).json({ error: 'Invalid class ID' });
    return;
  }

  try {
    const classUsers = await classesService.getClassUsers(classId);
    res.json(classUsers);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};
