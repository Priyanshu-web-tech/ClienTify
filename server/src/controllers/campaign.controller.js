import Campaign from "../models/campaign.model.js";
import Customer from "../models/customer.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const createCampaign = asyncHandler(async (req, res) => {
  const { name, rules } = req.body;
  let query = {};

  if (rules.totalSpends) {
    query.totalSpends = { $gt: rules.totalSpends };
  }
  if (rules.maxVisits) {
    query.visits = { $lte: rules.maxVisits };
  }
  if (rules.lastVisit) {
    const lastVisitDate = new Date();
    lastVisitDate.setMonth(lastVisitDate.getMonth() - rules.lastVisit);
    query.lastVisit = { $lt: lastVisitDate };
  }

  const audience = await Customer.find(query);
  const campaign = new Campaign({ name, audience, status: "Pending" });
  await campaign.save();

  // Simulate sending messages
  audience.forEach((customer) => {
    console.log(`Sending message to ${customer.name}`);
  });

  campaign.status = "Completed";
  await campaign.save();

  res
    .status(200)
    .json(new ApiResponse(200, campaign, "Campaign created and messages sent"));
});

const getCampaigns = asyncHandler(async (req, res) => {
  const campaigns = await Campaign.find();
  res
    .status(200)
    .json(new ApiResponse(200, campaigns, "Campaigns fetched successfully"));
});

export { createCampaign, getCampaigns };
