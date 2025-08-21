const ChapterService = require("../services/chapterService");

exports.createChapter = async (req, res) => {
  try {
    const chapter = await ChapterService.createChapter(req.body);
    res.status(201).json(chapter);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getAllChapters = async (req, res) => {
  try {
    const chapters = await ChapterService.getAllChapters();
    res.json(chapters);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getChapterById = async (req, res) => {
  try {
    const chapter = await ChapterService.getChapterById(req.params.id);
    if (!chapter) return res.status(404).json({ message: "Chapter not found" });
    res.json(chapter);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateChapter = async (req, res) => {
  try {
    const updatedChapter = await ChapterService.updateChapter(
      req.params.id,
      req.body
    );
    if (!updatedChapter)
      return res.status(404).json({ message: "Chapter not found" });
    res.json(updatedChapter);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteChapter = async (req, res) => {
  try {
    const deleted = await ChapterService.deleteChapter(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Chapter not found" });
    res.json({ message: "Chapter deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getChaptersBySemester = async (req, res) => {
  try {
    const semester = parseInt(req.params.semester);
    const chapters = await ChapterService.getChaptersBySemester(semester);
    res.json(chapters);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
exports.getChaptersBySubject = async (req, res) => {
  try {
    const chapters = await ChapterService.getChaptersBySubject(
      req.params.subjectId
    );
    res.json(chapters);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getChapterByNumber = async (req, res) => {
  try {
    const chapterNumber = parseInt(req.params.chapterNumber);

    const chapters = await ChapterService.getChaptersByNumber(chapterNumber);

    if (!chapters || chapters.length === 0) {
      return res.status(404).json({ message: "Chapter not found" });
    }

    res.json(chapters);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
