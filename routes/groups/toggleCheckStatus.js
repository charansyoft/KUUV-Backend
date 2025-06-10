import mongoose from "mongoose";
import User from "../../models/userModel.js";
import Category from "../../models/categoryModel.js";
import UserGroup from "../../models/UserGroupModel.js";
export const toggleCheckStatus = async (req, res) => {
  try {
    const { name, phoneNumber } = req.body;

    console.log("Name:", name);
    console.log("Phone Number:", phoneNumber);

    // 1. Find category by name
    const category = await Category.findOne({ name });
    if (!category) {
      console.log("Category with name not found");
      return res.status(404).json({ message: "Category not found", exists: false });
    }

    // 2. Find user by phone number
    const user = await User.findOne({ phone: phoneNumber });
    if (!user) {
      console.log("User with phone number not found");
      return res.status(404).json({ message: "User not found", exists: false });
    }

    console.log("Category ID:", category._id);
    console.log("User ID:", user._id);

    // 3. Check if user is joined to the group
    const userGroup = await UserGroup.findOne({
      userId: user._id,
      groupId: category._id,
    });
console.log("USERDATA:",userGroup)
    const joined = !!userGroup; // true if exists, false if null

    console.log("Joined Status:", joined);

    return res.status(200).json({
      message: joined ? "User has joined the group" : "User has not joined the group",
      exists: true,
      joined,
      userId: user._id,
      categoryId: category._id,
    });

  } catch (error) {
    console.error("Error:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};
