import Customer from "../models/customer.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const addCustomer = asyncHandler(async (req, res) => {
  const customer = new Customer(req.body);
  await customer.save();
  res
    .status(200)
    .json(new ApiResponse(200, customer, "Customer added Successfully"));
});

const getCustomers = asyncHandler(async (req, res) => {
  const customers = await Customer.find();

  res
    .status(200)
    .json(new ApiResponse(200, customers, "Customers fetched Successfully"));
});

export { addCustomer, getCustomers };
