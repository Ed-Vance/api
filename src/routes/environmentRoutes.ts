import { Router } from 'express';
import * as environmentController from '../controllers/environmentController';

const router = Router();

// CRUD
router.get('/', environmentController.getAllEnvironments);
router.get('/:id', environmentController.getEnvironmentById);
router.post('/', environmentController.createEnvironment);
router.put('/:id', environmentController.updateEnvironment);
router.delete('/:id', environmentController.deleteEnvironment);

export default router;
