const Progress = require("../models/progressModel");

class ProgressService {
  // Get progress for a user in a subject and chapter
  async getChapterProgress(userId, subjectId, chapterId) {
    return Progress.findOne({ userId, subjectId, chapterId });
  }

  // Get all progress for a user in a subject
  async getSubjectProgress(userId, subjectId) {
    return Progress.find({ userId, subjectId });
  }

  // Update reading progress (start/stop pages, quiz, test)
  async updateChapterProgress(userId, subjectId, chapterId, updateData) {
    const {
      startPage,
      stopPage,
      quizScore,
      finalTestScore,
      topic,
      totalPages,
    } = updateData;

    let progress = await Progress.findOne({ userId, subjectId, chapterId });

    if (!progress) {
      progress = new Progress({
        userId,
        subjectId,
        chapterId,
        topic,
        totalPages,
      });
    }

    if (startPage !== undefined) progress.startPage = startPage;
    if (stopPage !== undefined) progress.stopPage = stopPage;
    if (quizScore !== undefined) progress.quizScore = quizScore;
    if (finalTestScore !== undefined) progress.finalTestScore = finalTestScore;
    if (topic !== undefined) progress.topic = topic;
    if (totalPages !== undefined) progress.totalPages = totalPages;

    return progress.save();
  }

  // Mark chapter as complete (set stopPage = totalPages)
  async markChapterComplete(userId, subjectId, chapterId) {
    const progress = await Progress.findOne({ userId, subjectId, chapterId });

    if (!progress) {
      throw new Error("Progress record not found");
    }

    progress.stopPage = progress.totalPages;
    progress.isCompleted = true;

    return progress.save();
  }
  async createProgress(userId, subjectId, chapterId, data) {
    const progress = new Progress({
      userId,
      subjectId,
      chapterId,
      ...data,
    });
    return progress.save();
  }
}

module.exports = new ProgressService();
