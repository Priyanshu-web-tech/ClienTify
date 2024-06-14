import { Router } from "express";
import { createCampaign, getCampaigns } from '../controllers/campaign.controller.js';
const router = Router();

router.post('/create', createCampaign);
router.get('/:id', getCampaigns);

export default router;