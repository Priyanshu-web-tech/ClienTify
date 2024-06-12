import bcryptjs from "bcryptjs";
import User from "../models/user.model.js";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";
import otpGenerator from "otp-generator";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { otpEmailTemplate } from "../utils/mailTemplate.js";
import {
  deleteFromCloudinary,
  uploadOnCloudinary,
} from "../utils/cloudinary.js";
import path from "path";

const generateOTP = () => {
  return otpGenerator.generate(6, {
    lowerCaseAlphabets: false,
    upperCaseAlphabets: false,
    specialChars: false,
  });
};

const updateUser = asyncHandler(async (req, res, next) => {
  if (req.user.id !== req.params.id)
    throw new ApiError(401, "You can only update your own account!");

  if (req.body.password) {
    req.body.password = bcryptjs.hashSync(req.body.password, 10);
  }

  const updatedUser = await User.findByIdAndUpdate(
    req.params.id,
    {
      $set: {
        name: req.body.name,
        username: req.body.username,
        email: req.body.email,
        password: req.body.password,
        avatar: req.body.avatar,
        resume: req.body.resume,
      },
    },
    { new: true }
  );

  const { password, ...rest } = updatedUser._doc;

  return res
    .status(200)
    .json(new ApiResponse(200, rest, "User Updated Successfully"));
});

const deleteUser = asyncHandler(async (req, res, next) => {
  if (req.user.id !== req.params.id)
    throw new ApiError(401, "You can only delete your own account!");

  await User.findByIdAndDelete(req.params.id);
  res.clearCookie("accessToken");
  return res
    .status(200)
    .json(new ApiResponse(200, {}, "User Deleted Successfully"));
});

const signup = asyncHandler(async (req, res, next) => {
  const { username, email, password, name } = req.body;

  const existingUser = await User.findOne({ email });

  if (existingUser) {
    throw new ApiError(400, "User already exists");
  }

  const hashedPass = bcryptjs.hashSync(password, 10);
  const newUser = new User({ name, username, email, password: hashedPass });

  await newUser.save();
  return res.status(201).json(new ApiResponse(201, {}, "User Created"));
});

const signin = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  const validUser = await User.findOne({ email });

  if (!validUser) {
    throw new ApiError(401, "User not found");
  }

  const validPassword = bcryptjs.compareSync(password, validUser.password);

  if (!validPassword) {
    throw new ApiError(401, "Wrong Creds!");
  }

  const token = jwt.sign({ id: validUser._id }, process.env.JWT_KEY);

  const { password: pass, ...rest } = validUser._doc;

  const expirationDate = new Date(Date.now() + 2 * 24 * 60 * 60 * 1000);

  return res
    .cookie("accessToken", token, {
      sameSite: "none",
      secure: true,
      expires: expirationDate, // 2 days in milliseconds
      httpOnly: true,
    })
    .status(200)
    .json(new ApiResponse(200, rest, ""));
});

const google = asyncHandler(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });
  if (user) {
    const token = jwt.sign({ id: user._id }, process.env.JWT_KEY);
    const { password: pass, ...rest } = user._doc;
    const expirationDate = new Date(Date.now() + 2 * 24 * 60 * 60 * 1000);

    return res
      .cookie("accessToken", token, {
        sameSite: "none",
        secure: true,
        expires: expirationDate, // Set expiration time
        httpOnly: true,
      })
      .status(200)
      .json(new ApiResponse(200, rest, ""));
  } else {
    const generatedPassword =
      Math.random().toString(36).slice(-8) +
      Math.random().toString(36).slice(-8);
    const hashedPassword = bcryptjs.hashSync(generatedPassword, 10);

    const newUser = new User({
      username:
        req.body.name.split(" ").join("").toLowerCase() +
        Math.random().toString(36).slice(-4),
      name: req.body.name,
      email: req.body.email,
      password: hashedPassword,
      avatar: req.body.photo,
    });
    await newUser.save();
    const token = jwt.sign({ id: newUser._id }, process.env.JWT_KEY);
    const { password: pass, ...rest } = newUser._doc;

    const expirationDate = new Date(Date.now() + 2 * 24 * 60 * 60 * 1000);

    res
      .cookie("accessToken", token, {
        sameSite: "none",
        secure: true,
        expires: expirationDate, // Set expiration time
        httpOnly: true,
      })
      .status(200)
      .json(new ApiResponse(200, rest, ""));
  }
});

