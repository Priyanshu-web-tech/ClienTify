import { Router } from "express";
import { createCampaign, deleteCampaign, getCampaigns, updateCampaign } from '../controllers/campaign.controller.js';
const router = Router();

router.post('/create', createCampaign);
router.get('/:id', getCampaigns);
router.delete('/delete-campaign/:id', deleteCampaign);
router.patch('/update-campaign/:id', updateCampaign);

export default router;