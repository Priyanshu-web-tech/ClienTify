import { Router } from "express";
import { addCustomer, getCustomers } from '../controllers/customer.controller.js';

const router = Router();

router.post('/add', addCustomer);
router.get('/', getCustomers);

export default router;