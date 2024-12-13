import { Router } from 'express';
import * as classUsersController from '../controllers/classUsersController';

const router = Router();

// CRUD
router.get('/', classUsersController.getAllClassUsers);
router.get('/:classId/:userId', classUsersController.getClassUserByIds);
router.post('/', classUsersController.createClassUser);
router.put('/:classId/:userId', classUsersController.updateClassUser);
router.delete('/:classId/:userId', classUsersController.deleteClassUser);

export default router;
