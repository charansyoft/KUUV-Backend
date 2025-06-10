import bcrypt from "bcrypt";
import { matchedData } from "express-validator";
import otpModel from "../../models/otpModel.js";
import userModel from "../../models/userModel.js";
import { badRequest } from "../../responses/errorResponses.js";
import { internalServerResponse } from "../../responses/serverErrorResponses.js";
import { response200 } from "../../responses/successResponses.js";

export default async function resetPassword(req, res) {
  try {
    const requestData = matchedData(req);
    const user = await userModel.findOne({
      email: requestData?.email,
      deleted: false,
    });
    console.log({ user });
    const otp = otpModel.findOne({
      user: user?._id,
      otp: requestData?.otp,
    });

    if (!otp || !user) {
      return badRequest(res, [{ msg: "Could not authenticate user" }]);
    }
    console.log({ password: requestData.password });
    const hashedPassword = await bcrypt.hash(requestData.password, 10);
    const updateUserResult = await userModel.findOneAndUpdate(
      {
        _id: user._id,
      },
      {
        password: hashedPassword,
      },
      { new: true }
    );
    console.log({ updateUserResult });

    response200(res, updateUserResult);
  } catch (err) {
    console.log(err);
    internalServerResponse(res);
  }
}
