import { Router } from "express";
import { addOrder, getOrders } from '../controllers/order.controller.js';

const router = Router();

router.post('/add', addOrder);
router.get('/', getOrders);

export default router;