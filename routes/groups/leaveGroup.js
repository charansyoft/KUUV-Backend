export const leaveGroup = async (req, res) => {
  const { groupId } = req.body;
  const userPhone = req.user?.phone; // assuming verifyToken middleware sets req.user

  console.log("Leaving group:", groupId);
  console.log("User phone:", userPhone);

  try {
    // TODO: Replace with actual DB logic using your Group model
    // Example with Mongoose:
    // await Group.updateOne(
    //   { _id: groupId },
    //   { $pull: { joinedUsers: { phone: userPhone } } }
    // );

    res.status(200).json({
      success: true,
      message: `User ${userPhone} left group ${groupId}`,
    });
  } catch (error) {
    console.error("Error in leaveGr:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};
