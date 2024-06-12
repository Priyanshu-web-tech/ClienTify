import CommunicationsLog from "../models/communicationsLog.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const receipt = asyncHandler(async (req, res) => {
  const { audienceId, customerId, campaignId, status } = req.body;

  // Create a new entry in CommunicationsLog model
  const newLogEntry = new CommunicationsLog({
    audienceId: audienceId,
    customerId: customerId,
    campaignId: campaignId,
    status: status,
  });

  // Save the new entry
  await newLogEntry.save();

  res.status(200).json(new ApiResponse(200, {}, "Status Added"));
});

const status = asyncHandler(async (req, res) => {
  // 1. Receive the audienceId from the request body
  const { audienceId } = req.query;

  try {
    // 2. Query the communicationsLog collection to count all entries with the provided audienceId
    const totalCount = await CommunicationsLog.countDocuments({ audienceId });

    // 3. Count how many of those entries have a status of "SENT" and "FAILED"
    const sentCount = await CommunicationsLog.countDocuments({
      audienceId,
      status: "SENT",
    });

    // 4. Send these counts in the response
    const response = new ApiResponse(
      200,
      {
        totalCount,
        sentCount,
      },
      "Status fetched successfully"
    );
    res.status(200).json(response);
  } catch (error) {
    // Handle errors
    console.error(error);
    const apiError = new ApiError(500, "Internal Server Error");
    res.status(apiError.statusCode).json(apiError);
  }
});

export { receipt, status };
