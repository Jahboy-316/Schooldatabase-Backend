const { subjects, getNextSubjectId } = require("../../data/subjects");
const { results } = require("../../data/results");
const { teachers } = require("../../data/teachers");
const { validateCreateSubject, validateUpdateSubject } = require("../../validators/subjectValidator");

const createSubject = (req, res, next) => {
  try {
    const error = validateCreateSubject(req.body);
    if (error) {
      return res.status(400).json({ success: false, message: error });
    }

    const { name } = req.body;

    const existingSubject = subjects.find((s) => s.name.toLowerCase() === name.toLowerCase().trim());
    if (existingSubject) {
      return res.status(409).json({ success: false, message: "A subject with this name already exists" });
    }

    const newSubject = {
      id: getNextSubjectId(),
      name: name.trim(),
      createdAt: new Date().toISOString()
    };

    subjects.push(newSubject);

    res.status(201).json({
      message: "Subject created successfully",
      subject: newSubject
    });
  } catch (error) {
    next(error);
  }
};

const getAllSubjects = (req, res, next) => {
  try {
    res.status(200).json({
      message: "Subjects retrieved successfully",
      subjects
    });
  } catch (error) {
    next(error);
  }
};

const getSubjectById = (req, res, next) => {
  try {
    const id = Number(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ success: false, message: "Invalid subject ID" });
    }

    const subject = subjects.find((s) => s.id === id);
    if (!subject) {
      return res.status(404).json({ success: false, message: "Subject not found" });
    }

    res.status(200).json({
      message: "Subject retrieved successfully",
      subject
    });
  } catch (error) {
    next(error);
  }
};

const updateSubject = (req, res, next) => {
  try {
    const id = Number(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ success: false, message: "Invalid subject ID" });
    }

    const subject = subjects.find((s) => s.id === id);
    if (!subject) {
      return res.status(404).json({ success: false, message: "Subject not found" });
    }

    const error = validateUpdateSubject(req.body);
    if (error) {
      return res.status(400).json({ success: false, message: error });
    }

    const { name } = req.body;

    if (name) {
      const duplicate = subjects.find((s) => s.name.toLowerCase() === name.toLowerCase().trim() && s.id !== id);
      if (duplicate) {
        return res.status(409).json({ success: false, message: "A subject with this name already exists" });
      }
      subject.name = name.trim();
    }

    res.status(200).json({
      message: "Subject updated successfully",
      subject
    });
  } catch (error) {
    next(error);
  }
};

const deleteSubject = (req, res, next) => {
  try {
    const id = Number(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ success: false, message: "Invalid subject ID" });
    }

    const index = subjects.findIndex((s) => s.id === id);
    if (index === -1) {
      return res.status(404).json({ success: false, message: "Subject not found" });
    }

    const hasResults = results.some((r) => r.subjectId === id);
    if (hasResults) {
      return res.status(400).json({
        success: false,
        message: "Cannot delete subject with existing results. Delete the results first."
      });
    }

    const hasTeachers = teachers.some((t) => t.subjectId === id || t.subject === id);
    if (hasTeachers) {
      return res.status(400).json({
        success: false,
        message: "Cannot delete subject assigned to teachers. Reassign or remove teachers first."
      });
    }

    subjects.splice(index, 1);

    res.status(200).json({ message: "Subject deleted successfully" });
  } catch (error) {
    next(error);
  }
};

module.exports = { createSubject, getAllSubjects, getSubjectById, updateSubject, deleteSubject };
