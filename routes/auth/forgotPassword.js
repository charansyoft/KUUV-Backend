import { matchedData } from "express-validator";
import sendEmail from "../../helpers/sendEmail.js";
import userModel from "../../models/userModel.js";
import { internalServerResponse } from "../../responses/serverErrorResponses.js";
import { response200 } from "../../responses/successResponses.js";
import generateOtp from "../misc/generateOtp.js";

export default async function forgotPassword(req, res) {
  try {
    const requestData = matchedData(req);
    const user = await userModel.findOne({
      email: requestData.email,
      deleted: false,
    });
    if (!user) {
      console.log("user doesnt exist");
      return response200(res, { msg: "OTP sent to registered email" });
    }
    console.log({ user });

    const otp = await generateOtp({ userId: user?._id });
    await sendEmail({
      recipient: user?.email,
      subject: "One Time Password(OTP) - PractE",
      body: `Your one time password is ${otp}`,
    });

    response200(res, { msg: "OTP sent to registered email" });
  } catch (err) {
    console.log({ err });
    internalServerResponse(res, err);
  }
}
