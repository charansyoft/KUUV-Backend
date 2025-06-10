import express from "express";
import { matchedData } from "express-validator";
import userModel from "../../models/userModel.js";
import { internalServerResponse } from "../../responses/serverErrorResponses.js";
import { response200 } from "../../responses/successResponses.js";
import fs from "fs/promises";
import path from "path";
import mime from "mime-types";

const router = express.Router();

export default async function getUserById(req, res) {
  try {
    const requestData = matchedData(req);
    const user = await userModel.findOne({
      _id: requestData.userId,
      deleted: false,
    }).lean();

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // 🔄 Convert profilePic to base64 data URI if it's a file path
    if (user.profilePic && typeof user.profilePic === "string") {
      try {
        const filePath = path.resolve(user.profilePic.replace(/\\/g, "/"));
        const imgBuffer = await fs.readFile(filePath);
        const contentType = mime.lookup(filePath) || "image/jpeg";
        const base64Image = imgBuffer.toString("base64");
        user.profilePic = `data:${contentType};base64,${base64Image}`;
      } catch (err) {
        console.error("⚠️ Error reading profilePic:", err.message);
        user.profilePic = null;
      }
    }

    response200(res, user);
  } catch (err) {
    internalServerResponse(res, err);
  }
}
