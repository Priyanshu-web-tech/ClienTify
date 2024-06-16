import { Router } from "express";
import { addCustomer, deleteCustomer, getCustomers, sendMessage, updateCustomer } from '../controllers/customer.controller.js';

const router = Router();

router.post('/add', addCustomer);
router.get('/:id', getCustomers);
router.post('/send-message', sendMessage);
router.patch('/update-customer/:id', updateCustomer);
router.delete('/delete-customer/:id', deleteCustomer);

export default router;