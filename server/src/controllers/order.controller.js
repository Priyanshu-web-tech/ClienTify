import Order from "../models/order.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const addOrder = asyncHandler(async (req, res) => {
  const order = new Order(req.body);
  await order.save();

  res.status(200).json(new ApiResponse(200, order, "Order added successfully"));
});

const getOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find().populate("customerId");
  res
    .status(200)
    .json(new ApiResponse(200, orders, "Orders fetched successfully"));
});

export { addOrder, getOrders };
