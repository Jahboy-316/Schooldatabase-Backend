const { teachers, getNextTeacherId } = require("../../data/teachers");
const { subjects } = require("../../data/subjects");
const { classes } = require("../../data/classes");
const { users } = require("../../data/users");
const { validateCreateTeacher, validateUpdateTeacher } = require("../../validators/teacherValidator");

const createTeacher = (req, res, next) => {
  try {
    const error = validateCreateTeacher(req.body);
    if (error) {
      return res.status(400).json({ success: false, message: error });
    }

    const { name, email, phone, userId } = req.body;
    const subjectVal = req.body.subject !== undefined ? req.body.subject : req.body.subjectId;
    const normalizedEmail = email.toLowerCase().trim();

    const existingTeacher = teachers.find((t) => t.email === normalizedEmail);
    if (existingTeacher) {
      return res.status(409).json({ success: false, message: "A teacher with this email already exists" });
    }

    let linkedUserId = userId || null;
    if (linkedUserId) {
      const user = users.find((u) => u.id === linkedUserId);
      if (!user) {
        return res.status(404).json({ success: false, message: "User not found" });
      }
      if (user.role !== "teacher") {
        return res.status(400).json({ success: false, message: "User is not a teacher" });
      }
      const alreadyLinked = teachers.find((t) => t.userId === linkedUserId);
      if (alreadyLinked) {
        return res.status(409).json({ success: false, message: "This user is already linked to a teacher record" });
      }
    } else {
      const matchingUser = users.find((u) => u.email === normalizedEmail && u.role === "teacher");
      if (matchingUser && !teachers.some((t) => t.userId === matchingUser.id)) {
        linkedUserId = matchingUser.id;
      }
    }

    if (subjectVal !== undefined && subjectVal !== null) {
      const subject = subjects.find((s) => s.id === subjectVal);
      if (!subject) {
        return res.status(404).json({ success: false, message: "Subject not found" });
      }
    }

    const newTeacher = {
      id: getNextTeacherId(),
      userId: linkedUserId,
      name: name.trim(),
      email: normalizedEmail,
      phone: phone.trim(),
      subject: (subjectVal !== undefined && subjectVal !== null) ? subjectVal : null,
      subjectId: (subjectVal !== undefined && subjectVal !== null) ? subjectVal : null,
      createdAt: new Date().toISOString()
    };

    teachers.push(newTeacher);

    res.status(201).json({
      message: "Teacher created successfully",
      teacher: newTeacher
    });
  } catch (error) {
    next(error);
  }
};

const getAllTeachers = (req, res, next) => {
  try {
    res.status(200).json({
      message: "Teachers retrieved successfully",
      teachers
    });
  } catch (error) {
    next(error);
  }
};

const getTeacherById = (req, res, next) => {
  try {
    const id = Number(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ success: false, message: "Invalid teacher ID" });
    }

    const teacher = teachers.find((t) => t.id === id);
    if (!teacher) {
      return res.status(404).json({ success: false, message: "Teacher not found" });
    }

    res.status(200).json({
      message: "Teacher retrieved successfully",
      teacher
    });
  } catch (error) {
    next(error);
  }
};

const updateTeacher = (req, res, next) => {
  try {
    const id = Number(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ success: false, message: "Invalid teacher ID" });
    }

    const teacher = teachers.find((t) => t.id === id);
    if (!teacher) {
      return res.status(404).json({ success: false, message: "Teacher not found" });
    }

    const error = validateUpdateTeacher(req.body);
    if (error) {
      return res.status(400).json({ success: false, message: error });
    }

    const { name, email, phone } = req.body;
    const subjectVal = req.body.subject !== undefined ? req.body.subject : req.body.subjectId;

    if (email) {
      const normalizedEmail = email.toLowerCase().trim();
      const duplicate = teachers.find((t) => t.email === normalizedEmail && t.id !== id);
      if (duplicate) {
        return res.status(409).json({ success: false, message: "A teacher with this email already exists" });
      }
      teacher.email = normalizedEmail;
    }

    if (subjectVal !== undefined) {
      if (subjectVal !== null) {
        const subject = subjects.find((s) => s.id === subjectVal);
        if (!subject) {
          return res.status(404).json({ success: false, message: "Subject not found" });
        }
      }
      teacher.subject = subjectVal;
      teacher.subjectId = subjectVal;
    }

    if (name) teacher.name = name.trim();
    if (phone) teacher.phone = phone.trim();

    res.status(200).json({
      message: "Teacher updated successfully",
      teacher
    });
  } catch (error) {
    next(error);
  }
};

const deleteTeacher = (req, res, next) => {
  try {
    const id = Number(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ success: false, message: "Invalid teacher ID" });
    }

    const index = teachers.findIndex((t) => t.id === id);
    if (index === -1) {
      return res.status(404).json({ success: false, message: "Teacher not found" });
    }

    const hasClasses = classes.some((c) => c.teacherId === id);
    if (hasClasses) {
      return res.status(400).json({
        success: false,
        message: "Cannot delete teacher assigned to a class. Reassign the class teacher first."
      });
    }

    teachers.splice(index, 1);

    res.status(200).json({ message: "Teacher deleted successfully" });
  } catch (error) {
    next(error);
  }
};

module.exports = { createTeacher, getAllTeachers, getTeacherById, updateTeacher, deleteTeacher };
