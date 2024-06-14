import { Router } from "express";
import { addCustomer, getCustomers, sendMessage, updateCustomer } from '../controllers/customer.controller.js';

const router = Router();

router.post('/add', addCustomer);
router.get('/', getCustomers);
router.post('/send-message', sendMessage);
router.patch('/update-customer', updateCustomer);


export default router;