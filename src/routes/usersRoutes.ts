import { Router } from 'express';
import * as usersController from '../controllers/usersController';

const router = Router();

// CRUD
router.get('/', usersController.getAllUsers);
router.get('/:id', usersController.getUserById);
router.post('/', usersController.createUser);
router.put('/:id', usersController.updateUser);
router.delete('/:id', usersController.deleteUser);

router.get('/:id/classes', usersController.getClassesForUser);

export default router;
