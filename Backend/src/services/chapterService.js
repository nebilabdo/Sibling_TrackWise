const Chapter = require("../models/chapterModel");

exports.createChapter = async (data) => {
  const chapter = new Chapter(data);
  return await chapter.save();
};

exports.getAllChapters = async () => {
  return await Chapter.find();
};

exports.getChapterById = async (id) => {
  return await Chapter.findById(id);
};

exports.updateChapter = async (id, data) => {
  return await Chapter.findByIdAndUpdate(id, data, { new: true });
};

exports.deleteChapter = async (id) => {
  const result = await Chapter.findByIdAndDelete(id);
  return result !== null;
};

exports.getChaptersBySemester = async (semester) => {
  return await Chapter.find({ semester: semester });
};
exports.getChaptersBySubject = async (subjectId) => {
  return await Chapter.find({ subject: subjectId });
};

exports.getChaptersByNumber = async (chapterNumber) => {
  return await Chapter.find({ chapterNumber: chapterNumber });
};
