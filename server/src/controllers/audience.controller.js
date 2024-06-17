import Audience from "../models/audience.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const createAudience = asyncHandler(async (req, res) => {
  const { name, customerIds,userId } = req.body;
  


  const audience = new Audience({ name: name, customerIds: customerIds, createdBy: userId});
  await audience.save();

  res
    .status(200)
    .json(new ApiResponse(200, audience, "Audience created successfully"));
});

const getAudiences = asyncHandler(async (req, res) => {
  const userId=req.params.id;

  
  
  const audiences = await Audience.find({ createdBy: userId});

  res.status(200).json(new ApiResponse(200, audiences, "Audiences fetched"));
});
export { createAudience, getAudiences};
