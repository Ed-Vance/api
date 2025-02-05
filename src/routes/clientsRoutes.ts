import { Router } from 'express';
import * as clientsController from '../controllers/clientsController';

const router = Router();

// CRUD
router.get('/', clientsController.getAllClients);
router.get('/:id', clientsController.getClientById);
router.post('/', clientsController.createClient);
router.put('/:id', clientsController.updateClient);
router.delete('/:id', clientsController.deleteClient);

export default router;
