const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const { registerValidation } = require("../validators/userValidator");
const validateRequest = require("../middlewares/validateRequest");
const { protect, adminOnly } = require("../middlewares/authMiddleware");

router.post(
  "/register",
  registerValidation,
  validateRequest,
  userController.register
);
// Authenticated user routes
router.get("/profile", protect, userController.getProfile);
router.put(
  "/profile",
  protect,
  // upload.single("avatar"),
  userController.updateProfile
);
router.put("/profile/password", protect, userController.changePassword);

module.exports = router;
