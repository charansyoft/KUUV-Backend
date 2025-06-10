import GroupMessagesModel from "../../models/GroupMessagesModel.js";
import User from "../../models/userModel.js";
import Notification from "../../models/Notifications/notificationSchema.js";

export const expressInterest = async (req, res) => {
  const { postId, createdBy, groupId } = req.body;
  const userId = req.user._id;

  console.log(`📩 User ${userId} is expressing interest in post ${postId}, created by ${createdBy} in group ${groupId}`);

  try {
    // Check if the user exists and get phone
    const user = await User.findById(userId).select("phone name");
    if (!user) {
      console.warn("⚠️ User not found");
      return res.status(404).json({ success: false, message: "User not found" });
    }

    // Check if the post exists
    const post = await GroupMessagesModel.findById(postId);
    if (!post) {
      console.warn("⚠️ Post not found");
      return res.status(404).json({ success: false, message: "Post not found" });
    }

    // Add userId to expressedInterest if not already there
    const updatedPost = await GroupMessagesModel.findByIdAndUpdate(
      postId,
      { $addToSet: { expressedInterest: userId } },
      { new: true }
    );

    // Check for duplicate notification
    const existingNotification = await Notification.findOne({
      type: "interest",
      fromUser: userId,
      toUser: createdBy,
      groupId: groupId || null,
      postId: postId || null,
    });

    if (existingNotification) {
      console.log("⚠️ Duplicate notification found. Skipping creation.");
      return res.status(200).json({
        success: true,
        message: "Interest expressed but notification already exists",
        expressedInterest: updatedPost.expressedInterest,
        userPhone: user.phone,
      });
    }

    // Create a notification
    const notification = new Notification({
      type: "interest",
      fromUser: userId,
      toUser: createdBy,
      groupId: groupId || null,
      postId: postId || null,
      message: `${user.name} expressed interest in your post.`,
    });

    await notification.save();
    console.log("📨 Notification saved:", notification._id);

    return res.status(200).json({
      success: true,
      message: "Interest expressed and notification sent successfully",
      expressedInterest: updatedPost.expressedInterest,
      userPhone: user.phone,
    });
  } catch (error) {
    console.error("❌ DB Error:", error.message);
    return res.status(500).json({ success: false, message: "DB Error" });
  }
};
