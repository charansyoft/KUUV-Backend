import User from "../../models/userModel.js";
import UserGroupModel from "../../models/UserGroupModel.js"; // User-Group relationship model

// Inline success response helper
const successResponse = (res, message, data = {}) => {
  res.status(200).json({
    success: true,
    message,
    data,
  });
};

// Inline error response helper
const errorResponse = (res, message, statusCode = 500) => {
  res.status(statusCode).json({
    success: false,
    message,
  });
};

// Controller function for toggling join status
const toggleGroupJoin = async (req, res) => {
  try {
    const { phoneNumber, groupId } = req.body;
    console.log("📥 Received request body:", { phoneNumber, groupId });

    // Validate inputs are present
    if (!phoneNumber || !groupId) {
      console.log("❌ Missing phoneNumber or groupId");
      return errorResponse(res, "phoneNumber and groupId are required", 400);
    }

    // Fetch user document by phone number
    const user = await User.findOne({ phone: phoneNumber });
    if (!user) {
      console.log("❌ User not found with phone number:", phoneNumber);
      return errorResponse(res, "User not found", 404);
    }

    // Log the userId (which is _id in the MongoDB document)
    console.log("📱 Found user:", { phoneNumber, userId: user._id });

    // Check if the user is already part of the group
    const existingMembership = await UserGroupModel.findOne({ userId: user._id, groupId });
    console.log("🔍 Existing membership:", existingMembership);

    if (existingMembership) {
      // If already joined, remove the user from the group (unjoin)
      await UserGroupModel.deleteOne({ userId: user._id, groupId });
      console.log("🚫 Unjoined group for phone:", phoneNumber);
      return successResponse(res, "Successfully unjoined the group");
    } else {
      // If not joined, add the user to the group (join)
      const newMembership = new UserGroupModel({ userId: user._id, groupId });
      await newMembership.save();
      console.log("✅ Joined group:", newMembership);
      return successResponse(res, "Successfully joined the group");
    }
  } catch (error) {
    console.log("🔥 Error in toggleGroupJoin:", error.message);
    return errorResponse(res, error.message);
  }
};

export default toggleGroupJoin;
