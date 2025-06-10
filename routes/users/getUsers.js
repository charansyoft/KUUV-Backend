import { matchedData } from "express-validator";
import userModel from "../../models/userModel.js";
import { internalServerResponse } from "../../responses/serverErrorResponses.js";
import { response200 } from "../../responses/successResponses.js";

export default async function getUsers(req, res) {
  try {
    const user = req.user;
    const requestData = matchedData(req);
    const users = await userModel.find();

    response200(res, users);
  } catch (err) {
    console.log(err);
    internalServerResponse(res);
  }
}
