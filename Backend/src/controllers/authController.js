const { loginUser } = require("../services/authService");

const login = async (req, res) => {
  try {
    const result = await loginUser(req.body);
    res.status(200).json(result);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};
const logout = (req, res) => {
  // Handle logout logic, e.g., clearing session or token
  res.status(200).json({ message: "Logged out successfully" });
};

module.exports = { login };
