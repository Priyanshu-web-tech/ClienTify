import Order from "../models/order.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const addOrder = asyncHandler(async (req, res) => {
  const { customerId, amount, date } = req.body;

  if (isNaN(amount)) {
    throw new ApiError(400, "Amount must be a number");
  }

  if (isNaN(Date.parse(date))) {
    throw new ApiError(400, "Invalid date format");
  }

  if(amount < 0){
    throw new ApiError(400, "Amount must be a positive number");
  }

  

  const order = new Order({ customerId, amount, date });

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
