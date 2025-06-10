import { matchedData } from "express-validator";
import otpModel from "../../models/otpModel.js";
import userModel from "../../models/userModel.js";
import { badRequest } from "../../responses/errorResponses.js";
import { internalServerResponse } from "../../responses/serverErrorResponses.js";
import { response200 } from "../../responses/successResponses.js";

export default async function validateOtp(req, res) {
  try {
    const requestData = matchedData(req);
    const user = await userModel.findOne({
      email: requestData.email,
      deleted: false,
    });
    if (!user) {
      return badRequest(res, [{ msg: "Invalid OTP" }]);
    }

    const otp = await otpModel.findOne({
      user: user?._id,
      otp: requestData?.otp,
    });

    if (!otp) {
      return badRequest(res, [{ msg: "Invaid OTP" }]);
    }

    response200(res, { msg: "Valid" });
  } catch (err) {
    console.log({ err });
    internalServerResponse(res, err);
  }
}
