const User = require("../models/userModel");
const bcrypt = require("bcryptjs");
// const { uploadToCloudinary } = require("../utils/upload");

// User Registration
// User Registration
const registerUser = async (userData) => {
  const existing = await User.findOne({ email: userData.email });
  if (existing) throw new Error("User already exists");

  const newUser = new User({
    ...userData,
    ...(userData.role === "child" && { parentId: userData.parentId }),
  });
  return await newUser.save(); // password will be hashed by pre("save") hook
};

// User Management
const getUserByRole = async (role) => {
  return await User.find({ role }).select("-password");
};

const getUserById = async (id) => {
  return await User.findById(id).select("-password");
};

// Profile Management
const updateUserProfile = async (userId, updateData, file) => {
  let updateFields = {
    ...updateData,
    updatedAt: Date.now(),
  };

  if (file) {
    const result = await uploadToCloudinary(file);
    updateFields.avatar = result.secure_url;
  }

  return await User.findByIdAndUpdate(userId, updateFields, {
    new: true,
  }).select("-password");
};

const changeUserPassword = async (userId, currentPassword, newPassword) => {
  const user = await User.findById(userId);
  if (!user) throw new Error("User not found");

  const isMatch = await user.comparePassword(currentPassword);
  if (!isMatch) throw new Error("Current password is incorrect");

  user.password = newPassword;
  await user.save();

  return user;
};

module.exports = {
  registerUser,
  getUserByRole,
  getUserById,
  updateUserProfile,
  changeUserPassword,
};
