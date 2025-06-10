import express from "express";
import { matchedData } from "express-validator";
import sessionModel from "../../models/sessionModel.js";
import { internalServerResponse } from "../../responses/serverErrorResponses.js";
import { response200 } from "../../responses/successResponses.js";

const router = express.Router();
export default async function getSessions(req, res) {
  try {
    const requestData = matchedData(req);
    const session = await sessionModel.find();
    response200(res, session);
  } catch (err) {
    console.log({ err });
    internalServerResponse(res, err);
  }
}
