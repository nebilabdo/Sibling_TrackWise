const express = require("express");
const router = express.Router();
const chapterPageController = require("../controllers/chapterPageController");

router.get(
  "/chapter/:chapterId/pages",
  chapterPageController.getPagesByChapter
);
router.get("/:chapterId/:pageNumber", chapterPageController.getPage);

router.post("/", chapterPageController.createPage);

module.exports = router;
