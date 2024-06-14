import Campaign from "../models/campaign.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const createCampaign = asyncHandler(async (req, res) => {
  const { name, message ,userId} = req.body;

  const campaign = new Campaign({ name, message, createdBy: userId});
  await campaign.save();

  res
    .status(200)
    .json(new ApiResponse(200, campaign, "Campaign created successfully"));
});

const getCampaigns = asyncHandler(async (req, res) => {
  const campaigns = await Campaign.find({ createdBy: req.params.id});
  res
    .status(200)
    .json(new ApiResponse(200, campaigns, "Campaigns fetched successfully"));
});

export { createCampaign, getCampaigns };
