import mongoose from 'mongoose';

const userGroupSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',           // Reference to User model
      required: true,
      unique: true           // Ensure only one document per user
    },
    groupIds: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category'      // Reference to Category (Group) model
      }
    ],
    joined: {
      type: Boolean,
      default: true          // Indicates the user has joined these groups
    },
  },
  { timestamps: true }
);

const UserGroup = mongoose.model('UserGroup', userGroupSchema);
export default UserGroup;
