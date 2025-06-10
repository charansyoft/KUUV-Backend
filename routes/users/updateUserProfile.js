import multer from "multer";
import User from "../../models/userModel.js";

const upload = multer({ dest: "uploads/" });

export const updateUserProfile = [
  upload.single("profileImage"),  // handle file upload first

  async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: "No file uploaded" });
      }

      console.log("✅ Received file:", req.file);

      const userId = req.user?.id || req.user?._id;
      if (!userId) {
        return res.status(401).json({ error: "User ID not found in token" });
      }

      const { name, description } = req.body;

      const updatedUser = await User.findByIdAndUpdate(
        userId,
        {
          profilePic: req.file.path,
          ...(name !== undefined && { name }),
          ...(description !== undefined && { description }),
        },
        { new: true }
      );

      if (!updatedUser) {
        return res.status(404).json({ error: "User not found" });
      }

      console.log("✅ Updated User:", updatedUser);

      res.json({
        message: "Profile updated successfully",
        user: updatedUser,
      });
    } catch (error) {
      console.error("❌ Error updating profile:", error);
      res.status(500).json({ error: "Server error" });
    }
  },
];
