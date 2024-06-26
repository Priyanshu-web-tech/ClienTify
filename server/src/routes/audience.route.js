import { Router } from "express";
import { createAudience, getAudiences } from "../controllers/audience.controller.js";
const router = Router();

router.post('/create', createAudience);
router.get('/:id', getAudiences);


export default router;