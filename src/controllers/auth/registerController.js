const bcrypt = require("bcrypt");
const { users, getNextUserId } = require("../../data/users");
const { students } = require("../../data/students");
const { teachers } = require("../../data/teachers");
const { validateRegistration } = require("../../validators/authValidator");

const register = async (req, res, next) => {
  try {
    const error = validateRegistration(req.body);
    if (error) {
      return res.status(400).json({ success: false, message: error });
    }

    const { firstName, surname, email, password, role } = req.body;
    const normalizedEmail = email.toLowerCase().trim();

    const existingUser = users.find((u) => u.email === normalizedEmail);
    if (existingUser) {
      return res.status(409).json({ success: false, message: "Email already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = {
      id: getNextUserId(),
      firstName: firstName.trim(),
      surname: surname.trim(),
      email: normalizedEmail,
      password: hashedPassword,
      role: role.toLowerCase().trim(),
      createdAt: new Date().toISOString()
    };

    users.push(newUser);

    if (newUser.role === "student") {
      const matchingStudent = students.find((s) => s.email === normalizedEmail && !s.userId);
      if (matchingStudent) {
        matchingStudent.userId = newUser.id;
      }
    } else if (newUser.role === "teacher") {
      const matchingTeacher = teachers.find((t) => t.email === normalizedEmail && !t.userId);
      if (matchingTeacher) {
        matchingTeacher.userId = newUser.id;
      }
    }

    const { password: _, ...userWithoutPassword } = newUser;

    res.status(201).json({
      message: "User registered successfully",
      user: userWithoutPassword
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { register };
