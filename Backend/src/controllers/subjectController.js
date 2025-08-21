const SubjectService = require("../services/subjectService");

exports.createSubject = async (req, res) => {
  try {
    const subject = await SubjectService.createSubject(req.body);
    res.status(201).json(subject);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getAllSubjects = async (req, res) => {
  try {
    const subjects = await SubjectService.getAllSubjects();
    res.json(subjects);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getSubjectById = async (req, res) => {
  try {
    const subject = await SubjectService.getSubjectById(req.params.id);
    if (!subject) return res.status(404).json({ message: "Subject not found" });
    res.json(subject);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateSubject = async (req, res) => {
  try {
    const updatedSubject = await SubjectService.updateSubject(
      req.params.id,
      req.body
    );
    if (!updatedSubject)
      return res.status(404).json({ message: "Subject not found" });
    res.json(updatedSubject);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteSubject = async (req, res) => {
  try {
    const deleted = await SubjectService.deleteSubject(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Subject not found" });
    res.json({ message: "Subject deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getSubjectsWithChapterCounts = async (req, res) => {
  try {
    const subjects = await SubjectService.getSubjectsWithChapterCounts();
    res.json(subjects);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
