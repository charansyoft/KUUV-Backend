import { matchedData } from "express-validator";
import userModel from "../../models/userModel.js";
import otpModel from "../../models/otpModel.js";
import { internalServerResponse } from "../../responses/serverErrorResponses.js";
import { response200 } from "../../responses/successResponses.js";
import crypto from "crypto";
import sendOTPThroughMsg91 from "./sendOTP.js";


export default async function login(req, res) {
  try {
    const requestData = matchedData(req);
    console.log("Incoming request data:", requestData);

    let user = await userModel.findOne({
      phone: requestData.phone,
      deleted: false,
    });

    if (!user) {
      console.log("User not found, creating new user...");
      user = await new userModel({ phone: requestData.phone,ccode: requestData.ccode, }).save();
    } else {
      console.log("User found:", user);
    }

    // Generate a random OTP
    const otp = crypto.randomInt(1000, 9999).toString();

    // Delete any existing OTPs for this user (to ensure freshness)
    await otpModel.deleteMany({ user: user._id });
    const sent =  await sendOTPThroughMsg91(requestData.ccode + requestData.phone, otp, user.name?user.name: "Dear User")
    console.log("SENT:",sent)
    // Store the generated OTP in the database
    const otpData = new otpModel({
      user: user._id,
      otp: otp,
    });
    await otpData.save();

    console.log(`OTP generated for ${requestData.phone}: ${otp}`);

    // Send OTP to the phone number via MSG91
    const phoneNumber = requestData.ccode + requestData.phone; // Format full phone number with country code
    console.log(phoneNumber);

    // Make the API call to send OTP via MSG91

    // Respond with a success message
    response200(res, {
      message: "OTP generated and sent successfully",
      phoneNumber: requestData.phone,
      ccode: requestData.ccode,
      otp, // You can include OTP in the response for debugging, but don't send it in production
    });
  } catch (err) {
    console.error("Error occurred:", err);
    internalServerResponse(res, err);
  }
}
