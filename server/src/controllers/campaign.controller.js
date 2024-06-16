import Campaign from "../models/campaign.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";

const createCampaign = asyncHandler(async (req, res) => {
  const { name, message, userId } = req.body;

  const campaign = new Campaign({ name, message, createdBy: userId });
  await campaign.save();

  res
    .status(200)
    .json(new ApiResponse(200, campaign, "Campaign created successfully"));
});

const getCampaigns = asyncHandler(async (req, res) => {
  const campaigns = await Campaign.find({ createdBy: req.params.id });
  res
    .status(200)
    .json(new ApiResponse(200, campaigns, "Campaigns fetched successfully"));
});

const deleteCampaign = asyncHandler(async (req, res) => {
  const campaign = await Campaign.findByIdAndDelete(req.params.id);
  if (!campaign) {
    throw new ApiError(404, "Campaign not found");
  }

  res
    .status(200)
    .json(new ApiResponse(200, {}, "Campaign deleted successfully"));
});

const updateCampaign = asyncHandler(async (req, res) => {
  const campaignId = req.params.id;
  const { name, message } = req.body;

  if (!name || !message) {
    throw new ApiError(404, "Name and message are required");
  }

  const updatedCampaign = await Campaign.findByIdAndUpdate(
    campaignId,
    { name, message },
    { new: true }
  );

  if (!updatedCampaign) {
    throw new ApiError(404, "Campaign not found");
  }

  res
    .status(200)
    .json(
      new ApiResponse(200, updatedCampaign, "Campaign updated successfully")
    );
});

export { createCampaign, getCampaigns, deleteCampaign, updateCampaign };
