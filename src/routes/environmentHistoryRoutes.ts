import { Router } from 'express';
import * as environmentHistoryController from '../controllers/environmentHistoryController';

const router = Router();

// CRUD
router.get('/', environmentHistoryController.getAllEnvironmentHistories);
router.get('/:environmentId/:userId', environmentHistoryController.getEnvironmentHistoryByIds);
router.post('/', environmentHistoryController.createEnvironmentHistory);
router.delete('/:environmentId/:userId', environmentHistoryController.deleteEnvironmentHistory);

export default router;
