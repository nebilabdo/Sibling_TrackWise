const express = require("express");
const router = express.Router();

const { protect, adminOnly } = require("../middlewares/authMiddleware");
const subjectController = require("../controllers/subjectController");
const chapterController = require("../controllers/chapterController");
const topicController = require("../controllers/topicController");
const userController = require("../controllers/userController");

router.get(
  "/users/role/:role",
  protect,
  adminOnly,
  userController.getUsersByRole
);

// SUBJECTS
router.post("/subjects", protect, adminOnly, subjectController.createSubject);
router.put(
  "/subjects/:id",
  protect,
  adminOnly,
  subjectController.updateSubject
);
router.delete(
  "/subjects/:id",
  protect,
  adminOnly,
  subjectController.deleteSubject
);

// CHAPTERS
router.post("/chapters", protect, adminOnly, chapterController.createChapter);
router.put(
  "/chapters/:id",
  protect,
  adminOnly,
  chapterController.updateChapter
);
router.delete(
  "/chapters/:id",
  protect,
  adminOnly,
  chapterController.deleteChapter
);

// TOPICS
router.post("/topics", protect, adminOnly, topicController.createTopic);
router.put("/topics/:id", protect, adminOnly, topicController.updateTopic);
router.delete("/topics/:id", protect, adminOnly, topicController.deleteTopic);

module.exports = router;
