import categoryModel from "../../models/categoryModel.js";
import { internalServerResponse } from "../../responses/serverErrorResponses.js";
import { response200 } from "../../responses/successResponses.js";
import User from "../../models/userModel.js";

export default async function getCategories(req, res) {
  console.log("dsdasda", req.query);
  const { phone } = req.query;
  console.log("📥 Received phone from query:", phone);

  if (!phone) {
    return res.status(400).json({ error: "Phone number is required" });
  }

  const user = await User.findOne({ phone });

  if (!user) {
    console.log("❌ No user found for phone:", phone);
    return res.status(404).json({ error: "User not found" });
  }

  console.log("✅ User ID found:", user._id);

  const locationName = req.query.location?.trim();
  console.log("📥 Received locationName from query:", locationName);

  if (!locationName) {
    return res.status(400).json({ error: "Location name is required" });
  }

  try {
    // Use categoryModel here (not Category)
    const categories = await categoryModel.find({ location: locationName })
      .populate({
        path: "joinedUsers",
        select: "phone name", // include other fields if needed
      });

    console.log("📦 Categories fetched from DB:", categories);

    if (categories.length > 0) {
      return response200(res, {
        categories,
        userId: user._id,
      });
    } else {
      return res
        .status(404)
        .json({ error: "No categories found for this location" });
    }
  } catch (err) {
    console.error("❌ Error in fetching categories:", err);
    internalServerResponse(res);
  }
}
