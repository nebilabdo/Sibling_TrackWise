const userService = require("../services/userService");

// User Registration (public)
const register = async (req, res) => {
  try {
    const user = await userService.registerUser(req.body);
    res.status(201).json({
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      grade: user.grade,
      parentId: user.parentId,
    });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Admin-only User Management
const getUsersByRole = async (req, res) => {
  try {
    const users = await userService.getUserByRole(req.params.role);
    const sanitizedUsers = users.map((u) => ({
      id: u._id,
      name: u.name,
      email: u.email,
      role: u.role,
      grade: u.grade,
      parentId: u.parentId,
      avatar: u.avatar,
    }));
    res.status(200).json(sanitizedUsers);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Profile Management (authenticated users)
const getProfile = async (req, res) => {
  try {
    const user = await userService.getUserById(req.user.id);
    res.status(200).json({
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      grade: user.grade,
      parentId: user.parentId,
      avatar: user.avatar,
      createdAt: user.createdAt,
    });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

const updateProfile = async (req, res) => {
  try {
    const updatedUser = await userService.updateUserProfile(
      req.user.id,
      req.body,
      req.file
    );
    res.status(200).json(updatedUser);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

const changePassword = async (req, res) => {
  try {
    await userService.changeUserPassword(
      req.user.id,
      req.body.currentPassword,
      req.body.newPassword
    );
    res.status(200).json({ message: "Password updated successfully" });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

module.exports = {
  register,
  getUsersByRole,
  getProfile,
  updateProfile,
  changePassword,
};
