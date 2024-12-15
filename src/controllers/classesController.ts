import { Request, Response, RequestHandler } from 'express';
import * as classesService from '../services/classesService';
 
// Get all 
export const getAllClasses: RequestHandler = async (req: Request, res: Response) => {
  try {
    const classes = await classesService.getAllClasses();
    res.json(classes);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};
 
// Get class
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

// Create the class
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

// Update class information
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

// delete the class
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

// Get the enfironment attributed to a class
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

// get the users attached to the class, notably also gets their role for that
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
