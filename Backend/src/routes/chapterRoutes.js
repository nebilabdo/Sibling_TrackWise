const express = require("express");
const router = express.Router();
const {
  getAllChapters,
  getChapterById,
  getChaptersBySemester,
  getChaptersBySubject,
  getChapterByNumber,
} = require("../controllers/chapterController");

router.get("/", getAllChapters);
router.get("/:id", getChapterById);
router.get("/semester/:semester", getChaptersBySemester);
router.get("/subject/:subjectId", getChaptersBySubject);
router.get("/:subjectId/number/:chapterNumber", getChapterByNumber);

module.exports = router;
