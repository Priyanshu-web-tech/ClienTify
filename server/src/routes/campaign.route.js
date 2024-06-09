import { Router } from "express";
import { createCampaign, getCampaigns } from '../controllers/campaign.controller.js';
const router = Router();

router.post('/create', createCampaign);
router.get('/', getCampaigns);

export default router;