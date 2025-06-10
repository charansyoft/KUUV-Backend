import fs from "fs";
import path from "path";
import mongoose from "mongoose";
import GroupMessagesModel from "../../models/GroupMessagesModel.js";
import categoryModel from "../../models/categoryModel.js";
import { internalServerResponse } from "../../responses/serverErrorResponses.js";
import { response200 } from "../../responses/successResponses.js";

export default async function GetUserPosts(req, res) {
  try {
    const userId = req.user?._id;
    if (!userId) {
      return res.status(401).json({ message: "User Not Found !!!" });
    }

    // Get all posts created by user, with createdBy populated
    const posts = await GroupMessagesModel.find({ createdBy: userId, type: "post" })
      .populate({
        path: "createdBy",
        select: "name phone profilePic",
      })
      .lean(); // lean() to get plain JS objects

    // For each post, replace 'group' ObjectId with category name
    // We'll fetch all categories for posts in a single query to optimize
    const groupIds = [...new Set(posts.map((post) => post.group.toString()))]; // unique group IDs

    // Fetch category names by IDs
    const categories = await categoryModel
      .find({ _id: { $in: groupIds } })
      .select("name")
      .lean();

    // Create map from groupId to groupName
    const groupIdToNameMap = {};
    categories.forEach((cat) => {
      groupIdToNameMap[cat._id.toString()] = cat.name;
    });

    // Map posts to replace group id with group name
    const postsWithGroupName = posts.map((post) => {
      return {
        ...post,
        group: groupIdToNameMap[post.group.toString()] || post.group, // fallback to original if no name found
      };
    });

    console.log("posts with group names:", postsWithGroupName);

    return response200(res, postsWithGroupName);
  } catch (err) {
    console.error("Error in GetUserPosts:", err);
    return internalServerResponse(res, err);
  }
}
