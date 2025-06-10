import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, default: "" },
    ccode: { type: String },
    profilePic: { type: String, default: "" }, // just a string path now
    phone: { type: String, required: true, unique: true },
    role: { type: String, enum: ["enduser", "admin"], default: "enduser" },
    deleted: { type: Boolean, default: false },
    description: { type: String, default: "" },
    groups: [{ type: mongoose.Schema.Types.ObjectId, ref: "Category" }],
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);
export default User;
