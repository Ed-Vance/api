import { Router } from 'express';
import * as clientAccountsController from '../controllers/clientAccountsController';

const router = Router();

// CRUD
router.get('/', clientAccountsController.getAllClientAccounts);
router.get('/:clientId/:userId', clientAccountsController.getClientAccountByIds);
router.post('/', clientAccountsController.createClientAccount);
router.delete('/:clientId/:userId', clientAccountsController.deleteClientAccount);

export default router;