const signOut = asyncHandler(async (req, res, next) => {
  res.clearCookie("accessToken");

  return res.status(200).json(new ApiResponse(200, {}, "Signed out"));
});

const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;
  User.findOne({ email: email }).then((user) => {
    if (!user) {
      throw new ApiError(400, "User not existed");
    }

    const OTP = generateOTP();

    req.app.locals.OTP = OTP;

    var transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    var mailOptions = {
      from: process.env.EMAIL_USER,
      to: `${user.email}`,
      subject: "Reset Password OTP",
      html: otpEmailTemplate(OTP), // Use the OTP email template
    };

    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        throw new ApiError(400, error.message);
      } else {
        return res.status(200).json(new ApiResponse(200, {}, "Success"));
      }
    });
  });
});

const verifyOTP = asyncHandler(async (req, res) => {
  const { code } = req.query; // Retrieve OTP code from request body
  if (parseInt(req.app.locals.OTP) === parseInt(code)) {
    req.app.locals.OTP = null; // Reset the OTP value
    return res
      .status(201)
      .json(new ApiResponse(201, {}, "Verified successfully"));
  }
  throw new ApiError(400, "Invalid OTP");
});

const updatePassword = asyncHandler(async (req, res, next) => {
  const { email } = req.params;
  req.body.password = bcryptjs.hashSync(req.body.password, 10);

  const updatedUser = await User.findOneAndUpdate(
    { email: email }, // Finding the user by email
    { $set: { password: req.body.password } },
    { new: true }
  );

  if (!updatedUser) {
    throw new ApiError(404, "User not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, updatedUser, "Password changed successfully"));
});

const verifyResponse = asyncHandler(async (req, res) => {
  const response = {
    user: req.user,
  };

  return res.json(new ApiResponse(200, response, "Token is valid"));
});

const resendOTP = async (req, res, next) => {
  const { email } = req.body; // Assuming email is provided in the request body

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ status: "User not found" });
    }

    const OTP = generateOTP();
    req.app.locals.OTP = OTP;

    var transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    var mailOptions = {
      from: process.env.EMAIL_USER,
      to: `${user.email}`,
      subject: "Your New OTP Code",
      html: otpEmailTemplate(OTP),
    };

    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        return next(error);
      } else {
        return res.status(200).json({ status: "OTP sent successfully" });
      }
    });
  } catch (error) {
    next(error);
  }
};

const updateUserAvatar = asyncHandler(async (req, res) => {
  const avatarLocalPath = `data:${
    req.file.mimetype
  };base64,${req.file.buffer.toString("base64")}`;

  if (!avatarLocalPath) {
    throw new ApiError(400, "Avatar is required");
  }

  const avatar = await uploadOnCloudinary(avatarLocalPath);

  if (!avatar.url) {
    throw new ApiError(400, "Error while uploading avatar");
  }
  const previousAvatar = req.user.avatar;

  const user = await User.findByIdAndUpdate(
    req.user?.id,
    {
      $set: {
        avatar: avatar.url,
      },
    },
    { new: true }
  ).select("-password");

  //TODO: delete image from cloudinary
  if (
    !(
      previousAvatar ===
        "https://static.thenounproject.com/png/363640-200.png" ||
      previousAvatar.includes("googleusercontent")
    )
  ) {
    const parts = previousAvatar.split("/");
    const uploadIndex = parts.indexOf("upload");
    const publicIdParts = parts.slice(uploadIndex + 1);
    let publicId = publicIdParts.slice(publicIdParts.indexOf("CRM")).join("/");

    // Remove file extension from publicId
    const fileName = path.basename(publicId);
    const fileNameWithoutExtension = path.parse(fileName).name;
    publicId = publicId.replace(fileName, fileNameWithoutExtension);


    const response = await deleteFromCloudinary(publicId);

    if (response.result !== "ok") {
      throw new ApiError(400, "Error while deleting avatar");
    }
  }

  return res
    .status(200)
    .json(new ApiResponse(200, user, "Avatar updated successfully"));
});

const getCurrentUser = asyncHandler(async (req, res) => {
  return res
    .status(200)
    .json(new ApiResponse(200, req.user, "Current user fetched successfully"));
});

export {
  updateUser,
  deleteUser,
  signup,
  signin,
  google,
  signOut,
  forgotPassword,
  verifyOTP,
  updatePassword,
  verifyResponse,
  resendOTP,
  updateUserAvatar,
  getCurrentUser,
};
