import { Request, Response, RequestHandler } from 'express';
import * as usersService from '../services/usersService';
import { sanitizeUsers, sanitizeUser, SanitizedUser } from '../helpers/sanitize';
import { User } from '../types/User'; 

/**
 * Retrieves all users from the database.
 *
 * @async
 * @function getAllUsers
 * @param {Request} req - Express request object.
 * @param {Response} res - Express response object used to send back the response.
 * @returns {Promise<void>} 
 *   - **Success:** Sends a JSON array of all users without passwords.
 *   - **Failure:** Sends a JSON response with an error message and HTTP 500 status.
 */
export const getAllUsers: RequestHandler = async (req: Request, res: Response) => {
  try {
    const users: User[] = await usersService.getAllUsers();
    const sanitizedUsers: SanitizedUser[] = sanitizeUsers(users);
    res.json(sanitizedUsers);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * Retrieves a specific user by their ID.
 *
 * @async
 * @function getUserById
 * @param {Request} req - Express request object containing `id` parameter.
 * @param {Response} res - Express response object used to send back the response.
 * @returns {Promise<void>} 
 *   - **Success:** Sends a JSON object of the requested user without password.
 *   - **Failure:** Sends a JSON response with an error message and appropriate HTTP status.
 */
export const getUserById: RequestHandler = async (req: Request, res: Response) => {
  const userId = Number(req.params.id);
  if (isNaN(userId)) {
    res.status(400).json({ error: 'Invalid user ID' });
    return;
  }

  try {
    const user: User | undefined = await usersService.getUserById(userId);
    if (user) {
      const sanitizedUser: SanitizedUser = sanitizeUser(user);
      res.json(sanitizedUser);
    } else {
      res.status(404).json({ error: 'User not found' });
    }
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * Creates a new user in the database with hashed password.
 *
 * @async
 * @function createUser
 * @param {Request} req - Express request object containing `first_name`, `last_name`, `email`, `password`, and `phone` in the body.
 * @param {Response} res - Express response object used to send back the response.
 * @returns {Promise<void>} 
 *   - **Success:** Sends a JSON object of the newly created user without password with HTTP 201 status.
 *   - **Failure:** Sends a JSON response with an error message and appropriate HTTP status.
 */
export const createUser: RequestHandler = async (req: Request, res: Response) => {
  const { first_name, last_name, email, password, phone } = req.body;
  if (!first_name || !last_name || !email || !password || !phone) {
    res.status(400).json({ error: 'Missing required fields' });
    return;
  }

  try {
    const newUser: User = await usersService.createUser({ first_name, last_name, email, password, phone });
    const sanitizedUser: SanitizedUser = sanitizeUser(newUser);
    res.status(201).json(sanitizedUser);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * Updates an existing user's information.
 *
 * @async
 * @function updateUser
 * @param {Request} req - Express request object containing `id` parameter and updated user data in the body.
 * @param {Response} res - Express response object used to send back the response.
 * @returns {Promise<void>} 
 *   - **Success:** Sends a JSON object of the updated user without password.
 *   - **Failure:** Sends a JSON response with an error message and appropriate HTTP status.
 */
export const updateUser: RequestHandler = async (req: Request, res: Response) => {
  const userId = Number(req.params.id);
  if (isNaN(userId)) {
    res.status(400).json({ error: 'Invalid user ID' });
    return;
  }

  try {
    const updatedUser: User | undefined = await usersService.updateUser(userId, req.body);
    if (updatedUser) {
      const sanitizedUser: SanitizedUser = sanitizeUser(updatedUser);
      res.json(sanitizedUser);
    } else {
      res.status(404).json({ error: 'User not found' });
    }
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * Deletes a user from the database.
 *
 * @async
 * @function deleteUser
 * @param {Request} req - Express request object containing `id` parameter.
 * @param {Response} res - Express response object used to send back the response.
 * @returns {Promise<void>} 
 *   - **Success:** Sends a JSON object of the deleted user without password.
 *   - **Failure:** Sends a JSON response with an error message and appropriate HTTP status.
 */
export const deleteUser: RequestHandler = async (req: Request, res: Response) => {
  const userId = Number(req.params.id);
  if (isNaN(userId)) {
    res.status(400).json({ error: 'Invalid user ID' });
    return;
  }

  try {
    const deletedUser: User | undefined = await usersService.deleteUser(userId);
    if (deletedUser) {
      const sanitizedUser: SanitizedUser = sanitizeUser(deletedUser);
      res.json(sanitizedUser);
    } else {
      res.status(404).json({ error: 'User not found' });
    }
  } catch (error: any) {
    console.error('Error during delete operation:', error); 
    res.status(500).json({ error: error.message });
  }
};

/**
 * Retrieves all classes associated with a specific user, including their roles.
 *
 * @async
 * @function getClassesForUser
 * @param {Request} req - Express request object containing `id` parameter.
 * @param {Response} res - Express response object used to send back the response.
 * @returns {Promise<void>} 
 *   - **Success:** Sends a JSON array of classes with user roles.
 *   - **Failure:** Sends a JSON response with an error message and appropriate HTTP status.
 */
export const getClassesForUser: RequestHandler = async (req: Request, res: Response) => {
  const userId = Number(req.params.id);
  if (isNaN(userId)) {
    res.status(400).json({ error: 'Invalid user ID' });
    return;
  }

  try {
    const userClasses = await usersService.getUserClasses(userId);
    res.json(userClasses);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};
