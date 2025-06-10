import User from "../../models/userModel.js";
import UserGroup from "../../models/UserGroupModel.js";
import Category from "../../models/categoryModel.js";

export const getJoinedGroupsByPhone = async (req, res) => {
  try {
    console.log("Received request data:", req.body);
    const { phone, joinedGroups } = req.body;

    // Step 1: Find the user by phone
    const user = await User.findOne({ phone });
    if (!user) {
      return res.status(404).json({ message: "User not found with this phone number" });
    }

    console.log("User found with ID:", user._id);

    // Step 2: Update user's groups
    await User.findOneAndUpdate(
      { phone },
      { $addToSet: { groups: { $each: joinedGroups } } },
      { new: true }
    );

    console.log("Update User Groups")

    // Step 3: Update or create UserGroup
    await UserGroup.findOneAndUpdate(
      { userId: user._id },
      {
        $addToSet: { groupIds: { $each: joinedGroups } },
        $setOnInsert: { joined: true },
      },
      { upsert: true, new: true }
    );

    console.log("update or create User Groups")

    // Step 4: Update each Category with this user as a joinedUser
    for (const groupId of joinedGroups) {
      await Category.findByIdAndUpdate(
        groupId,
        {
          $addToSet: { joinedUsers: user._id },
        },
        { new: true }
      );
    }

    console.log("Filetering Groups ")

    // Step 5: Fetch updated group info and populate joinedUsers' phones
    const updatedGroups = await Category.find({ _id: { $in: joinedGroups } })
      .populate("joinedUsers", "phone") // populate only phone field
      .lean();

    // Format joinedUsers as just an array of phone numbers for each group
    const groupsWithPhones = updatedGroups.map((group) => ({
      _id: group._id,
      name: group.name,
      joinedUserPhones: group.joinedUsers.map((u) => u.phone),
    }));
    console.log("groupsWithPhones :", groupsWithPhones)
    // Step 6: Respond with updated group phone lists
    res.status(200).json({
      status: "success",
      message: "Successfully joined groups and updated categories",
      groups: groupsWithPhones,
    });

  } catch (error) {
    console.error("Error joining groups:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
