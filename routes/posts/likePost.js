import postModel from "../../models/postModel.js";
import User from "../../models/userModel.js";

export default async function likePost(req, res) {
  const userId = req.user._id;

  try {
    const user = await User.findById(userId).select("phone");
    if (!user) return res.status(400).json({ message: "User not found" });

    const postId = req.params.postId;
    const post = await postModel.findById(postId);
    if (!post) return res.status(404).json({ message: "Post not found" });

    const alreadyLiked = post.likedBy.some(
      (like) => like.user.toString() === userId.toString()
    );

    if (alreadyLiked) {
      post.likedBy = post.likedBy.filter(
        (like) => like.user.toString() !== userId.toString()
      );
    } else {
      post.likedBy.push({ user: userId, date: new Date() });
    }

    const updatedPost = await post.save();
    await updatedPost.populate("likedBy.user", "phone");

    // Format likedBy to send only phone + date
    const formattedPost = {
      ...updatedPost.toObject(),
      likedBy: updatedPost.likedBy.map((entry) => ({
        user: { phone: entry.user?.phone || null },
        date: entry.date,
      })),
    };

    console.log("FORMATTED POST:",formattedPost)

    return res.status(200).json({
      success: true,
      message: "Like updated",
      post: formattedPost,
    });
  } catch (err) {
    console.error("Error in liking the post:", err);
    return res.status(500).json({ message: "Internal Server Error" });
  }
}
