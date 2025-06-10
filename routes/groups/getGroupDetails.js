import Category from "../../models/categoryModel.js"; // adjust path as needed

const getGroupDetails = async (req, res) => {
  try {
    // Access the groupId from req.params (URL parameter)
    const { GroupId } = req.params;
  console.log(":::::::::::::::: ", req.params);

    // Access the phone from req.body (request body)
    // const { phone } = req.body;

    console.log("🟢 Received GroupId:", GroupId);
    // console.log("🟢 Received Phone:", phone);

    // Fetch group details from database and populate referenced fields
    const groupDetails = await Category.findById(GroupId)
.populate("joinedUsers", "_id phone")
      .populate("createdBy")
      .populate("updatedBy")
      .populate("locationId");

    // Log the full group details to console
    console.log("📦 Group Details:", groupDetails);

res.status(200).json({
  message: "Group details fetched successfully",
  data: groupDetails,
});
  } catch (err) {
    console.error("❌ Error:", err.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

export default getGroupDetails;
