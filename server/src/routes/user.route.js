import express from "express";
import {
  deleteUser,
  forgotPassword,
  getCurrentUser,
  google,
  resendOTP,
  signOut,
  signin,
  signup,
  updatePassword,
  updateUser,
  updateUserAvatar,
  verifyOTP,
  verifyResponse,
} from "../controllers/user.controller.js";
import { verifyJWT } from "../middleware/auth.middleware.js";
import { upload } from "../middleware/multer.middleware.js";
import { localVariables } from "../middleware/otp.middleware.js";

const router = express.Router();

router.post("/update/:id", verifyJWT, updateUser);
router.delete("/delete/:id", verifyJWT, deleteUser);
router.post("/signup", signup);
router.post("/signin", signin);
router.post("/google", google);
router.get("/signout",  signOut);
router.post("/forgot-password", localVariables, forgotPassword);
router.get("/verifyOTP", verifyOTP);
router.post("/updatePassword/:email", updatePassword);
router.get("/check-token", verifyJWT, verifyResponse);
router.post("/resend-otp", localVariables, resendOTP);
router.patch("/avatar",verifyJWT, upload.single("file"), updateUserAvatar);
router.get("/current-user", verifyJWT, getCurrentUser);

export default router;
