const { results, getNextResultId } = require("../../data/results");
const { students } = require("../../data/students");
const { subjects } = require("../../data/subjects");
const calculateGrade = require("../../utils/calculateGrade");
const { validateCreateResult, validateUpdateResult } = require("../../validators/resultValidator");

const createResult = (req, res, next) => {
  try {
    const error = validateCreateResult(req.body);
    if (error) {
      return res.status(400).json({ success: false, message: error });
    }

    const { studentId, subjectId, score, term, session } = req.body;

    const student = students.find((s) => s.id === studentId);
    if (!student) {
      return res.status(404).json({ success: false, message: "Student not found" });
    }

    const subject = subjects.find((s) => s.id === subjectId);
    if (!subject) {
      return res.status(404).json({ success: false, message: "Subject not found" });
    }

    const duplicate = results.find((r) =>
      r.studentId === studentId &&
      r.subjectId === subjectId &&
      r.term === term &&
      r.session === session
    );
    if (duplicate) {
      return res.status(409).json({
        success: false,
        message: "A result already exists for this student, subject, term, and session"
      });
    }

    const grade = calculateGrade(score);

    const newResult = {
      id: getNextResultId(),
      studentId,
      subjectId,
      score,
      grade,
      term,
      session,
      createdAt: new Date().toISOString()
    };

    results.push(newResult);

    res.status(201).json({
      message: "Result created successfully",
      result: newResult
    });
  } catch (error) {
    next(error);
  }
};

const getAllResults = (req, res, next) => {
  try {
    if (req.user.role === "student") {
      const student = students.find((s) => s.userId === req.user.id || s.email === req.user.email);
      if (!student) {
        return res.status(200).json({ message: "Results retrieved successfully", results: [] });
      }
      const myResults = results.filter((r) => r.studentId === student.id);
      return res.status(200).json({ message: "Results retrieved successfully", results: myResults });
    }

    res.status(200).json({ message: "Results retrieved successfully", results });
  } catch (error) {
    next(error);
  }
};

const getResultById = (req, res, next) => {
  try {
    const id = Number(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ success: false, message: "Invalid result ID" });
    }

    const result = results.find((r) => r.id === id);
    if (!result) {
      return res.status(404).json({ success: false, message: "Result not found" });
    }

    if (req.user.role === "student") {
      const student = students.find((s) => s.userId === req.user.id || s.email === req.user.email);
      if (!student || result.studentId !== student.id) {
        return res.status(403).json({ success: false, message: "Forbidden" });
      }
    }

    res.status(200).json({ message: "Result retrieved successfully", result });
  } catch (error) {
    next(error);
  }
};

const updateResult = (req, res, next) => {
  try {
    const id = Number(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ success: false, message: "Invalid result ID" });
    }

    const result = results.find((r) => r.id === id);
    if (!result) {
      return res.status(404).json({ success: false, message: "Result not found" });
    }

    const error = validateUpdateResult(req.body);
    if (error) {
      return res.status(400).json({ success: false, message: error });
    }

    const { studentId, subjectId, score, term, session } = req.body;

    const newStudentId = studentId !== undefined ? studentId : result.studentId;
    const newSubjectId = subjectId !== undefined ? subjectId : result.subjectId;
    const newTerm = term || result.term;
    const newSession = session || result.session;

    if (studentId !== undefined) {
      const student = students.find((s) => s.id === studentId);
      if (!student) {
        return res.status(404).json({ success: false, message: "Student not found" });
      }
    }

    if (subjectId !== undefined) {
      const subject = subjects.find((s) => s.id === subjectId);
      if (!subject) {
        return res.status(404).json({ success: false, message: "Subject not found" });
      }
    }

    const duplicate = results.find((r) =>
      r.id !== id &&
      r.studentId === newStudentId &&
      r.subjectId === newSubjectId &&
      r.term === newTerm &&
      r.session === newSession
    );
    if (duplicate) {
      return res.status(409).json({
        success: false,
        message: "A result already exists for this student, subject, term, and session"
      });
    }

    if (studentId !== undefined) result.studentId = studentId;
    if (subjectId !== undefined) result.subjectId = subjectId;
    if (term) result.term = term;
    if (session) result.session = session;

    if (score !== undefined) {
      result.score = score;
      result.grade = calculateGrade(score);
    }

    res.status(200).json({ message: "Result updated successfully", result });
  } catch (error) {
    next(error);
  }
};

const deleteResult = (req, res, next) => {
  try {
    const id = Number(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ success: false, message: "Invalid result ID" });
    }

    const index = results.findIndex((r) => r.id === id);
    if (index === -1) {
      return res.status(404).json({ success: false, message: "Result not found" });
    }

    results.splice(index, 1);

    res.status(200).json({ message: "Result deleted successfully" });
  } catch (error) {
    next(error);
  }
};

module.exports = { createResult, getAllResults, getResultById, updateResult, deleteResult };
