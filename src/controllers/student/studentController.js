const { students, getNextStudentId } = require("../../data/students");
const { classes } = require("../../data/classes");
const { results } = require("../../data/results");
const { users } = require("../../data/users");
const { validateCreateStudent, validateUpdateStudent } = require("../../validators/studentValidator");

const createStudent = (req, res, next) => {
  try {
    const error = validateCreateStudent(req.body);
    if (error) {
      return res.status(400).json({ success: false, message: error });
    }

    const { name, email, phone, userId } = req.body;
    const classVal = req.body.class !== undefined ? req.body.class : req.body.classId;
    const normalizedEmail = email.toLowerCase().trim();

    const existingStudent = students.find((s) => s.email === normalizedEmail);
    if (existingStudent) {
      return res.status(409).json({ success: false, message: "A student with this email already exists" });
    }

    let linkedUserId = userId || null;
    if (linkedUserId) {
      const user = users.find((u) => u.id === linkedUserId);
      if (!user) {
        return res.status(404).json({ success: false, message: "User not found" });
      }
      if (user.role !== "student") {
        return res.status(400).json({ success: false, message: "User is not a student" });
      }
      const alreadyLinked = students.find((s) => s.userId === linkedUserId);
      if (alreadyLinked) {
        return res.status(409).json({ success: false, message: "This user is already linked to a student record" });
      }
    } else {
      const matchingUser = users.find((u) => u.email === normalizedEmail && u.role === "student");
      if (matchingUser && !students.some((s) => s.userId === matchingUser.id)) {
        linkedUserId = matchingUser.id;
      }
    }

    if (classVal !== undefined && classVal !== null) {
      const classExists = classes.find((c) => c.id === classVal);
      if (!classExists) {
        return res.status(404).json({ success: false, message: "Class not found" });
      }
    }

    const newStudent = {
      id: getNextStudentId(),
      userId: linkedUserId,
      name: name.trim(),
      email: normalizedEmail,
      phone: phone.trim(),
      class: (classVal !== undefined && classVal !== null) ? classVal : null,
      classId: (classVal !== undefined && classVal !== null) ? classVal : null,
      createdAt: new Date().toISOString()
    };

    students.push(newStudent);

    res.status(201).json({
      message: "Student created successfully",
      student: newStudent
    });
  } catch (error) {
    next(error);
  }
};

const getAllStudents = (req, res, next) => {
  try {
    res.status(200).json({
      message: "Students retrieved successfully",
      students
    });
  } catch (error) {
    next(error);
  }
};

const getStudentById = (req, res, next) => {
  try {
    const id = Number(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ success: false, message: "Invalid student ID" });
    }

    const student = students.find((s) => s.id === id);
    if (!student) {
      return res.status(404).json({ success: false, message: "Student not found" });
    }

    res.status(200).json({
      message: "Student retrieved successfully",
      student
    });
  } catch (error) {
    next(error);
  }
};

const updateStudent = (req, res, next) => {
  try {
    const id = Number(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ success: false, message: "Invalid student ID" });
    }

    const student = students.find((s) => s.id === id);
    if (!student) {
      return res.status(404).json({ success: false, message: "Student not found" });
    }

    const error = validateUpdateStudent(req.body);
    if (error) {
      return res.status(400).json({ success: false, message: error });
    }

    const { name, email, phone } = req.body;
    const classVal = req.body.class !== undefined ? req.body.class : req.body.classId;

    if (email) {
      const normalizedEmail = email.toLowerCase().trim();
      const duplicate = students.find((s) => s.email === normalizedEmail && s.id !== id);
      if (duplicate) {
        return res.status(409).json({ success: false, message: "A student with this email already exists" });
      }
      student.email = normalizedEmail;
    }

    if (classVal !== undefined) {
      if (classVal !== null) {
        const classExists = classes.find((c) => c.id === classVal);
        if (!classExists) {
          return res.status(404).json({ success: false, message: "Class not found" });
        }
      }
      student.class = classVal;
      student.classId = classVal;
    }

    if (name) student.name = name.trim();
    if (phone) student.phone = phone.trim();

    res.status(200).json({
      message: "Student updated successfully",
      student
    });
  } catch (error) {
    next(error);
  }
};

const deleteStudent = (req, res, next) => {
  try {
    const id = Number(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ success: false, message: "Invalid student ID" });
    }

    const index = students.findIndex((s) => s.id === id);
    if (index === -1) {
      return res.status(404).json({ success: false, message: "Student not found" });
    }

    const hasResults = results.some((r) => r.studentId === id);
    if (hasResults) {
      return res.status(400).json({
        success: false,
        message: "Cannot delete student with existing results. Delete the results first."
      });
    }

    students.splice(index, 1);

    res.status(200).json({ message: "Student deleted successfully" });
  } catch (error) {
    next(error);
  }
};

module.exports = { createStudent, getAllStudents, getStudentById, updateStudent, deleteStudent };
