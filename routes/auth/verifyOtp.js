import express from "express";
import { matchedData } from "express-validator";
import generateToken from "../../helpers/generateToken.js";
import userModel from "../../models/userModel.js";
import otpModel from "../../models/otpModel.js";
import { badRequest } from "../../responses/errorResponses.js";
import { internalServerResponse } from "../../responses/serverErrorResponses.js";
import { response200 } from "../../responses/successResponses.js";

const router = express.Router();

export default async function verifyOtp(req, res) {
  try {
    console.log("Received Request in verifyOtp.js:", req.body);

    const requestData = matchedData(req);
    const { phone, otp } = requestData;

    console.log("Fetching user details for phone:", phone);
    const user = await userModel.findOne({ phone });

    if (!user) {
      console.log("User not found for phone:", phone);
      return badRequest(res, [{ msg: "User not found" }]);
    }

    console.log("Checking OTP for user ID:", user._id);
    console.log("Checking OTP for user ID:", user.phone);

    const otpRecord = await otpModel.findOne({ user: user._id });
    console.log("OTP RECORD FOUND:", otpRecord);

    if (!otpRecord) {
      console.log("No OTP record found for user ID:", user._id);
      return badRequest(res, [{ msg: "Invalid OTP" }]);
    }

    if (otpRecord.otp !== otp) {
      console.log("OTP mismatch for user ID:", user._id);
      return badRequest(res, [{ msg: "Invalid OTP" }]);
    }

    console.log("OTP verified successfully, generating token...");
    const token = await generateToken({ user });

    console.log("Token generated successfully for user:", user._id);
    return response200(res, { token, user });
  } catch (err) {
    console.log("Error in verifyOtp:", err);
    internalServerResponse(res, err);
  }
}
