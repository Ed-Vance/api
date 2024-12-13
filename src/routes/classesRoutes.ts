import { Router } from 'express';
import * as classesController from '../controllers/classesController';

const router = Router();

// Pretty simple CRUD functions
router.get('/', classesController.getAllClasses);
router.get('/:id', classesController.getClassById);
router.post('/', classesController.createClass);
router.put('/:id', classesController.updateClass);
router.delete('/:id', classesController.deleteClass);

// Some routes I thought would be good at this point in dev to get the env for the class and get the users for the class. 
router.get('/:id/environments', classesController.getEnvironmentsForClass);
router.get('/:id/users', classesController.getUsersForClass);

export default router;
