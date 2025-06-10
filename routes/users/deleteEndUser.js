import userModel from "../../models/userModel.js";
import { internalServerResponse } from "../../responses/serverErrorResponses.js";
import { response200 } from "../../responses/successResponses.js";

export default async function deleteEndUser(req, res) {
  try {
    const user = req.user;
    const deleteUserResult = await userModel.findOneAndUpdate(
      {
        _id: user._id,
      },
      {
        deleted: true,
      },
      { new: true }
    );
    console.log({ deleteUserResult });

    response200(res, {});
  } catch (err) {
    console.log(err);
    internalServerResponse(res);
  }
}
