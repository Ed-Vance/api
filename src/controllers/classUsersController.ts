import { Request, Response, RequestHandler } from 'express';
import * as classUsersService from '../services/classUsersService';
 

export const getAllClassUsers: RequestHandler = async (req: Request, res: Response) => {
  try {
    const result = await classUsersService.getAllClassUsers();
    res.json(result);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

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
