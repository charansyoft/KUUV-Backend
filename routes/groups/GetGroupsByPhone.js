import { validationResult } from 'express-validator';
import User from '../../models/userModel.js';
import Category from '../../models/categoryModel.js';

// Controller for GetGroupsByPhone
const GetGroupsByPhone = async (req, res) => {
  // Check for validation errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { phoneNumber } = req.body;

  try {
    // Find the user by phone number
    const user = await User.findOne({ phone: phoneNumber });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Fetch the categories where the user is a part of
    const groups = await Category.find({ 'joinedUsers': user._id });

    if (groups.length === 0) {
      return res.status(404).json({ message: 'No groups found for this user.' });
    }

    // Return the list of groups
    return res.status(200).json(groups);
  } catch (error) {
    console.error('Error fetching groups:', error);
    return res.status(500).json({ message: 'Server Error' });
  }
};

export default GetGroupsByPhone;
