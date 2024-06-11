import { Router } from "express";
import { addCustomer, getCustomers, sendMessage } from '../controllers/customer.controller.js';

const router = Router();

router.post('/add', addCustomer);
router.get('/', getCustomers);
router.post('/send-message', sendMessage);

export default router;