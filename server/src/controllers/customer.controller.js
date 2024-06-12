import Customer from "../models/customer.model.js";
import Audience from "../models/audience.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { mailTemplate } from "../utils/mailTemplate.js";
import nodemailer from "nodemailer";
import axios from "axios";

const addCustomer = asyncHandler(async (req, res) => {
  const customer = new Customer(req.body);
  await customer.save();
  res
    .status(200)
    .json(new ApiResponse(200, customer, "Customer added Successfully"));
});

const getCustomers = asyncHandler(async (req, res) => {
  const customers = await Customer.aggregate([
    {
      $lookup: {
        from: "orders",
        localField: "_id",
        foreignField: "customerId",
        as: "orders",
      },
    },
    {
      $addFields: {
        ordersCount: { $size: "$orders" },
        ordersTotalAmount: { $sum: "$orders.amount" },
      },
    },
    {
      $addFields: {
        totalSpends: { $add: ["$totalSpends", "$ordersTotalAmount"] },
        visits: { $add: ["$visits", "$ordersCount"] },
      },
    },
    {
      $project: {
        _id: 1,
        name: 1,
        email: 1,
        totalSpends: 1,
        visits: 1,
        lastVisit: 1,
        createdAt: 1,
        updatedAt: 1,
      },
    },
  ]);

  res
    .status(200)
    .json(new ApiResponse(200, customers, "Customers fetched successfully"));
});

const sendMessage = async (req, res) => {
  const { serverUrl, campaignMsg, audienceId, campaignId, customerIds } =
    req.body;

  if (customerIds.length === 0) {
    throw new ApiError(400, "No customers selected");
  }

  try {
    const audiences = await Customer.find({ _id: { $in: customerIds } }); // Fetch customers with IDs in customerIds

    if (audiences.length === 0) {
      throw new ApiError(400, "No customers found");
    }

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const emailPromises = audiences.map(async (customer) => {
      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: customer.email,
        subject: "Special Offer!",
        html: mailTemplate(customer.name, campaignMsg), // Use the email template
      };

      try {
        await transporter.sendMail(mailOptions);
        return { customerId: customer._id, status: "SENT" };
      } catch (error) {
        return { customerId: customer._id, status: "FAILED" };
      }
    });

    const emailResults = await Promise.all(emailPromises);

    // Batch update delivery receipt
    const deliveryPromises = emailResults.map((result) =>
      axios.post(`${serverUrl}api/communication/delivery-receipt`, {
        audienceId,
        customerId: result.customerId,
        campaignId,
        status: result.status,
      })
    );

    await Promise.all(deliveryPromises);

    await Audience.findByIdAndUpdate(audienceId, { status: "DONE" });

    res.status(200).json(new ApiResponse(200, {}, "Messages sent"));
  } catch (error) {
    console.error(error);
    res.status(500).json(new ApiResponse(500, {}, "An error occurred"));
  }
};

export { addCustomer, getCustomers, sendMessage };
