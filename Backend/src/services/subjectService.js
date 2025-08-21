const Subject = require("../models/subjectModel");
const Chapter = require("../models/chapterModel");

exports.createSubject = async (data) => {
  const subject = new Subject(data);
  return await subject.save();
};

exports.getAllSubjects = async () => {
  return await Subject.find();
};

exports.getSubjectById = async (id) => {
  return await Subject.findById(id);
};

exports.updateSubject = async (id, data) => {
  return await Subject.findByIdAndUpdate(id, data, { new: true });
};

exports.deleteSubject = async (id) => {
  const result = await Subject.findByIdAndDelete(id);
  return result !== null;
};

exports.getSubjectsWithChapterCounts = async () => {
  const subjects = await Subject.find();
  const subjectsWithCounts = await Promise.all(
    subjects.map(async (subject) => {
      const chapterCount = await Chapter.countDocuments({
        subject: subject._id,
      });
      return {
        ...subject.toObject(),
        totalChapters: chapterCount,
      };
    })
  );
  return subjectsWithCounts;
};
