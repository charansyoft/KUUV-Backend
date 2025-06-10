import { matchedData } from "express-validator";
import categoryModel from "../../models/categoryModel.js";
import { response200 } from "../../responses/successResponses.js";
import { internalServerResponse } from "../../responses/serverErrorResponses.js";

export default async function createCategory(req, res) {
  try {
    const requestData = matchedData(req);
    const { name, location, image, joinedUsers } = requestData; // ✨ updated

    const existingCategory = await categoryModel.findOne({
      name,
      location,
    });

    if (existingCategory) {
      return response200(res, {
        msg: "Category already exists",
        category: existingCategory,
      });
    }

    const newCategory = new categoryModel({
      name,
      location,
      image: image || "",
      joinedUsers: joinedUsers || [], // ✨ updated
    });

    await newCategory.save();

    return response200(res, {
      msg: "Category created successfully",
      category: newCategory,
    });
  } catch (err) {
    console.error("❌ Error creating category:", err);
    return internalServerResponse(res);
  }
}
