const express = require("express");
const router = express.Router();
const progressController = require("../controllers/progressController");
const { progressValidationRules } = require("../middlewares/progressValidator");
const validate = require("../middlewares/validateRequest");

// routes/progress.js
router.post(
  "/:userId/:subjectId/:chapterId",
  progressController.createProgress
);

// Get progress for user and subject
router.get(
  "/:userId/:subjectId",
  progressValidationRules(),
  validate,
  progressController.getProgress
);

// Update progress for chapter
router.patch(
  "/:userId/:subjectId/:chapterId",
  progressValidationRules(),
  validate,
  progressController.updateChapterProgress
);

// Mark chapter complete
router.patch(
  "/:userId/:subjectId/:chapterId/complete",
  progressValidationRules(),
  validate,
  progressController.markChapterComplete
);

// Get progress for specific chapter
router.get(
  "/:userId/:subjectId/:chapterId",
  progressValidationRules(),
  validate,
  progressController.getChapterProgress
);

module.exports = router;
