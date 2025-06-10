import userModel from "../../models/userModel.js";
import { response200 } from "../../responses/successResponses.js";
import { internalServerResponse } from "../../responses/serverErrorResponses.js";
import fs from "fs/promises"; // use promise-based fs
import path from "path";
import mime from "mime-types"; // to get mime type by file extension

const getUserProfile = async (req, res) => {
  try {
    const userId = req.user?._id; // Extract user ID from token

    if (!userId) {
      console.warn("⚠️ No user ID found in token");
      return res.status(400).json({ error: "User ID not found in token" });
    }

    // Fetch user from database
    const user = await userModel
      .findOne({ _id: userId, deleted: false })
      .select("-password") // Exclude password
      .lean();

    if (!user) {
      console.warn(`⚠️ User not found for ID: ${userId}`);
      return res.status(404).json({ error: "User not found" });
    }

    // If profilePic is a string path (like 'uploads/filename'), read file and convert to base64
    if (user.profilePic && typeof user.profilePic === "string") {
      try {
        // Normalize path for cross-platform compatibility
        const filePath = path.resolve(user.profilePic.replace(/\\/g, "/"));

        // Read image file as buffer
        const imgBuffer = await fs.readFile(filePath);

        // Detect mime type from file extension
        const contentType = mime.lookup(filePath) || "image/jpeg";

        // Convert to base64 string
        const base64Image = imgBuffer.toString("base64");

        // Replace profilePic string path with data URL for frontend usage
        user.profilePic = `data:${contentType};base64,${base64Image}`;
      } catch (readError) {
        console.error("❌ Failed to read profilePic file:", readError);
        // If error reading file, set profilePic to null so frontend shows fallback
        user.profilePic = null;
      }
    }

    console.log("✅ User profile fetched:", user);
    response200(res, user);
  } catch (error) {
    console.error("❌ Error fetching user profile:", error);
    internalServerResponse(res, error);
  }
};

export default getUserProfile;
