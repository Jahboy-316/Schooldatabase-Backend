const { classes, getNextClassId } = require("../../data/classes");
const { students } = require("../../data/students");
const { teachers } = require("../../data/teachers");
const { validateCreateClass, validateUpdateClass } = require("../../validators/classValidator");

const createClass = (req, res, next) => {
  try {
    const error = validateCreateClass(req.body);
    if (error) {
      return res.status(400).json({ success: false, message: error });
    }

    const { name, teacherId } = req.body;

    const existingClass = classes.find((c) => c.name.toLowerCase() === name.toLowerCase().trim());
    if (existingClass) {
      return res.status(409).json({ success: false, message: "A class with this name already exists" });
    }

    if (teacherId !== undefined && teacherId !== null) {
      const teacher = teachers.find((t) => t.id === teacherId);
      if (!teacher) {
        return res.status(404).json({ success: false, message: "Teacher not found" });
      }
    }

    const newClass = {
      id: getNextClassId(),
      name: name.trim(),
      teacherId: (teacherId !== undefined && teacherId !== null) ? teacherId : null,
      createdAt: new Date().toISOString()
    };

    classes.push(newClass);

    res.status(201).json({
      message: "Class created successfully",
      class: newClass
    });
  } catch (error) {
    next(error);
  }
};

const getAllClasses = (req, res, next) => {
  try {
    if (req.user.role === "student") {
      const student = students.find((s) => s.userId === req.user.id || s.email === req.user.email);
      const studentClassId = student ? (student.classId || student.class) : null;
      if (!studentClassId) {
        return res.status(200).json({ message: "Classes retrieved successfully", classes: [] });
      }
      const myClass = classes.find((c) => c.id === studentClassId);
      return res.status(200).json({
        message: "Classes retrieved successfully",
        classes: myClass ? [myClass] : []
      });
    }

    res.status(200).json({
      message: "Classes retrieved successfully",
      classes
    });
  } catch (error) {
    next(error);
  }
};

const getClassById = (req, res, next) => {
  try {
    const id = Number(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ success: false, message: "Invalid class ID" });
    }

    const foundClass = classes.find((c) => c.id === id);
    if (!foundClass) {
      return res.status(404).json({ success: false, message: "Class not found" });
    }

    if (req.user.role === "student") {
      const student = students.find((s) => s.userId === req.user.id || s.email === req.user.email);
      const studentClassId = student ? (student.classId || student.class) : null;
      if (!student || studentClassId !== id) {
        return res.status(403).json({ success: false, message: "Forbidden" });
      }
    }

    res.status(200).json({
      message: "Class retrieved successfully",
      class: foundClass
    });
  } catch (error) {
    next(error);
  }
};

const updateClass = (req, res, next) => {
  try {
    const id = Number(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ success: false, message: "Invalid class ID" });
    }

    const foundClass = classes.find((c) => c.id === id);
    if (!foundClass) {
      return res.status(404).json({ success: false, message: "Class not found" });
    }

    const error = validateUpdateClass(req.body);
    if (error) {
      return res.status(400).json({ success: false, message: error });
    }

    const { name, teacherId } = req.body;

    if (name) {
      const duplicate = classes.find((c) => c.name.toLowerCase() === name.toLowerCase().trim() && c.id !== id);
      if (duplicate) {
        return res.status(409).json({ success: false, message: "A class with this name already exists" });
      }
      foundClass.name = name.trim();
    }

    if (teacherId !== undefined) {
      if (teacherId !== null) {
        const teacher = teachers.find((t) => t.id === teacherId);
        if (!teacher) {
          return res.status(404).json({ success: false, message: "Teacher not found" });
        }
      }
      foundClass.teacherId = teacherId;
    }

    res.status(200).json({
      message: "Class updated successfully",
      class: foundClass
    });
  } catch (error) {
    next(error);
  }
};

const deleteClass = (req, res, next) => {
  try {
    const id = Number(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ success: false, message: "Invalid class ID" });
    }

    const index = classes.findIndex((c) => c.id === id);
    if (index === -1) {
      return res.status(404).json({ success: false, message: "Class not found" });
    }

    const hasStudents = students.some((s) => s.classId === id || s.class === id);
    if (hasStudents) {
      return res.status(400).json({
        success: false,
        message: "Cannot delete class with assigned students. Reassign or remove students first."
      });
    }

    classes.splice(index, 1);

    res.status(200).json({ message: "Class deleted successfully" });
  } catch (error) {
    next(error);
  }
};

module.exports = { createClass, getAllClasses, getClassById, updateClass, deleteClass };
