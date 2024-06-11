import { Router } from "express";
import {receipt, status} from "../controllers/communicationLog.controller.js"

const router = Router();

router.post('/delivery-receipt', receipt);
router.get('/check-status', status);


export default router;