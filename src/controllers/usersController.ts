import { Request, Response, RequestHandler } from 'express';
import * as usersService from '../services/usersService';
 
export const getAllUsers: RequestHandler = async (req: Request, res: Response) => {
  try {
    const result = await usersService.getAllUsers();
    res.json(result);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const getUserById: RequestHandler = async (req: Request, res: Response) => {
  const userId = Number(req.params.id);
  if (isNaN(userId)) {
    res.status(400).json({ error: 'Invalid user ID' });
    return;
  }

  try {
    const user = await usersService.getUserById(userId);
    if (user) {
      res.json(user);
    } else {
      res.status(404).json({ error: 'User not found' });
    }
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const createUser: RequestHandler = async (req: Request, res: Response) => {
  const { first_name, last_name, email, password, phone } = req.body;
  if (!first_name || !last_name || !email || !password || !phone) {
    res.status(400).json({ error: 'Missing required fields' });
    return;
  }

  try {
    const newUser = await usersService.createUser({ first_name, last_name, email, password, phone });
    res.status(201).json(newUser);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const updateUser: RequestHandler = async (req: Request, res: Response) => {
  const userId = Number(req.params.id);
  if (isNaN(userId)) {
    res.status(400).json({ error: 'Invalid user ID' });
    return;
  }

  try {
    const updatedUser = await usersService.updateUser(userId, req.body);
    if (updatedUser) {
      res.json(updatedUser);
    } else {
      res.status(404).json({ error: 'User not found' });
    }
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteUser: RequestHandler = async (req: Request, res: Response) => {
  const userId = Number(req.params.id);
  if (isNaN(userId)) {
    res.status(400).json({ error: 'Invalid user ID' });
    return;
  }

  try {
    const deletedUser = await usersService.deleteUser(userId);
    if (deletedUser) {
      res.json(deletedUser);
    } else {
      res.status(404).json({ error: 'User not found' });
    }
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

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
