const progressService = require("../services/progressService");

const getProgress = async (req, res) => {
  try {
    const { userId, subjectId } = req.params;
    const progress = await progressService.getSubjectProgress(
      userId,
      subjectId
    );
    res.json(progress);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getChapterProgress = async (req, res) => {
  try {
    const { userId, subjectId, chapterId } = req.params;
    const progress = await progressService.getChapterProgress(
      userId,
      subjectId,
      chapterId
    );
    res.json(progress);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateChapterProgress = async (req, res) => {
  try {
    const { userId, subjectId, chapterId } = req.params;
    const progress = await progressService.updateChapterProgress(
      userId,
      subjectId,
      chapterId,
      req.body
    );
    res.json(progress);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const markChapterComplete = async (req, res) => {
  try {
    const { userId, subjectId, chapterId } = req.params;
    const progress = await progressService.markChapterComplete(
      userId,
      subjectId,
      chapterId
    );
    res.json(progress);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createProgress = async (req, res) => {
  try {
    const { userId, subjectId, chapterId } = req.params;
    const progress = await progressService.createProgress(
      userId,
      subjectId,
      chapterId,
      req.body
    );
    res.status(201).json(progress);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createProgress,
  getProgress,
  getChapterProgress,
  updateChapterProgress,
  markChapterComplete,
};
