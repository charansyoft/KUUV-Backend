import bcrypt from "bcrypt";
import { matchedData } from "express-validator";
import generateToken from "../../helpers/generateToken.js";
import userModel from "../../models/userModel.js";
import { badRequest } from "../../responses/errorResponses.js";
import { internalServerResponse } from "../../responses/serverErrorResponses.js";
import { response200 } from "../../responses/successResponses.js";

export default async function createEndUser(req, res) {
  try {
    const requestData = matchedData(req);
    const existingUser = await userModel.findOne({
      email: requestData.email,
      deleted: false,
    });
    if (existingUser) {
      return badRequest(res, [{ msg: "User already exists" }]);
    }
    const hashedPassword = await bcrypt.hash(requestData.password, 10);
    const user = new userModel({
      ...requestData,
      password: hashedPassword,
      role: "enduser",
    });

    const saveUserResult = await user.save();
    const token = await generateToken({ user: saveUserResult?._doc });

    response200(res, { ...saveUserResult?._doc, token });
  } catch (err) {
    console.log(err);
    internalServerResponse(res);
  }
}
